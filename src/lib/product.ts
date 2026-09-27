export const PRODUCT = {
  name: 'glanceless',
  slug: 'glanceless',
  host: 'glanceless.thecompound.tech',
  headline: 'Page-level design rules, measured in a real browser, that fail closed.',
  repo: 'https://github.com/kyisaiah47/glanceless',
  npm: 'https://www.npmjs.com/package/glanceless',
  readOn: '2026-09-27',
} as const;

export const SOURCES = [
  { id: 'readme-headline', quote: 'Page-level design rules, measured in a real browser, that fail closed.', cite: 'README.md', url: 'https://github.com/kyisaiah47/glanceless#readme', read_at: '2026-09-27' },
  { id: 'readme-rules', quote: 'Contrast, dead columns, page chrome, full-column figures, one banned card composition, table shape, and copy noise, all read off the rendered DOM rather than the source that produced it.', cite: 'README.md', url: 'https://github.com/kyisaiah47/glanceless#readme', read_at: '2026-09-27' },
  { id: 'rules-browser', quote: 'Each rule opens a real page in headless Chrome, measures something in the rendered DOM, and reports a finding with a CSS selector and the numbers behind it.', cite: 'docs/RULES.md', url: 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md', read_at: '2026-09-27' },
  { id: 'rules-contrast', quote: 'Text below WCAG 1.4.3, and informational SVG marks below WCAG 1.4.11, against the background actually painted behind them.', cite: 'docs/RULES.md', url: 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md', read_at: '2026-09-27' },
  { id: 'rules-figure', quote: 'A picture at the full reading column that is not a thin band, one side of a two-column layout, a background cover, or dense enough to study.', cite: 'docs/RULES.md', url: 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md', read_at: '2026-09-27' },
  { id: 'rules-table', quote: 'A table is a grid a reader scans in two directions.', cite: 'docs/RULES.md', url: 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md', read_at: '2026-09-27' },
  { id: 'readme-refusal', quote: 'There is no --force, no allowlist and no known-issues file.', cite: 'README.md', url: 'https://github.com/kyisaiah47/glanceless#readme', read_at: '2026-09-27' },
  { id: 'readme-exit', quote: '2 never collapses into 0, and never into 1.', cite: 'README.md', url: 'https://github.com/kyisaiah47/glanceless#readme', read_at: '2026-09-27' },
  { id: 'package-runtime', quote: 'Node 18+.', cite: 'package.json', url: 'https://github.com/kyisaiah47/glanceless/blob/main/package.json', read_at: '2026-09-27' },
  { id: 'npm-version', quote: '0.1.1', cite: 'npm registry', url: 'https://www.npmjs.com/package/glanceless', read_at: '2026-09-27' },
] as const;
