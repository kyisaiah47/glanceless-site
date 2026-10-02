import Link from 'next/link';
import ChromeSwitch from '@/components/site-view/ChromeSwitch';
import ViewControls from '@/components/site-view/ViewControls';
import { SimpleHeader, SimpleFooter } from '@/components/site-view/SimpleChrome';

const README = 'https://github.com/kyisaiah47/glanceless#readme';
const RULES = 'https://github.com/kyisaiah47/glanceless/blob/main/docs/RULES.md';

export const metadata = {
  title: 'What does glanceless check in a rendered webpage?',
  description: 'A precise guide to the rendered-page checks, findings, and exit codes in glanceless.',
  alternates: { canonical: 'https://glanceless.thecompound.tech/guides/what-does-glanceless-check' },
};

export default function Guide() {
  return (
    <>
      {/* The Console chrome below is unchanged; Simple swaps in its own header. */}
      <ChromeSwitch simpleNode={<SimpleHeader />} consoleNode={<>
      <div className="read-strip"><div className="shell read-inner"><span><b>GUIDE</b> answer first</span><span><b>RULES.md</b> thresholds and incidents</span><span><b>read on</b> 2026-09-28</span></div></div>
      <header className="mast"><div className="shell mast-inner"><Link className="brand" href="/"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>glanceless</strong></Link><span className="standing">MEASURE THE RENDERED PAGE, NOT THE SOURCE</span><nav><Link href="/">Rules</Link><Link className="active" href="/guides/what-does-glanceless-check">Guide</Link><a href={README}>Source</a></nav></div></header>
      </>} />
      <main className="shell guide-frame">
        <article className="guide-content">
          <p className="eyebrow">GLANCELESS / SPECIFIC QUESTION</p>
          <h1>What does glanceless check in a rendered webpage?</h1>
          <p className="guide-answer">glanceless checks seven page-level failure modes in a real browser: contrast, dead columns, page chrome, full-column figures, one banned card composition, table shape, and copy noise. It reads the rendered DOM, computed style, geometry, and pixels, then returns a finding with a selector and measurements instead of judging the source code. <a href={README}>Source checked 2026-09-28.</a></p>
          <section className="guide-section"><h2>Which seven checks does glanceless run?</h2><p>The seven checks cover visual and structural defects that can survive a successful build and a 200 response. The product README lists the checks and the rules document defines their rendered-page boundaries. <a href={README}>README</a> and <a href={RULES}>RULES.md</a> <span className="source-date">(checked 2026-09-28)</span></p><div className="guide-table"><div><code>contrast</code><span>Painted-background contrast for text and informational marks.</span></div><div><code>dead-column</code><span>Rows that stop far short of the page width established elsewhere.</span></div><div><code>page-chrome</code><span>A route missing the home page’s navigation, footer, or path home.</span></div><div><code>figure</code><span>A full-width picture without a qualifying band, split layout, cover, or dense capture.</span></div><div><code>card composition</code><span>A banned composition defined by the product’s design-system rule.</span></div><div><code>table-shape</code><span>A table whose rows are facts rather than values compared across columns.</span></div><div><code>noise</code><span>Performed sincerity and filler padding in visible product copy.</span></div></div></section>
          <section className="guide-section"><h2>How does glanceless decide whether a page fails?</h2><p>Run the page in a real Chromium browser, let the rule measure the rendered result, and inspect the selector, value, and message in the output. glanceless deliberately does not inspect a framework, stylesheet, or source file, so the same rendered defect is checked whether it came from a template, CMS field, or hand-written route. <a href={RULES}>RULES.md</a> <span className="source-date">(checked 2026-09-28)</span></p><ol><li>Install the package and its optional Playwright peer, then install Chromium.</li><li>Run <code>npx glanceless demo</code> for the bundled clean and failing fixtures.</li><li>Use <code>glanceless &lt;url|file|dir&gt;</code> for the page or pages you want to check.</li><li>Fix the reported selector and rerun; a finding is not a note to ignore.</li></ol><p className="guide-note">Local files are served over HTTP because Chromium treats a <code>file://</code> image as cross-origin during the figure measurement. <a href={README}>README</a> <span className="source-date">(checked 2026-09-28)</span></p></section>
          <section className="guide-section"><h2>What do glanceless exit codes mean?</h2><p>Exit code 0 means the page was checked and clean, 1 means it was checked and a rule found a violation, and 2 means it could not be checked. A missing browser, unreachable page, or unreadable reference page remains 2; it does not collapse into a clean result. <a href={README}>README</a> <span className="source-date">(checked 2026-09-28)</span></p><div className="exit-grid"><div><b>0</b><span>checked, clean</span></div><div><b>1</b><span>checked, finding</span></div><div><b>2</b><span>could not check</span></div></div></section>
          <section className="guide-section"><h2>What does glanceless not replace?</h2><p>glanceless covers the design-system rules it was built to measure, not the full space of accessibility or design review. The product documents explicitly keep manual review in the loop; the tool removes a class of defects that can render normally while still failing the rule. <a href={README}>README</a> <span className="source-date">(checked 2026-09-28)</span></p></section>
          <p className="guide-back"><Link href="/">Back to the rules and captured demo</Link></p>
        </article>
      </main>
      <ChromeSwitch simpleNode={<SimpleFooter />} consoleNode={<>
      <footer><div className="shell footer-inner"><div className="footer-credit">Built by <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} /></div><span>© 2026 glanceless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></div></footer>
      <div className="sv-tools-strip"><div className="shell"><ViewControls /></div></div>
      </>} />
    </>
  );
}
