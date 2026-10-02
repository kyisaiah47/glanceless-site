'use client';

import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import {
  DEMO_OUTPUT, FINDINGS, RULES, RULES_RUN_ON_FIXTURES, FAILING_EXIT, CLEAN_EXIT, CLEAN_FINDINGS,
  VIEWPORT, LICENCE, NODE_ENGINE, DEPENDENCY_COUNT, SUITE_PASSED,
} from '@/lib/measured';
import { SimpleHeader, SimpleFooter } from './SimpleChrome';
import Disclosure from './Disclosure';
import CopyCommand from './CopyCommand';

/* THE SIMPLE HOME. Outcome, the one command, the captured demo as a readable answer, the rules,
 * how to run it on your own page, questions and the next step. Every figure is read off
 * src/lib/measured.ts, which scripts/capture.mjs writes from the package's own run. */
const failedRules = [...new Set(FINDINGS.map((f) => f.rule))];

export default function SimpleHome() {
  return (
    <>
      <SimpleHeader />
      <main className="sv-main">
        <div className="sv-in">
          <section className="sv-hero">
            <div className="sv-pitch">
              <span className="sv-label">MEASURE THE RENDERED PAGE, NOT THE SOURCE</span>
              <h1>Find page-level design faults a build will not catch.</h1>
              <p>
                glanceless opens your page in a real browser, checks seven page-level design rules, and reads each rule from the rendered page rather than the code that produced it.
              </p>
              <p className="sv-qualifier">
                The package is free and uses a {LICENCE} licence. It requires Node {NODE_ENGINE.replace('>=', '')} or newer and has {DEPENDENCY_COUNT} runtime dependencies.
              </p>
            </div>

            <div className="sv-card sv-action" id="try">
              <div className="sv-step"><span>01 / TRY IT FIRST</span><span>NO INSTALL</span></div>
              <h2>Run the demo in your terminal.</h2>
              <p>The demo checks two bundled pages, one clean and one failing, and prints what it finds.</p>
              <CopyCommand command="npx glanceless demo" label="Command" />
              <p className="sv-terms">The package needs no account, runs on your machine, and uses a {LICENCE} licence.</p>
            </div>
          </section>

          <section className="sv-section" aria-labelledby="sv-see">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">02 / WHAT YOU&apos;LL SEE</span>
                <h2 id="sv-see">Each finding identifies a problem you can act on.</h2>
              </div>
              <p>Each finding names the element, the rule, and the numbers behind it. Open the list when you want the details.</p>
            </div>

            <div className="sv-card sv-result">
              <div className="sv-step"><span>EXAMPLE RESULT</span><span>The capture comes from the package at {VIEWPORT}px.</span></div>
              <h3>
                The failing page broke {failedRules.length} rules with {FINDINGS.length} findings, so it exits {FAILING_EXIT}.
              </h3>
              <p>
                The clean page had {CLEAN_FINDINGS} findings and exits {CLEAN_EXIT}. Both pages build and render.
              </p>
              <Disclosure title={`See the ${FINDINGS.length} findings`}>
                <ol className="sv-violations">
                  {FINDINGS.map((f, i) => (
                    <li key={`${f.rule}-${i}`}>
                      <p>{f.msg}</p>
                      <code>{f.rule} on {f.sel}</code>
                    </li>
                  ))}
                </ol>
              </Disclosure>
              <Disclosure title="See the full output">
                <pre className="sv-term" tabIndex={0}>{DEMO_OUTPUT}</pre>
              </Disclosure>
              <p className="sv-note">
                This is the package&apos;s own demo, captured from its output. It is not a check of your page.
              </p>
            </div>
          </section>

          <section className="sv-section" aria-labelledby="sv-rules">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">03 / THE RULES</span>
                <h2 id="sv-rules">Seven rules catch pages that look fine and still fail.</h2>
              </div>
              <p>Each rule opens the page in headless Chrome and measures the rendered result.</p>
            </div>
            {RULES.map((r) => (
              <Disclosure key={r.id} title={r.title[0].toUpperCase() + r.title.slice(1)}>
                <p>{r.summary}</p>
                <p><code>{r.id}</code>{RULES_RUN_ON_FIXTURES.includes(r.id) ? ' runs in the demo.' : ' is not part of the demo run.'}</p>
              </Disclosure>
            ))}
          </section>

          <section className="sv-section" aria-labelledby="sv-use">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">04 / USE IT ON YOUR PAGE</span>
                <h2 id="sv-use">Check a page you can open.</h2>
              </div>
              <p>The package is free. The browser rules need Playwright and Chromium.</p>
            </div>
            <ol className="sv-steps">
              <li className="sv-card">
                <span className="sv-step-n">1</span>
                <h3>Install the browser.</h3>
                <p>Install the package and its optional Playwright peer, then install Chromium.</p>
              </li>
              <li className="sv-card">
                <span className="sv-step-n">2</span>
                <h3>Point it at your page.</h3>
                <pre className="sv-cmd" tabIndex={0}>{'glanceless <url|file|dir>'}</pre>
                <p>A local file is served over HTTP because Chromium treats a file image as cross-origin.</p>
              </li>
              <li className="sv-card">
                <span className="sv-step-n">3</span>
                <h3>Fix and run it again.</h3>
                <p>Fix the reported selector and rerun. A finding is not a note to ignore.</p>
              </li>
            </ol>
            <div className="sv-exits">
              <h3>What each exit code means</h3>
              <ul>
                <li><span className="sv-code" data-ink="pass">0</span><p><strong>Checked, clean.</strong> Every rule passed.</p></li>
                <li><span className="sv-code" data-ink="fail">1</span><p><strong>Checked, finding.</strong> A rule found a violation.</p></li>
                <li><span className="sv-code" data-ink="caution">2</span><p><strong>Could not check.</strong> A missing browser or an unreachable page is never reported as clean.</p></li>
              </ul>
            </div>
          </section>

          <section className="sv-section" aria-labelledby="sv-questions">
            <div className="sv-section-intro">
              <div>
                <span className="sv-label">05 / QUESTIONS</span>
                <h2 id="sv-questions">Answers about the package</h2>
              </div>
              <p>The package&apos;s own suite passes {SUITE_PASSED} assertions.</p>
            </div>
            <Disclosure title="Skipping a failing rule">
              <p>The package has no --force, no allowlist, and no known-issues file.</p>
            </Disclosure>
            <Disclosure title="The package does not replace an accessibility review.">
              <p>No. glanceless measures its design rules, not the full space of accessibility or design review. Manual review stays in the loop.</p>
            </Disclosure>
            <Disclosure title="Why glanceless reads the page instead of the code">
              <p>glanceless checks the same rendered fault whether it came from a template, a CMS field or a hand-written route.</p>
            </Disclosure>
            <div className="sv-support">
              <h3>Get help with glanceless.</h3>
              <p>Email <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a> with the page and the output you saw.</p>
            </div>
          </section>

          <nav className="sv-next" aria-label="Next steps">
            <Link href="/guides/what-does-glanceless-check">What glanceless checks <span aria-hidden="true">{'↗'}</span></Link>
            <Link href="/guides/how-to-check-rendered-webpage">Check a rendered page <span aria-hidden="true">{'↗'}</span></Link>
            <a href={PRODUCT.repo} rel="noopener">Read the source <span aria-hidden="true">{'↗'}</span></a>
          </nav>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}
