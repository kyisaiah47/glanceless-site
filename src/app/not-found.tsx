import Link from 'next/link';
import PageViews from '@/components/site-view/PageViews';
import ViewControls from '@/components/site-view/ViewControls';
import { SimpleHeader, SimpleFooter } from '@/components/site-view/SimpleChrome';

/* THE 404, in both views, with links back into the site. The Console chrome is the guides' own;
 * the Simple view reads the same article inside the Simple header and footer. */
export default function NotFound() {
  const article = (
    <article className="guide-content">
      <p className="eyebrow">NOT FOUND</p>
      <h1>This page does not exist.</h1>
      <p className="guide-answer">The address may be mistyped, or the page may have moved.</p>
      <p className="guide-back"><Link href="/">View the rules and captured demo</Link></p>
      <p className="guide-back"><Link href="/guides/what-does-glanceless-check">What glanceless checks</Link></p>
    </article>
  );
  return (
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
          {/* eslint-disable @next/next/no-img-element -- the marks are 22px and 20px, drawn as the guides draw them. */}
          <header className="mast"><div className="shell mast-inner"><Link className="brand" href="/"><span className="brand-mark"><img src="/icon.svg" alt="" width={22} height={22} /></span><strong>glanceless</strong></Link><span className="standing">MEASURE THE RENDERED PAGE, NOT THE SOURCE</span><nav><Link href="/">Rules</Link><Link href="/guides/what-does-glanceless-check">Guide</Link></nav></div></header>
          <main className="shell guide-frame">{article}</main>
          <footer><div className="shell footer-inner"><div className="footer-credit">Built by <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} /></div><span>{'©'} 2026 glanceless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></div></footer>
          <div className="sv-tools-strip"><div className="shell"><ViewControls /></div></div>
        </>
      }
    />
  );
}
