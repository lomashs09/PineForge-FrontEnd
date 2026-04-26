#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SITE = 'https://getpineforge.com';

const blogPostsSource = readFileSync(resolve(root, 'src/data/blogPosts.js'), 'utf8');
const blogEntries = [];
const slugRegex = /slug:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g;
let match;
while ((match = slugRegex.exec(blogPostsSource)) !== null) {
  blogEntries.push({ slug: match[1], date: match[2] });
}

if (blogEntries.length === 0) {
  console.error('[seo] No blog posts found — check src/data/blogPosts.js parsing.');
  process.exit(1);
}

// Programmatic strategy pages — load via dynamic import so we benefit from
// `appliesTo` filtering in JS rather than parsing JSON-by-regex.
const { default: strategies } = await import('../src/data/strategies.js');
const { default: symbols } = await import('../src/data/symbols.js');

const strategyHubPaths = strategies.map((s) => `/strategies/${s.slug}`);
const comboPaths = [];
for (const strat of strategies) {
  for (const sym of symbols) {
    if (strat.appliesTo.includes(sym.category)) {
      comboPaths.push(`/strategies/${sym.slug}-${strat.slug}`);
    }
  }
}

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/pricing',       priority: '0.9', changefreq: 'monthly' },
  { path: '/about',         priority: '0.7', changefreq: 'monthly' },
  { path: '/docs',          priority: '0.8', changefreq: 'weekly' },
  { path: '/support',       priority: '0.6', changefreq: 'monthly' },
  { path: '/blog',          priority: '0.9', changefreq: 'weekly' },
  { path: '/strategies',    priority: '0.95', changefreq: 'weekly' },
  { path: '/login',         priority: '0.5', changefreq: 'yearly' },
  { path: '/signup',        priority: '0.7', changefreq: 'yearly' },
  { path: '/terms',         priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy',       priority: '0.3', changefreq: 'yearly' },
  { path: '/cancellation',  priority: '0.3', changefreq: 'yearly' },
];

const urls = [
  ...staticPages.map((p) => ({ ...p, lastmod: today })),
  ...blogEntries.map((b) => ({
    path: `/blog/${b.slug}`,
    lastmod: b.date,
    changefreq: 'monthly',
    priority: '0.8',
  })),
  ...strategyHubPaths.map((p) => ({
    path: p,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  ...comboPaths.map((p) => ({
    path: p,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.75',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /bots
Disallow: /library
Disallow: /backtest
Disallow: /accounts
Disallow: /billing
Disallow: /payment-success
Disallow: /verify-email
Disallow: /check-email
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;

const publicDir = resolve(root, 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, 'sitemap.xml'), xml, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');

console.log(`[seo] Wrote public/sitemap.xml (${urls.length} URLs) and public/robots.txt`);
