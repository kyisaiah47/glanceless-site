import type { MetadataRoute } from 'next';
import { PRODUCT } from '@/lib/product';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `https://${PRODUCT.host}/`, lastModified: new Date('2026-09-27') },
    { url: `https://${PRODUCT.host}/guides/what-does-glanceless-check`, lastModified: new Date('2026-09-28') },
  ];
}
