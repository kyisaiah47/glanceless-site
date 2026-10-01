import Link from 'next/link';
import ChromeSwitch from '@/components/site-view/ChromeSwitch';
import ViewControls from '@/components/site-view/ViewControls';
import { SimpleHeader, SimpleFooter } from '@/components/site-view/SimpleChrome';

/* THE 404, in both views, with links back into the site. The Console chrome is the guides' own. */
export default function NotFound() {
  return (
    <>
      {/* eslint-disable @next/next/no-img-element -- the marks are 22px and 20px, drawn as the guides draw them. */}
      <ChromeSwitch simpleNode={<SimpleHeader />} consoleNode={
        <header className="mast"><div className="shell mast-inner"><Link className="brand" href="/"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>glanceless</strong></Link><span className="standing">MEASURE THE PAGE, NOT THE SOURCE</span><nav><Link href="/">Rules</Link><Link href="/guides/what-does-glanceless-check">Guide</Link></nav></div></header>
      } />
      <main className="shell guide-frame">
        <article className="guide-content">
          <p className="eyebrow">NOT FOUND</p>
          <h1>This page does not exist.</h1>
          <p className="guide-answer">The address may be mistyped, or the page may have moved.</p>
          <p className="guide-back"><Link href="/">Go to the rules and the captured demo</Link></p>
          <p className="guide-back"><Link href="/guides/what-does-glanceless-check">What glanceless checks</Link></p>
        </article>
      </main>
      <ChromeSwitch simpleNode={<SimpleFooter />} consoleNode={
        <>
          <footer><div className="shell footer-inner"><div className="footer-credit">Built by <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} /></div><span>{'©'} 2026 glanceless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></div></footer>
          <div className="sv-tools-strip"><div className="shell"><ViewControls /></div></div>
        </>
      } />
    </>
  );
}
