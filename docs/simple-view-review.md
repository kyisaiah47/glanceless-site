# glanceless-site: Simple view review

Built on 2026-10-01 on `main`, following `compound-ops/standards/SIMPLE-VIEW-BLUEPRINT.md` and the
approved deferless-site pilot, which is the same kind of site: the page for one npm package.

## Truth map (blueprint 2.A)

Sources read: `src/app/page.tsx`, `src/app/guides/*/page.tsx`, `src/lib/{product,measured}.ts`,
`src/app/layout.tsx`, `scripts/check-register.mjs`. The package's own repo is not on this machine; every
statement comes from this site's own pages and its captured `measured.ts`.

| Field | Value | Source |
| --- | --- | --- |
| Primary user | A person shipping web pages who wants design faults caught before release | `PRODUCT.headline`, guides |
| Problem | A page can build, return 200 and still break a design rule | guide "What does glanceless check" |
| Input | No form. The first action is `npx glanceless demo` | page, guides |
| Output | Findings per rule with a selector and numbers; exit 0, 1 or 2 | `measured.ts`, guides |
| Free / paid | Free, `LICENCE` (MIT); nothing is for sale | `measured.ts` |
| Example | The captured demo: the failing fixture has `FINDINGS.length` findings across 6 rules and exits 1; the clean fixture exits 0 | `measured.ts` |
| Limits | It does not replace accessibility or design review; Playwright and Chromium are needed | guides |
| Failure states | Exit 2: a missing browser or unreachable page is never clean | guides |
| Recovery | New `not-found.tsx` in both views | |

## Route inventory (blueprint 2.E)

| Route | Class | Simple surface |
| --- | --- | --- |
| `/` | curated | `SimpleHome`: hero, command card, captured example, the seven rules, how to run it, exit codes, questions |
| `/guides/what-does-glanceless-check`, `/guides/how-to-check-rendered-webpage` | readable adaptation | own body, Simple header and footer, reading size |
| 404 | recovery | new `not-found.tsx`, both views |
| `/llms.txt`, `/og-card`, sitemap, robots | machine | unchanged |

The Console home and the guides keep their markup; each gains the view controls under its footer.

## Gate change

`npm run check` failed on `main` before this change: "accent appears outside declared homes". The extra
file is `src/icons/mark.generated.ts`, the logo-registry mark from `c19653b`, which is drawn in the
accent. It is now listed as an accent home in `scripts/check-register.mjs`, with that reason beside it.

## Verification receipt, 2026-10-01

- `npx tsc --noEmit` clean; `npx eslint src` 0 errors (6 warnings, all pre-existing `<img>` notes);
  `npm run check`: 12 clauses hold; `npm run build` passes.
- `node scripts/verify-simple-view.mjs http://localhost:3308 <shots>` at 1440: 30 held, 0 refused.
- `node scripts/mobile-gate.mjs`: 10 held, 0 refused at 390, both views. Widths only.
- `contrast.mjs` on the Simple home at 1440: 0 findings.
- Not run: the command in a real terminal.

Screens: `compound-ops/standards/simple-view-ref/review/glanceless-site-*.png`.
