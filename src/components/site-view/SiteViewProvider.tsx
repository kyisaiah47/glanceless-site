'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Welcome from './Welcome';
import './simple.css';

/* THE VIEW AUTHORITY. Console is the default for a clean visitor. A valid ?view= wins over the
 * saved choice, and a valid explicit choice is saved. Every storage access is wrapped, because a
 * private window can throw on read. */
export type SiteView = 'console' | 'simple';
type Mode = {
  /** The view this route renders: Simple only when it was chosen AND the route registered a Simple view. */
  view: SiteView;
  /** The visitor's saved choice. It survives routes that have no Simple view. */
  preferred: SiteView;
  /** Whether the route on screen registered a Simple view through PageViews. */
  hasSimple: boolean;
  /** Called by a route's Simple view on mount; the returned function unregisters it. */
  registerSimple: () => () => void;
  choose: (view: SiteView) => void;
  welcome: () => void;
};

const Context = createContext<Mode | null>(null);
export function useSiteView() {
  return useContext(Context);
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A route's Simple view calls this on mount so the provider renders Simple chrome for it. */
export function useRegisterSimple(has = true) {
  const register = useContext(Context)?.registerSimple;
  useIsoLayoutEffect(() => (has && register ? register() : undefined), [has, register]);
}

const VIEW_KEY = 'glanceless:view';

export default function SiteViewProvider({ children }: { children: ReactNode }) {
  const [preferred, setPreferred] = useState<SiteView>('console');
  const [simpleCount, setSimpleCount] = useState(0);
  const hasSimple = simpleCount > 0;
  /* THE CHROME FOLLOWS THE BODY. A route that registered no Simple view renders Console, header,
   * footer and data-view included, so a Simple header never sits on a Console page. The saved
   * choice is kept for the next route that has a Simple view. */
  const view: SiteView = preferred === 'simple' && hasSimple ? 'simple' : 'console';
  const registerSimple = useCallback(() => {
    setSimpleCount((n) => n + 1);
    return () => setSimpleCount((n) => n - 1);
  }, []);
  const path = usePathname();

  const choose = useCallback((next: SiteView) => {
    setPreferred(next);
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
    setPreferred(next);
  }, [path]);

  const welcome = useCallback(() => window.dispatchEvent(new Event('glanceless:welcome')), []);

  return (
    <Context.Provider value={{ view, preferred, hasSimple, registerSimple, choose, welcome }}>
      <div className="sv-surface" data-view={view}>{children}</div>
      <Welcome />
    </Context.Provider>
  );
}
