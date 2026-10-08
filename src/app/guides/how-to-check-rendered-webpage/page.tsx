import Link from 'next/link';
import PageViews from '@/components/site-view/PageViews';
import ViewControls from '@/components/site-view/ViewControls';
import { SimpleHeader, SimpleFooter } from '@/components/site-view/SimpleChrome';

const README = 'https://github.com/kyisaiah47/glanceless#readme';
const RULES = 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md';

export const metadata = {
  title: 'How do you check a rendered webpage for design defects?',
  description: 'A dated, four-step procedure for checking a rendered webpage with glanceless in a real Chromium browser.',
  alternates: { canonical: 'https://glanceless.thecompound.tech/guides/how-to-check-rendered-webpage' },
};

export default function Guide() {
  /* The article is written once; the Console guide frame and the Simple page both read it. */
  const article = (
        <article className="guide-content">
          <p className="eyebrow">GLANCELESS / SPECIFIC QUESTION</p>
          <h1>How do you check a rendered webpage for design defects?</h1>
          <p className="guide-answer">Check the rendered webpage in Chromium, not its source: install glanceless with Playwright, run the URL or local directory, read each selector and measurement, then fix and rerun until the result is clean. As documented on 2026-09-29, glanceless measures geometry, computed style, and pixels in the browser and returns exit code 0 for clean, 1 for a finding, or 2 when it could not check the page. <a href={RULES}>Implementation evidence: RULES.md.</a></p>
          <section className="guide-section"><h2>What is the procedure for checking one webpage?</h2><p>Use this four-step procedure for a rendered-page check; it preserves the distinction between a clean page and a page that was never successfully checked. <a href={README}>README checked 2026-09-29.</a></p><ol><li>Install the checker and its browser peer: <code>npm i -D glanceless playwright</code>, then run <code>npx playwright install chromium</code>.</li><li>Check a URL, file, or directory with <code>npx glanceless https://example.com/page</code>. A local file or directory is served over HTTP so Chromium can measure image pixels.</li><li>Read the finding’s rule id, CSS selector, measured value, and message. The rules inspect the rendered DOM rather than a framework, stylesheet, or source file.</li><li>Fix the selector’s rendered defect and rerun the command. Treat exit 0 as checked and clean, exit 1 as checked with a violation, and exit 2 as could not check.</li></ol></section>
          <section className="guide-section"><h2>Which rendered-page defects can the check find?</h2><p>glanceless checks seven page-level failure modes: contrast, dead columns, page chrome, full-column figures, a banned card composition, table shape, and copy noise. The current implementation describes contrast against the background actually painted behind text, page chrome against the site’s own home page, and figure density from the image pixels. <a href={RULES}>Rules implementation checked 2026-09-29.</a></p><div className="guide-table"><div><code>contrast</code><span>Painted-background text and informational-mark contrast.</span></div><div><code>dead-column</code><span>Rows that stop short of the width the page establishes elsewhere.</span></div><div><code>page-chrome</code><span>Missing navigation, footer, or a route back to the home page.</span></div><div><code>figure</code><span>Full-width imagery that is not a qualifying band, split layout, cover, or dense capture.</span></div><div><code>table-shape</code><span>Rows that contain standalone facts instead of values compared across columns.</span></div></div></section>
          <section className="guide-section"><h2>What does each exit code mean?</h2><p>Exit code 0 means the page was checked and clean; exit code 1 means a rule found a violation; exit code 2 means the page could not be checked. A missing Chromium browser, unreachable page, failed route, or unreadable reference page remains 2 rather than being reported as clean. <a href={README}>README checked 2026-09-29.</a></p><div className="exit-grid"><div><b>0</b><span>checked, clean</span></div><div><b>1</b><span>checked, finding</span></div><div><b>2</b><span>could not check</span></div></div></section>
          <p className="guide-back"><Link href="/guides/what-does-glanceless-check">Read the complete list of rendered checks</Link></p>
        </article>
  );

  return (
    <>
      {/* Each view renders its own chrome around the same article. */}
      <PageViews
        simpleView={
          <>
            <SimpleHeader />
            <main className="sv-main sv-guide">
              <div className="sv-in">{article}</div>
            </main>
            <SimpleFooter />
          </>
        }
        consoleView={
          <>

      <div className="read-strip"><div className="shell read-inner"><span><b>GUIDE</b> answer first</span><span><b>PROCEDURE</b> rendered page</span><span><b>read on</b> 2026-09-29</span></div></div>
      <header className="mast"><div className="shell mast-inner"><Link className="brand" href="/"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>glanceless</strong></Link><span className="standing">MEASURE THE PAGE, NOT THE SOURCE</span><nav><Link href="/">Rules</Link><Link className="active" href="/guides/how-to-check-rendered-webpage">Guide</Link><a href={README}>Source</a></nav></div></header>
      
      <main className="shell guide-frame">{article}</main>
      
      <footer><div className="shell footer-inner"><div className="footer-credit">Built by <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} /></div><span>© 2026 glanceless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></div></footer>
      <div className="sv-tools-strip"><div className="shell"><ViewControls /></div></div>
      
          </>
        }
      />
    </>
  );
}
