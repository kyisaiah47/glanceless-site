'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteView, type SiteView } from './SiteViewProvider';
import { FINDINGS, FAILING_EXIT } from '@/lib/measured';

/* THE WELCOME. One question, one explanation, one small labelled illustration, two equal
 * choices. It opens by itself on `/` unless the reader turned it off or the URL carries
 * welcome=0, and the footer's Start here always reopens it. The illustration is the first
 * finding of the package's own captured demo, never an invented result. */
const OFF_KEY = 'glanceless:welcome-off';

export default function Welcome() {
  const mode = useSiteView();
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [off, setOff] = useState(false);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const d = dialog.current;
    if (d && !d.open) {
      previous.current = document.activeElement as HTMLElement | null;
      d.showModal();
    }
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    if (timer.current) clearTimeout(timer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => {
      dialog.current?.close();
      const back = previous.current;
      if (back && back.isConnected && back !== document.body) back.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>('#try button, .sv-brand, .brand')?.focus({ preventScroll: true });
    }, reduced ? 0 : 220);
  }, []);

  useEffect(() => {
    let disabled = false;
    try { disabled = localStorage.getItem(OFF_KEY) === '1'; } catch {}
    /* Storage is an external system read once per route; the dialog's checkbox mirrors it. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOff(disabled);
    if (path === '/' && !disabled && new URLSearchParams(window.location.search).get('welcome') !== '0') show();
    window.addEventListener('glanceless:welcome', show);
    return () => {
      window.removeEventListener('glanceless:welcome', show);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [path, show]);

  function select(view: SiteView) {
    mode?.choose(view);
    close();
  }

  const first = FINDINGS[0];

  return (
    <dialog
      ref={dialog}
      className="sv-welcome"
      data-visible={visible}
      aria-labelledby="sv-welcome-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dialog.current) close(); }}
    >
      <header className="sv-welcome-top">
        <span className="sv-brand-static">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={22} height={22} />
          glanceless
          <small>/ START HERE</small>
        </span>
        <button type="button" className="sv-close" aria-label="Close welcome" onClick={close} autoFocus>
          {'×'}
        </button>
      </header>

      <div className="sv-welcome-intro">
        <h2 id="sv-welcome-title">Does the page render correctly in a browser?</h2>
        <p>
          glanceless opens a page in a real browser and measures it against seven design rules. A page fails when it breaks one rule. The finding names the element and reports the numbers.
        </p>
      </div>

      {first ? (
        <section className="sv-illustration" aria-label="Illustration from the glanceless demo">
          <div className="sv-illustration-top">
            <span>ILLUSTRATION</span>
            <span>FROM THE PACKAGE&apos;S OWN DEMO</span>
          </div>
          <p className="sv-illustration-plan">The {first.rule} rule checks a page that builds and renders.</p>
          <p className="sv-illustration-found">
            <code>{first.sel}</code>
            <span>{first.msg.split('. ')[0]}. The check exits {FAILING_EXIT}.</span>
          </p>
        </section>
      ) : null}

      <section className="sv-welcome-choose">
        <div className="sv-welcome-choose-head">
          <h3>How do you want to explore?</h3>
          <p>You can switch anytime.</p>
        </div>
        <div className="sv-choices">
          <button type="button" onClick={() => select('console')}>
            <b>Console</b>
            <strong>See more at once.</strong>
            <span>One screen shows every rule, the captured run and its findings.</span>
          </button>
          <button type="button" onClick={() => select('simple')}>
            <b>Simple</b>
            <strong>Start with the essentials.</strong>
            <span>The roomier overview lets you open details as you go.</span>
          </button>
        </div>
      </section>

      <footer className="sv-welcome-foot">
        <label>
          <input
            type="checkbox"
            checked={off}
            onChange={(e) => {
              const value = e.target.checked;
              setOff(value);
              try {
                if (value) localStorage.setItem(OFF_KEY, '1');
                else localStorage.removeItem(OFF_KEY);
              } catch {}
            }}
          />
          Do not open this when I come back
        </label>
      </footer>
    </dialog>
  );
}
