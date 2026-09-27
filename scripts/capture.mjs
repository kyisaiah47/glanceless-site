#!/usr/bin/env node
/* FREEZE WHAT THE REAL glanceless PRINTS INTO THIS TREE.
 *
 *   npm run capture
 *
 * Every figure this console shows comes from here. Nothing on the page is typed from a reading of
 * the package: the terminal block, the seven rule summaries, the nine findings on the failing
 * fixture and the suite's own tally are all output this script ran and copied. A page that retypes
 * a program drifts from it the first time the program changes a word, and nothing errors when it
 * does, because the block still looks like output.
 *
 * IT EMITS A MODULE, NOT A DATA FILE. The Worker this site ships to has no filesystem, so a page
 * that reads data/ at request time answers 500 in production and 200 in dev. The capture is
 * compiled in.
 *
 * STDERR IS MERGED. `glanceless demo` narrates on stdout and prints the failing half through the
 * report writer, so taking one stream alone can come back without the findings the demo exists to
 * show and still look like a successful capture.
 *
 * ANSI IS STRIPPED AND NOTHING ELSE IS. Colour belongs to the terminal, not to the program. Every
 * other byte is reproduced as it came, and the ephemeral loopback port the package serves its
 * fixtures on is the one substitution, because that number is different on every run and is not a
 * fact about the package.
 *
 * AND IT REFUSES TO WRITE A CAPTURE THAT LOST WHAT IT EXISTS TO SHOW. Nine findings on the failing
 * page, none on the clean one, seven rules, a green suite. Anything else is exit 2 and no file.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* The package, in the order a reader would reach for it: an install in this tree first, then the
 * working copy on this machine. A capture that silently fell back to something else would be a
 * capture of the wrong program, so the candidates are named and the miss is fatal. */
const CANDIDATES = [
  join(ROOT, 'node_modules/glanceless/bin/glanceless.mjs'),
  join(homedir(), 'CompoundLabs/packages/glanceless/bin/glanceless.mjs'),
];
const BIN = CANDIDATES.find((p) => existsSync(p));
if (!BIN) {
  console.error('capture: no glanceless on this machine. Looked at:');
  for (const c of CANDIDATES) console.error('  ' + c);
  process.exit(2);
}
const PKG_DIR = resolve(BIN, '../..');
const PKG = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8'));

const sh = (cmd, ok = [0]) => {
  try {
    return { code: 0, out: execFileSync('sh', ['-c', cmd], { encoding: 'utf8', cwd: PKG_DIR, maxBuffer: 8 << 20 }) };
  } catch (e) {
    if (!ok.includes(e.status)) throw e;
    return { code: e.status, out: String(e.stdout || '') + String(e.stderr || '') };
  }
};

const ESC = String.fromCharCode(27);
const ansi = new RegExp(ESC + '\\[[0-9;]*[A-Za-z]', 'g');
const clean = (s) => s.replace(ansi, '').replace(/\r\n/g, '\n').trimEnd();

/* THE TERMINAL BLOCK. The port is the one byte rewritten: the package serves its own fixtures on
 * an ephemeral loopback port, so the number is different every run and is not a fact about it. */
const demo = clean(sh(`node ${JSON.stringify(BIN)} demo 2>&1`, [0, 1]).out).replace(
  /http:\/\/127\.0\.0\.1:\d+\//g,
  'http://127.0.0.1:PORT/',
);

/* THE FINDINGS, STRUCTURED. The grid on the page is these rows, not a retyping of the block above.
 * page-chrome is skipped for both fixtures because it measures a route against its own site's front
 * page, and a single file served on its own has no site to be measured against. */
const jsonRun = (file) => {
  const r = sh(`node ${JSON.stringify(BIN)} test/fixtures/${file} --skip page-chrome --json 2>/dev/null`, [0, 1]);
  return { code: r.code, data: JSON.parse(r.out) };
};
const dirty = jsonRun('dirty.html');
const cleanPage = jsonRun('clean.html');

/* THE SEVEN RULES, FROM THE PACKAGE'S OWN REGISTRY. Reading the module means a rule renamed, added
 * or dropped upstream changes this page rather than leaving it describing a version that is gone. */
const rules = JSON.parse(
  execFileSync(
    'node',
    [
      '--input-type=module',
      '-e',
      `import(${JSON.stringify(join(PKG_DIR, 'src/rules/index.mjs'))}).then((m) => process.stdout.write(JSON.stringify(m.RULES.map((r) => ({ id: r.id, title: r.title, summary: r.summary })))));`,
    ],
    { encoding: 'utf8' },
  ),
);

/* THE SUITE. The tally is the suite's own last line, run here, not a count of the lines in it. */
const suite = clean(sh('bash test/run.sh 2>&1', [0, 1]).out);
const tally = /(\d+) passed, (\d+) failed/.exec(suite);

const patterns = JSON.parse(readFileSync(join(PKG_DIR, 'src/noise-patterns.json'), 'utf8'));

const dirtyFindings = dirty.data.pages.flatMap((p) => p.findings);
const cleanFindings = cleanPage.data.pages.flatMap((p) => p.findings);

const problems = [];
if (rules.length !== 7) problems.push(`expected 7 rules, got ${rules.length}`);
if (dirty.code !== 1) problems.push(`the failing fixture exited ${dirty.code}, expected 1`);
if (cleanPage.code !== 0) problems.push(`the clean fixture exited ${cleanPage.code}, expected 0`);
if (dirtyFindings.length !== 9) problems.push(`expected 9 findings on the failing fixture, got ${dirtyFindings.length}`);
if (cleanFindings.length !== 0) problems.push(`expected 0 findings on the clean fixture, got ${cleanFindings.length}`);
if (!/That is the whole product\.$/.test(demo)) problems.push('the demo block does not end on the demo’s own verdict line');
if (!tally) problems.push('the suite printed no tally line');
else if (tally[2] !== '0') problems.push(`the suite reports ${tally[2]} failing assertion(s)`);
if (problems.length) {
  console.error('capture: nothing written. ' + problems.join('; '));
  process.exit(2);
}

const glyphFor = {
  contrast: 'circle-half',
  'dead-column': 'columns',
  'page-chrome': 'browser',
  figure: 'image',
  'stat-eyebrow': 'hash',
  'table-shape': 'table',
  noise: 'quotes',
};

mkdirSync(resolve(ROOT, 'src/lib'), { recursive: true });
writeFileSync(
  resolve(ROOT, 'src/lib/measured.ts'),
  [
    '/* GENERATED by scripts/capture.mjs. Do not edit.',
    ' *',
    ' * Everything here was printed by the glanceless package on this machine and copied. Colour',
    ' * removed and the ephemeral fixture port rewritten; every other byte is the program’s own.',
    ' * Re-run `npm run capture` to refresh it.',
    ' */',
    `export const VERSION = ${JSON.stringify(PKG.version)};`,
    `export const CAPTURED_AT = ${JSON.stringify(new Date().toISOString().slice(0, 10))};`,
    `export const NODE_ENGINE = ${JSON.stringify(PKG.engines.node)};`,
    `export const LICENCE = ${JSON.stringify(PKG.license)};`,
    `export const PEER = ${JSON.stringify(PKG.peerDependencies)};`,
    `export const DEPENDENCY_COUNT = ${Object.keys(PKG.dependencies || {}).length};`,
    `export const DEMO_OUTPUT = ${JSON.stringify(demo)};`,
    `export const DEMO_LINES = ${demo.split('\n').length};`,
    '',
    'export type Rule = { id: string; title: string; summary: string; glyph: string };',
    `export const RULES: Rule[] = ${JSON.stringify(
      rules.map((r) => ({ ...r, glyph: glyphFor[r.id] })),
      null,
      1,
    )};`,
    '',
    'export type Finding = { rule: string; sel: string; msg: string; measured: Record<string, unknown> };',
    `export const FINDINGS: Finding[] = ${JSON.stringify(dirtyFindings, null, 1)};`,
    `export const CLEAN_FINDINGS = ${cleanFindings.length};`,
    `export const FAILING_EXIT = ${dirty.code};`,
    `export const CLEAN_EXIT = ${cleanPage.code};`,
    `export const RULES_RUN_ON_FIXTURES = ${JSON.stringify(dirty.data.rules)};`,
    `export const VIEWPORT = ${dirty.data.viewports[0]};`,
    '',
    `export const SUITE_PASSED = ${Number(tally[1])};`,
    `export const SUITE_FAILED = ${Number(tally[2])};`,
    `export const NOISE_PATTERNS = ${patterns.patterns.length};`,
    `export const NOISE_FAMILIES = ${Object.keys(patterns.families).length};`,
    '',
  ].join('\n'),
);

process.stdout.write(
  `captured glanceless@${PKG.version}: ${rules.length} rules, ${dirtyFindings.length} findings, ` +
    `${tally[1]} assertions, ${demo.split('\n').length} lines of demo output\n`,
);
