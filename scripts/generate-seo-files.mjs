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

// Programmatic pages — load via dynamic import so we benefit from
// JS filtering rather than parsing JSON-by-regex.
const { default: strategies } = await import('../src/data/strategies.js');
const { default: symbols } = await import('../src/data/symbols.js');
const { default: glossary } = await import('../src/data/glossary.js');
const { default: comparisons } = await import('../src/data/comparisons.js');
const { default: tools } = await import('../src/data/tools.js');
const { default: pillars } = await import('../src/data/pillars.js');

const strategyHubPaths = strategies.map((s) => `/strategies/${s.slug}`);
const comboPaths = [];
for (const strat of strategies) {
  for (const sym of symbols) {
    if (strat.appliesTo.includes(sym.category)) {
      comboPaths.push(`/strategies/${sym.slug}-${strat.slug}`);
    }
  }
}
const symbolPaths = symbols.map((s) => `/symbols/${s.slug}`);
const glossaryPaths = glossary.map((g) => `/glossary/${g.slug}`);
const comparePaths = comparisons.map((c) => `/compare/${c.slug}`);
const toolPaths = tools.map((t) => `/tools/${t.slug}`);
const pillarPaths = pillars.map((p) => `/guides/${p.slug}`);

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/pricing',       priority: '0.9', changefreq: 'monthly' },
  { path: '/about',         priority: '0.7', changefreq: 'monthly' },
  { path: '/docs',          priority: '0.8', changefreq: 'weekly' },
  { path: '/support',       priority: '0.6', changefreq: 'monthly' },
  { path: '/blog',          priority: '0.9', changefreq: 'weekly' },
  { path: '/strategies',    priority: '0.95', changefreq: 'weekly' },
  { path: '/symbols',       priority: '0.9', changefreq: 'weekly' },
  { path: '/glossary',      priority: '0.85', changefreq: 'monthly' },
  { path: '/compare',       priority: '0.85', changefreq: 'monthly' },
  { path: '/tools',         priority: '0.9', changefreq: 'monthly' },
  { path: '/guides',        priority: '0.95', changefreq: 'weekly' },
  { path: '/onboarding',    priority: '0.7', changefreq: 'monthly' },
  { path: '/changelog',     priority: '0.6', changefreq: 'weekly' },
  { path: '/press',         priority: '0.4', changefreq: 'monthly' },
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
  ...symbolPaths.map((p) => ({
    path: p, lastmod: today, changefreq: 'monthly', priority: '0.8',
  })),
  ...glossaryPaths.map((p) => ({
    path: p, lastmod: today, changefreq: 'monthly', priority: '0.7',
  })),
  ...comparePaths.map((p) => ({
    path: p, lastmod: today, changefreq: 'monthly', priority: '0.8',
  })),
  ...toolPaths.map((p) => ({
    path: p, lastmod: today, changefreq: 'monthly', priority: '0.85',
  })),
  ...pillarPaths.map((p) => ({
    path: p, lastmod: today, changefreq: 'monthly', priority: '0.9',
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
Sitemap: ${SITE}/image-sitemap.xml
`;

const publicDir = resolve(root, 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, 'sitemap.xml'), xml, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');

// ── Image sitemap — gives Google Image Search direct access to every
// blog hero. Separate from the URL sitemap so the regular sitemap stays
// uncluttered.
// Build per-post image refs by parsing slug, title, and image in any order.
const blogPostsRaw = blogPostsSource;
const imageRefs = [];
const postBlockRegex = /\{[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?\},/g;
let imgMatch;
while ((imgMatch = postBlockRegex.exec(blogPostsRaw)) !== null) {
  imageRefs.push({
    slug: imgMatch[1],
    title: imgMatch[2].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    image: imgMatch[3],
  });
}
const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageRefs
  .map(
    (r) => `  <url>
    <loc>${SITE}/blog/${r.slug}</loc>
    <image:image>
      <image:loc>${SITE}${r.image}</image:loc>
      <image:title>${r.title}</image:title>
    </image:image>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(resolve(publicDir, 'image-sitemap.xml'), imageSitemapXml, 'utf8');

// ── RSS feed — drives blog discoverability via feed readers. Apple News,
// Feedly, Inoreader, Substack importers all consume this.
function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c],
  );
}
const blogFullEntries = [];
const fullRegex = /\{[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?date:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?\},/g;
let fullMatch;
while ((fullMatch = fullRegex.exec(blogPostsRaw)) !== null) {
  blogFullEntries.push({
    slug: fullMatch[1],
    title: fullMatch[2],
    excerpt: fullMatch[3],
    date: fullMatch[4],
    image: fullMatch[5],
  });
}
blogFullEntries.sort((a, b) => (a.date < b.date ? 1 : -1));

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>PineForge Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Trading strategies, Pine Script tutorials, and algorithmic trading insights from PineForge.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${blogFullEntries
  .slice(0, 30)
  .map(
    (e) => `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${SITE}/blog/${e.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${e.slug}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <description>${escapeXml(e.excerpt)}</description>
      <enclosure url="${SITE}${e.image}" type="image/webp" />
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;
writeFileSync(resolve(publicDir, 'feed.xml'), rssXml, 'utf8');

console.log(`[seo] Wrote sitemap.xml (${urls.length}), image-sitemap.xml (${imageRefs.length}), feed.xml (${Math.min(blogFullEntries.length, 30)} items), robots.txt`);
