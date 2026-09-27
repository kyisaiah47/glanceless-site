#!/usr/bin/env node
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const puppeteer = require('puppeteer-core');
const { launchSafe } = await import('/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs');
const root = resolve(new URL('..', import.meta.url).pathname);
const out = resolve(root, 'review');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const base = process.argv.find((v) => v.startsWith('http')) || 'http://localhost:3308';
const browser = await launchSafe(puppeteer, { headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
const response = await page.goto(base + '/', { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
const tiles = Math.ceil(height / 900);
for (let i = 0; i < tiles; i++) {
  await page.evaluate((y) => scrollTo(0, y), i * 900);
  await new Promise((resolve) => setTimeout(resolve, 180));
  await page.screenshot({ path: resolve(out, `glanceless-${String(i + 1).padStart(2, '0')}.png`) });
}
const ledger = { status: response?.status() ?? null, viewport: 1440, height, tiles };
writeFileSync(resolve(out, 'ledger.json'), JSON.stringify(ledger, null, 2) + '\n');
await browser.close();
console.log(`glanceless: ${ledger.status} at 1440px, ${tiles} tiled view(s), ${height}px`);
