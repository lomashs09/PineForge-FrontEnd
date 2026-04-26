// Public changelog — the most-recent ship goes at the top.
// Each entry feeds /changelog and the JSON-LD on it.

const changelog = [
  {
    date: '2026-04-27',
    version: 'SEO 2.0',
    headline: 'Strategy library, glossary, comparison pages, and free tools',
    summary: '95+ new programmatic SEO pages — symbol hubs, strategy combos, a 22-term trading glossary, comparison pages vs TradingView/3Commas/MetaEditor/Quantower, and three free calculators (position size, risk-reward, drawdown recovery).',
    items: [
      'New /strategies library with 86 symbol × strategy combo pages',
      'New /symbols hub aggregating best strategies per market',
      'New /glossary with 22 indicator/metric/concept entries',
      'New /compare pages vs major competitors',
      'New /tools — position size, risk-reward, and drawdown recovery calculators',
      'Code-split: lazy-load auth/dashboard routes for faster public-page load',
      'Security headers (CSP, HSTS, Permissions-Policy) added to vercel.json',
      'Cookie consent banner with Google Consent Mode v2',
      'security.txt at /.well-known/',
      'Default Open Graph image (1200×630) for all routes without a per-page image',
    ],
  },
  {
    date: '2026-04-26',
    version: 'SEO 1.0',
    headline: 'SEO foundation — helmet, sitemap, prerender, JSON-LD',
    summary: 'Full server-rendered HTML for every public page so crawlers and social unfurls see real content. 117 URLs in the sitemap, structured data on every route, and a build-time puppeteer prerender step.',
    items: [
      'react-helmet-async per public route — title, description, canonical, OG, Twitter Card',
      'public/sitemap.xml generated at prebuild from blog/strategy/symbol data',
      'public/robots.txt with proper Disallow for protected routes',
      'Puppeteer prerender — 118 routes captured as static HTML',
      'JSON-LD: Organization, WebSite, Article, BreadcrumbList, FAQPage, TechArticle, Product',
      'Real /404 page with noindex meta replaces the soft-404 redirect',
      'cleanUrls + cache headers in vercel.json',
      'Google Ads tag (AW-18121065419) wired to all pages',
    ],
  },
  {
    date: '2026-04-25',
    version: 'Pricing v2',
    headline: 'Switched INR payments back to Stripe (UPI + cards)',
    summary: 'Stripe handles UPI and card payments natively for INR — simpler reconciliation than the prior split.',
    items: [
      'Stripe checkout for INR (UPI + cards)',
      'Webhook handling for checkout.completed and checkout.expired',
      'Updated billing dashboard with FX rate display',
    ],
  },
  {
    date: '2026-04-20',
    version: 'Billing v1',
    headline: 'Usage-based pricing page and billing dashboard',
    summary: 'Pay-as-you-go model — bots are charged per hour they run, not per month.',
    items: [
      '$0.022/hr per active bot',
      '$0.002/hr per connected MT5 account',
      '$3.00 one-time MT5 account setup',
      '$0.13 per bot deployment',
      'Add-funds via Stripe (INR) or PayPal (USD)',
    ],
  },
];

export default changelog;
