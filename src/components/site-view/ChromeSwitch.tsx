'use client';

import type { ReactNode } from 'react';
import { useSiteView } from './SiteViewProvider';

/* The masthead and the footer in the view the reader chose. Both are rendered by the server and
 * handed in, so the Console's own markup is unchanged. */
export default function ChromeSwitch({ consoleNode, simpleNode }: { consoleNode: ReactNode; simpleNode: ReactNode }) {
  return <>{useSiteView()?.view === 'simple' ? simpleNode : consoleNode}</>;
}
