'use client';

import { useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { PRODUCT, SOURCES } from '@/lib/product';
import { DEMO_OUTPUT, FINDINGS, RULES, SUITE_PASSED, NOISE_PATTERNS } from '@/lib/measured';
import { GLYPH } from '@/lib/phosphor';
import SmoothScroll from '@/components/SmoothScroll';

function Icon({ name }: { name: keyof typeof GLYPH }) {
  return <svg className="icon" viewBox="0 0 256 256" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GLYPH[name] }} />;
}

export default function Home() {
  const [mode, setMode] = useState<'rules' | 'findings'>('rules');
  const visibleFindings = useMemo(() => mode === 'rules' ? FINDINGS : FINDINGS.filter((f) => f.rule !== 'noise'), [mode]);
  return <>
    <SmoothScroll />
    <div className="read-strip"><div className="shell read-inner">
      <span><b>README.md</b> every sentence here</span><span><b>docs/RULES.md</b> threshold detail</span><span><b>npm registry</b> published package</span><span><b>read on</b> {PRODUCT.readOn}</span>
    </div></div>
    <header className="mast"><div className="shell mast-inner">
      <a className="brand" href="#top"><span className="brand-mark">g</span><strong>glanceless</strong></a>
      <span className="standing">MEASURE THE PAGE, NOT THE SOURCE</span>
      <nav><a className="active" href="#rules">Rules</a><a href="#demo">Demo</a><a href={PRODUCT.repo}>Source <Icon name="arrow-square-out" /></a></nav>
      <a className="run" href="#demo"><Icon name="terminal-window" /> Run demo</a>
    </div></header>
    <div className="folio"><div className="shell folio-inner">
      <span><b><NumberFlow value={RULES.length} /></b> rules</span><span><b><NumberFlow value={FINDINGS.length} /></b> findings in the dirty fixture</span><span><b><NumberFlow value={SUITE_PASSED} /></b> assertions passed</span><span><b><NumberFlow value={NOISE_PATTERNS} /></b> copy patterns</span><span className="folio-date">package read {PRODUCT.readOn}</span>
    </div></div>
    <main id="top" className="shell frame">
      <aside className="left-rail">
        <div className="rail-group"><p className="eyebrow">THE PAGE</p><a className="rail-link current" href="#rules"><Icon name="list-checks" /> Seven rules</a><a className="rail-link" href="#demo"><Icon name="terminal-window" /> Captured output</a><a className="rail-link" href="#install"><Icon name="download-simple" /> Install</a></div>
        <div className="rail-group"><p className="eyebrow">THE PACKAGE</p><div className="rail-fact"><span>version</span><code>0.1.0</code></div><div className="rail-fact"><span>license</span><code>MIT</code></div><div className="rail-fact"><span>runtime</span><code>Node 18+</code></div></div>
        <div className="rail-group rail-note"><p className="eyebrow">THE REFUSAL</p><p>There is no <code>--force</code>, no allowlist and no known-issues file.</p></div>
      </aside>
      <section className="content">
        <div className="hero"><div className="hero-kicker"><span className="dot" /> glanceless / browser rules</div><h1>Page-level design rules, measured in a real browser, that fail closed.</h1><p className="lede">Contrast, dead columns, page chrome, full-column figures, a figure over a tracked label, table shape, and copy noise. Every rule reads the rendered DOM rather than the source that produced it.</p><div className="hero-actions"><a className="button" href="#demo"><Icon name="terminal-window" /> Read the captured run</a><a className="text-link" href={PRODUCT.repo}>GitHub <Icon name="arrow-square-out" /></a></div></div>
        <section id="rules" className="section"><div className="section-head"><div><p className="eyebrow">THE CHECK SET</p><h2>Seven ways a page can look fine and still fail.</h2></div><p className="section-note">Each rule opens a real page in headless Chrome and reports a finding with a CSS selector and the numbers behind it.</p></div>
          <div className="rule-list">{RULES.map((rule, i) => <article className="rule-row" key={rule.id}><div className="rule-no">0{i + 1}</div><div className="rule-icon"><Icon name={rule.glyph as keyof typeof GLYPH} /></div><div className="rule-copy"><h3>{rule.title}</h3><p>{rule.summary}</p><code>{rule.id}</code></div><span className="row-arrow"><Icon name="caret-right" /></span></article>)}</div>
        </section>
        <section id="demo" className="section demo-section"><div className="section-head"><div><p className="eyebrow">THE MEASUREMENT</p><h2>Two pages build. One page was not looked at.</h2></div><div className="mode-switch" role="group" aria-label="Demo view"><button className={mode === 'rules' ? 'selected' : ''} onClick={() => setMode('rules')}>All rules</button><button className={mode === 'findings' ? 'selected' : ''} onClick={() => setMode('findings')}>Finding rows</button></div></div>
          <div className="demo-grid"><div className="terminal"><div className="terminal-bar"><span><Icon name="terminal-window" /> glanceless demo</span><span>1440px</span></div><pre>{DEMO_OUTPUT}</pre></div><div className="findings"><div className="finding-head"><span>FINDINGS</span><b><NumberFlow value={visibleFindings.length} /> rows</b></div>{visibleFindings.map((finding, i) => <div className="finding" key={`${finding.rule}-${i}`}><div className="finding-title"><span className="status-x">×</span><code>{finding.rule}</code><span>{finding.sel}</span></div><p>{finding.msg}</p></div>)}</div></div>
        </section>
        <section id="install" className="section install-section"><div className="install-copy"><p className="eyebrow">THE COMMAND</p><h2>Run the same check on a page you can open.</h2><p>The local file is served over HTTP rather than opened as <code>file://</code>, because Chromium treats a file image as cross-origin.</p></div><div className="command"><code>npx glanceless demo</code><a href={PRODUCT.npm} aria-label="Open glanceless on npm"><Icon name="arrow-square-out" /></a></div></section>
      </section>
      <aside className="right-rail"><div className="rail-group"><p className="eyebrow">WHAT IT READS</p><div className="right-row"><Icon name="browser" /><span>rendered DOM<br /><small>not the framework or stylesheet</small></span></div><div className="right-row"><Icon name="ruler" /><span>geometry, computed style<br /><small>or pixels from a canvas</small></span></div><div className="right-row"><Icon name="warning-circle" /><span>exit 2<br /><small>could not check is not clean</small></span></div></div><div className="rail-group"><p className="eyebrow">EXIT CODES</p><div className="exit"><b className="pass">0</b><span>checked, clean</span></div><div className="exit"><b className="fail">1</b><span>checked, finding</span></div><div className="exit"><b className="caution">2</b><span>could not check</span></div></div><div className="rail-group source-rail"><p className="eyebrow">SOURCES</p>{SOURCES.map((source) => <a href={source.url} key={source.id}>{source.cite}<small>{source.read_at}</small></a>)}</div></aside>
    </main>
    <footer><div className="shell footer-inner"><div className="footer-credit">Built by <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={80} height={20} /></div><span>© 2026 glanceless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></div></footer>
  </>;
}
