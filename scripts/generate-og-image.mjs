#!/usr/bin/env node
// Renders the default Open Graph image (1200×630) used for social
// previews when a page doesn't supply its own. Run via `npm run og`
// when the brand or tagline changes.
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'og-default.png');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #030712;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .glow-1 { position: absolute; left: -160px; top: -160px; width: 600px; height: 600px;
    background: radial-gradient(circle, #10b98140 0%, transparent 60%); border-radius: 50%; }
  .glow-2 { position: absolute; right: -160px; top: 80px; width: 500px; height: 500px;
    background: radial-gradient(circle, #2563eb30 0%, transparent 60%); border-radius: 50%; }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(16,185,129,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,.06) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .container { position: relative; z-index: 2; padding: 80px; height: 100%;
    display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 16px; }
  .flame { width: 56px; height: 56px; }
  .name { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }
  .headline { font-size: 84px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.04; max-width: 980px; }
  .accent { color: #34d399; }
  .sub { font-size: 28px; color: #9ca3af; margin-top: 24px; max-width: 880px; line-height: 1.4; }
  .footer { display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid #1f2937; padding-top: 28px; }
  .url { font-size: 24px; color: #6b7280; font-weight: 500; }
  .stats { display: flex; gap: 36px; }
  .stat { text-align: right; }
  .stat-num { font-size: 28px; font-weight: 700; color: #34d399; }
  .stat-label { font-size: 16px; color: #6b7280; margin-top: 2px; }
</style></head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="grid"></div>
  <div class="container">
    <div class="brand">
      <svg class="flame" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path>
      </svg>
      <span class="name">PineForge</span>
    </div>
    <div>
      <div class="headline">Build & deploy <span class="accent">trading bots</span><br>with Pine Script.</div>
      <div class="sub">Backtest on real data. Deploy to MT5. Pay only for what you use — $0.022/hr per active bot.</div>
    </div>
    <div class="footer">
      <div class="url">getpineforge.com</div>
      <div class="stats">
        <div class="stat"><div class="stat-num">28+</div><div class="stat-label">strategies</div></div>
        <div class="stat"><div class="stat-num">13</div><div class="stat-label">symbols</div></div>
        <div class="stat"><div class="stat-num">24/7</div><div class="stat-label">automation</div></div>
      </div>
    </div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'domcontentloaded' });
const buffer = await page.screenshot({ type: 'png', omitBackground: false });
await writeFile(out, buffer);
await browser.close();
console.log(`[og] wrote ${out}`);
