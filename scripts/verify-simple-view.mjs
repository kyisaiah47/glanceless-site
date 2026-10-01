#!/usr/bin/env node
/* SIMPLE VIEW CHECK, at 1440. Drives the running dev server with bundled Chromium and fails
 * closed. Phone overflow is scripts/mobile-gate.mjs, which measures and never photographs.
 *
 *   node scripts/verify-simple-view.mjs [base] [shotDir]
 *
 * It sends nothing anywhere: the site has no API routes, no form posts and no checkout. Every
 * page carries the safe-chrome click guard, so an anchor to mail can never hand off to another
 * app; the contact address is only read from the DOM. */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { guardPlaywrightPage } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3308';
const SHOTS = process.argv[3] || '';
const fails = [];
const oks = [];
const check = (ok, what) => (ok ? oks : fails).push(what);

const browser = await chromium.launch({ args: ['--mute-audio'] });
const open = async (ctx) => guardPlaywrightPage(await ctx.newPage());
const shot = async (page, name, opts = {}) => {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, `glanceless-site-${name}.png`), fullPage: true, ...opts });
};
const settle = (page) => page.waitForTimeout(500);
const isOpen = (page) => page.locator('dialog.sv-welcome').evaluate((d) => d.open);
const DESKTOP = { width: 1440, height: 900 };

/* 1. A clean visitor: Console, welcome open on `/`. */
{
  const ctx = await browser.newContext({ viewport: DESKTOP });
  const page = await open(ctx);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await settle(page);
  check(await page.locator('[data-view="console"]').count() === 1, 'clean visitor gets Console');
  check(await isOpen(page), 'welcome opens by itself on /');
  check((await page.locator('dialog.sv-welcome').textContent()).includes('ILLUSTRATION'), 'welcome carries a labelled illustration');
  await shot(page, 'welcome', { fullPage: false });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check(!(await isOpen(page)), 'Escape closes the welcome');
  check(await page.locator('[data-view="console"]').count() === 1, 'closing does not change the view');

  await page.locator('.sv-tools button', { hasText: 'Start here' }).click();
  await page.waitForTimeout(400);
  check(await isOpen(page), 'Start here reopens the welcome');
  await page.mouse.click(8, 8);
  await page.waitForTimeout(400);
  check(!(await isOpen(page)), 'backdrop click closes the welcome');

  await page.locator('.sv-tools button', { hasText: 'Start here' }).click();
  await page.waitForTimeout(400);
  await page.locator('.sv-welcome-foot input').check();
  await page.locator('.sv-choices button', { hasText: 'Simple' }).click();
  await page.waitForTimeout(400);
  check(await page.locator('[data-view="simple"]').count() === 1, 'choosing Simple switches the page');
  await page.reload({ waitUntil: 'networkidle' });
  await settle(page);
  check(!(await isOpen(page)), 'suppression survives a reload');
  check(await page.locator('[data-view="simple"]').count() === 1, 'saved Simple survives a reload');
  await page.goto(`${BASE}/guides/what-does-glanceless-check?x=1`, { waitUntil: 'networkidle' });
  await settle(page);
  check(await page.locator('[data-view="simple"]').count() === 1, 'saved Simple survives route navigation');
  await page.goto(`${BASE}/guides/what-does-glanceless-check?view=console&x=1`, { waitUntil: 'networkidle' });
  await settle(page);
  check(await page.locator('[data-view="console"]').count() === 1, 'URL view overrides the saved view');
  await page.locator('.sv-tools button', { hasText: 'Simple' }).click();
  await settle(page);
  const u = new URL(page.url());
  check(u.pathname === '/guides/what-does-glanceless-check' && u.searchParams.get('view') === 'simple' && u.searchParams.get('x') === '1', 'switching rewrites view in place and keeps other params');
  const counts = await page.evaluate(() => [
    document.querySelectorAll('header:not(dialog header)').length,
    document.querySelectorAll('main').length,
    document.querySelectorAll('footer:not(dialog footer)').length,
  ]);
  check(counts.join() === '1,1,1', `one header, main and footer on Simple guide (${counts.join(',')})`);
  await ctx.close();
}

/* 2. Simple home, Simple reading routes, Console home: screens and a populated disclosure. */
{
  const ctx = await browser.newContext({ viewport: DESKTOP, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await open(ctx);
  await page.goto(`${BASE}/?view=simple&welcome=0`, { waitUntil: 'networkidle' });
  await settle(page);
  check(!(await isOpen(page)), 'welcome=0 skips the automatic welcome');
  const h1 = await page.locator('h1').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  check(h1 >= 56 && h1 <= 64, `Simple h1 is ${h1}px`);
  const input = await page.locator('.sv-command').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  check(input >= 16, `command field is ${input}px`);
  const btn = page.locator('#try .sv-primary');
  const box = await btn.boundingBox();
  check(box && box.y + box.height < 900, 'the primary action is in the first screen');
  await btn.click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check(clip === 'npx glanceless demo', 'Copy puts the command on the clipboard');
  await shot(page, 'simple-home');

  const dis = page.locator('.sv-result .sv-disclosure > button', { hasText: 'findings' });
  await dis.click();
  await page.waitForTimeout(400);
  check(await dis.getAttribute('aria-expanded') === 'true', 'disclosure exposes aria-expanded');
  const ctl = await dis.getAttribute('aria-controls');
  const body = page.locator(`[id="${ctl}"]`);
  check(!(await body.evaluate((e) => e.inert)), 'an open disclosure body is not inert');
  const rows = await body.locator('li').count();
  check(rows === 9, `example lists ${rows} findings from the capture`);
  check(await body.evaluate((e) => getComputedStyle(e).opacity) === '1', 'open body is painted at full opacity');
  await shot(page, 'simple-example-open');
  const closed = page.locator('.sv-result .sv-disclosure > button', { hasText: 'full output' });
  const cid = await closed.getAttribute('aria-controls');
  check(await page.locator(`[id="${cid}"]`).evaluate((e) => e.inert), 'a closed disclosure body is inert');
  const mail = await page.locator('a[href^="mailto:"]').first().getAttribute('href');
  check(mail === 'mailto:hello@thecompound.tech', 'contact address is read from the DOM');

  for (const r of ['guides/what-does-glanceless-check', 'guides/how-to-check-rendered-webpage']) {
    await page.goto(`${BASE}/${r}?view=simple`, { waitUntil: 'networkidle' });
    await settle(page);
    check(await page.locator('.sv-nav').count() === 1 && await page.locator('.mast').count() === 0, `Simple /${r} has Simple chrome only`);
    await shot(page, `simple-${r.split('/').pop()}`);
  }
  await page.goto(`${BASE}/nope-404?view=simple`, { waitUntil: 'networkidle' });
  await settle(page);
  check((await page.locator('h1').textContent()).includes('does not exist'), 'Simple 404 offers recovery');

  await page.goto(`${BASE}/?view=console&welcome=0`, { waitUntil: 'networkidle' });
  await settle(page);
  check(await page.locator('.mast').count() === 1 && await page.locator('.frame').count() === 1 && await page.locator('.right-rail').count() === 1, 'Console home keeps its masthead and frame');
  check(await page.locator('.sv-tools').count() === 1, 'Console footer carries the view controls');
  await shot(page, 'console-home');
  await ctx.close();
}

await browser.close();
for (const o of oks) process.stdout.write(`  ok    ${o}\n`);
for (const f of fails) process.stdout.write(`  FAIL  ${f}\n`);
process.stdout.write(`\n${oks.length} held, ${fails.length} refused\n`);
process.exit(fails.length ? 1 : 0);
