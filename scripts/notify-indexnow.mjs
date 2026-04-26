#!/usr/bin/env node
// Ping IndexNow with every URL in the sitemap. One POST notifies Bing,
// Yandex, Seznam, and Naver simultaneously.
//
// Run after a deploy:           npm run indexnow
// Run with a custom URL list:   node scripts/notify-indexnow.mjs https://x.com/y https://x.com/z
//
// IndexNow verifies ownership by fetching public/<key>.txt — keep that
// file in sync with the API key below or the request will be rejected.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const HOST = 'getpineforge.com';
const KEY = '54bf9eaa4e86aaab70bd22a1bc211b84';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

let urls = process.argv.slice(2);

// If no URLs passed, ping everything in the sitemap.
if (urls.length === 0) {
  const xml = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf8');
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

if (urls.length === 0) {
  console.error('[indexnow] no URLs to submit');
  process.exit(1);
}

// IndexNow accepts up to 10,000 URLs per request — we're well under that
// but chunk anyway for politeness.
const CHUNK = 1000;
const chunks = [];
for (let i = 0; i < urls.length; i += CHUNK) chunks.push(urls.slice(i, i + CHUNK));

let ok = 0;
let fail = 0;
for (const [idx, urlList] of chunks.entries()) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (res.ok || res.status === 202) {
    console.log(`[indexnow] chunk ${idx + 1}/${chunks.length} (${urlList.length} URLs) → ${res.status} ${res.statusText}`);
    ok += urlList.length;
  } else {
    const text = await res.text().catch(() => '');
    console.error(`[indexnow] chunk ${idx + 1} failed: ${res.status} ${res.statusText} ${text}`);
    fail += urlList.length;
  }
}

console.log(`[indexnow] done — ${ok} URLs notified, ${fail} failed`);
if (fail > 0) process.exit(1);
