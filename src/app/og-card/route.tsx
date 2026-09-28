import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b0b0d', color: '#e8e7ea', padding: '68px 76px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, letterSpacing: 4, color: '#CD9AE6' }}>glanceless</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 58, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.06 }}>Page-level browser rules that fail closed.</div>
          <div style={{ display: 'flex', fontSize: 27, color: '#aaa6af' }}>Measure the rendered page, not the source that produced it.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 20, color: '#CD9AE6' }}>glanceless.thecompound.tech</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
