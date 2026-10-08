'use client';

import type { ReactNode } from 'react';
import { useRegisterSimple, useSiteView } from './SiteViewProvider';

/* One page, two compositions. Only the active one is mounted, so there is one header, one main
 * and one footer in the document at a time. */
export default function PageViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView?: ReactNode }) {
  /* Registering is what lets the provider render Simple chrome for this route. A route with no
   * PageViews, or one without a simpleView, stays Console from header to footer. */
  const has = simpleView !== undefined && simpleView !== null;
  useRegisterSimple(has);
  return useSiteView()?.view === 'simple' && has ? <>{simpleView}</> : <>{consoleView}</>;
}

/** The header and footer switch. It follows the effective view and never registers a Simple view,
 *  so chrome alone can never turn a Console page Simple. */
export function ChromeViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView: ReactNode }) {
  return useSiteView()?.view === 'simple' ? <>{simpleView}</> : <>{consoleView}</>;
}
