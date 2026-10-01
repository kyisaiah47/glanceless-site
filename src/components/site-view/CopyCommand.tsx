'use client';

import { useId, useState } from 'react';

/* THE ACTION CARD'S CONTROL. The product has no form: its first action is a command a reader
 * runs. The field shows the command at 16px and the button copies it. A clipboard refusal is
 * said in words, never swallowed. */
export default function CopyCommand({ command, label }: { command: string; label: string }) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'copied' | 'refused'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState('copied');
    } catch {
      setState('refused');
    }
  }
  return (
    <div className="sv-copy">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="sv-command" readOnly value={command} spellCheck={false} />
      <button type="button" className="sv-primary" onClick={copy}>
        {state === 'copied' ? 'Copied. Paste it into a terminal.' : 'Copy the command'}
      </button>
      <p className="sv-copy-status" role="status" aria-live="polite">
        {state === 'refused' ? 'This browser blocked the clipboard. Type the command above into a terminal.' : ''}
      </p>
    </div>
  );
}
