#!/usr/bin/env node
/**
 * Postbuild prerender: serve dist/ on a local port, visit each public route
 * with headless Chrome, dump the rendered HTML to <route>/index.html.
 *
 * The SPA stays intact — each prerendered file simply contains hydratable
 * markup so crawlers, social unfurls, and slow networks see real content.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const PORT = 4173;

if (!existsSync(distDir)) {
  console.error('[prerender] dist/ not found — run `vite build` first.');
  process.exit(1);
}

// Snapshot the pristine SPA shell BEFORE any prerendering happens.
// The fallback handler always returns this — otherwise as soon as we write
// dist/index.html for `/`, every later route would inherit its baked-in SEO.
const SPA_SHELL = readFileSync(resolve(distDir, 'index.html'), 'utf8');

// Parse blog post slugs from source so prerender stays in sync with content.
const blogSource = readFileSync(resolve(root, 'src/data/blogPosts.js'), 'utf8');
const blogSlugs = [];
const slugRegex = /slug:\s*"([^"]+)"/g;
let m;
while ((m = slugRegex.exec(blogSource)) !== null) blogSlugs.push(m[1]);

// Programmatic routes — load via dynamic import.
const { default: strategies } = await import('../src/data/strategies.js');
const { default: symbols } = await import('../src/data/symbols.js');
const { default: glossary } = await import('../src/data/glossary.js');
const { default: comparisons } = await import('../src/data/comparisons.js');
const { default: tools } = await import('../src/data/tools.js');
const { default: pillars } = await import('../src/data/pillars.js');

const strategyHubRoutes = strategies.map((s) => `/strategies/${s.slug}`);
const comboRoutes = [];
for (const strat of strategies) {
  for (const sym of symbols) {
    if (strat.appliesTo.includes(sym.category)) {
      comboRoutes.push(`/strategies/${sym.slug}-${strat.slug}`);
    }
  }
}
const symbolRoutes = symbols.map((s) => `/symbols/${s.slug}`);
const glossaryRoutes = glossary.map((g) => `/glossary/${g.slug}`);
const compareRoutes = comparisons.map((c) => `/compare/${c.slug}`);
const toolRoutes = tools.map((t) => `/tools/${t.slug}`);
const pillarRoutes = pillars.map((p) => `/guides/${p.slug}`);

const routes = [
  '/',
  '/pricing',
  '/about',
  '/docs',
  '/support',
  '/blog',
  '/strategies',
  '/symbols',
  '/glossary',
  '/compare',
  '/tools',
  '/guides',
  '/onboarding',
  '/changelog',
  '/press',
  '/login',
  '/signup',
  '/terms',
  '/privacy',
  '/cancellation',
  '/404',
  ...blogSlugs.map((s) => `/blog/${s}`),
  ...strategyHubRoutes,
  ...comboRoutes,
  ...symbolRoutes,
  ...glossaryRoutes,
  ...compareRoutes,
  ...toolRoutes,
  ...pillarRoutes,
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ico':  'image/x-icon',
};

function serveStatic() {
  return createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      // Always serve the pristine shell for the SPA root — never the
      // (possibly already prerendered) dist/index.html on disk.
      if (urlPath === '/' || urlPath === '/index.html') {
        res.setHeader('Content-Type', MIME['.html']);
        res.end(SPA_SHELL);
        return;
      }
      let filePath = resolve(distDir, '.' + urlPath);
      let fileExists = false;
      try {
        const s = await stat(filePath);
        if (s.isDirectory()) {
          filePath = resolve(filePath, 'index.html');
          try {
            await stat(filePath);
            fileExists = true;
          } catch {
            fileExists = false;
          }
        } else {
          fileExists = true;
        }
      } catch {
        fileExists = false;
      }
      if (!fileExists) {
        // Unknown / unbuilt route — return the pristine SPA shell so React
        // Router can mount client-side without inheriting another route's SEO.
        res.setHeader('Content-Type', MIME['.html']);
        res.end(SPA_SHELL);
        return;
      }
      const data = await readFile(filePath);
      res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream');
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });
}

async function run() {
  const server = serveStatic();
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log(`[prerender] static server on http://127.0.0.1:${PORT}`);

  // Restart the browser every N routes — long-running puppeteer sessions
  // accumulate state and eventually time out spawning new pages.
  const ROUTES_PER_BROWSER = 30;

  let browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    protocolTimeout: 120000,
  });

  let ok = 0;
  let fail = 0;
  let routesSinceRestart = 0;

  try {
    for (const route of routes) {
      if (routesSinceRestart >= ROUTES_PER_BROWSER) {
        await browser.close();
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          protocolTimeout: 120000,
        });
        routesSinceRestart = 0;
      }

      const url = `http://127.0.0.1:${PORT}${route}`;
      const page = await browser.newPage();
      try {
        // domcontentloaded fires once the HTML is parsed — React + helmet then
        // run synchronously. We add a fixed settle delay below for helmet's
        // microtask flush; networkidle0 hangs on long-tail requests (toaster
        // styles, lazy fonts) and adds no SEO value.
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 400));
        const html = await page.content();

        // Strip the runtime helmet attribute so re-renders are deterministic.
        const cleaned = html.replace(/ data-rh="true"/g, '');

        const outPath = route === '/'
          ? resolve(distDir, 'index.html')
          : route === '/404'
            ? resolve(distDir, '404.html')
            : resolve(distDir, route.replace(/^\//, ''), 'index.html');
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, cleaned, 'utf8');
        console.log(`[prerender] ✓ ${route} → ${outPath.replace(distDir + '/', '')}`);
        ok++;
      } catch (err) {
        console.error(`[prerender] ✗ ${route}: ${err.message}`);
        fail++;
      } finally {
        await page.close();
        routesSinceRestart++;
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`[prerender] done — ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

run().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
