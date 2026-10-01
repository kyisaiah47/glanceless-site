#!/usr/bin/env node
/* PHONE OVERFLOW GATE for both views. Measures only: it takes no screenshot at any width.
 *
 *   node scripts/mobile-gate.mjs [base]
 *
 * Fails when any route in either view scrolls sideways at 390, or when the welcome dialog does
 * not fit the viewport and scroll inside itself. */
import { createRequire } from 'node:module';
import { guardPlaywrightPage } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3308';
const fails = [];
const oks = [];
const check = (ok, what) => (ok ? oks : fails).push(what);

const browser = await chromium.launch({ args: ['--mute-audio'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await guardPlaywrightPage(await ctx.newPage());
for (const v of ['simple', 'console']) {
  for (const r of ['/', '/guides/what-does-glanceless-check', '/guides/how-to-check-rendered-webpage', '/nope-404']) {
    await page.goto(`${BASE}${r}?view=${v}&welcome=0`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    check(w <= 390, `390 ${v} ${r} scrollWidth ${w}`);
  }
}
/* every disclosure on the Simple home open at once, then re-measure */
await page.goto(`${BASE}/?view=simple&welcome=0`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
for (const b of await page.locator('.sv-disclosure > button').all()) await b.click();
await page.waitForTimeout(500);
const open = await page.evaluate(() => document.documentElement.scrollWidth);
check(open <= 390, `390 simple / with every disclosure open, scrollWidth ${open}`);

await page.goto(`${BASE}/?view=simple`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const fits = await page.locator('dialog.sv-welcome').evaluate((d) => {
  const r = d.getBoundingClientRect();
  return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && getComputedStyle(d).overflowY === 'auto';
});
check(fits, 'welcome fits a 390 viewport and scrolls inside itself');
await browser.close();
for (const o of oks) process.stdout.write(`  ok    ${o}\n`);
for (const f of fails) process.stdout.write(`  FAIL  ${f}\n`);
process.stdout.write(`\n${oks.length} held, ${fails.length} refused\n`);
process.exit(fails.length ? 1 : 0);
