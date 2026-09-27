import { PRODUCT, SOURCES } from '@/lib/product';
export function GET() {
  const body = [`# ${PRODUCT.name}`, '', PRODUCT.headline, '', '## Source', ...SOURCES.map((s) => `- ${s.cite}: ${s.url}`), ''].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
