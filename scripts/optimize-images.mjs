#!/usr/bin/env node
// Convert PNGs in public/blog/ and public/showcase/ to WebP for ~60-70%
// smaller payloads. Originals are kept so existing references that haven't
// been migrated still work. Idempotent — skips files whose .webp is newer.
import { readdir, stat } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dirs = [resolve(root, 'public/blog'), resolve(root, 'public/showcase')];

async function convert(file) {
  const out = file.replace(/\.png$/i, '.webp');
  try {
    const [pngStat, webpStat] = await Promise.all([stat(file), stat(out).catch(() => null)]);
    if (webpStat && webpStat.mtimeMs >= pngStat.mtimeMs) return { file, skipped: true };
  } catch {}
  await sharp(file).webp({ quality: 82, effort: 6 }).toFile(out);
  return { file, skipped: false };
}

let total = 0;
let written = 0;
let skipped = 0;
for (const dir of dirs) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    continue;
  }
  for (const name of entries) {
    if (!name.endsWith('.png')) continue;
    total++;
    const file = resolve(dir, name);
    const r = await convert(file);
    if (r.skipped) skipped++;
    else {
      written++;
      console.log(`[img] ${basename(file)} → ${basename(r.file).replace('.png', '.webp')}`);
    }
  }
}

console.log(`[img] ${total} PNGs scanned, ${written} converted, ${skipped} unchanged`);
