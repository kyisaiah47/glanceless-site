'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Welcome from './Welcome';
import './simple.css';

/* THE VIEW AUTHORITY. Console is the default for a clean visitor. A valid ?view= wins over the
 * saved choice, and a valid explicit choice is saved. Every storage access is wrapped, because a
 * private window can throw on read. */
export type SiteView = 'console' | 'simple';
type Mode = { view: SiteView; choose: (view: SiteView) => void; welcome: () => void };

const Context = createContext<Mode | null>(null);
export function useSiteView() {
  return useContext(Context);
}

const VIEW_KEY = 'glanceless:view';

export default function SiteViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<SiteView>('console');
  const path = usePathname();

  const choose = useCallback((next: SiteView) => {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch {}
    const url = new URL(window.location.href);
    if (url.searchParams.has('view')) {
      url.searchParams.set('view', next);
      window.history.replaceState(window.history.state, '', url.href);
    }
  }, []);

  useEffect(() => {
    const explicit = new URLSearchParams(window.location.search).get('view');
    let next: SiteView = 'console';
    if (explicit === 'simple' || explicit === 'console') {
      next = explicit;
      try { localStorage.setItem(VIEW_KEY, explicit); } catch {}
    } else {
      try { next = localStorage.getItem(VIEW_KEY) === 'simple' ? 'simple' : 'console'; } catch {}
    }
    /* The saved view lives in storage, an external system the server cannot read, so it is
     * applied after hydration. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(next);
  }, [path]);

  const welcome = useCallback(() => window.dispatchEvent(new Event('glanceless:welcome')), []);

  return (
    <Context.Provider value={{ view, choose, welcome }}>
      <div className="sv-surface" data-view={view}>{children}</div>
      <Welcome />
    </Context.Provider>
  );
}
