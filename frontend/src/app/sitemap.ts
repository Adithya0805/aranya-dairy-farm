import type { MetadataRoute } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';
import { PRODUCTS } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = FARM_DOMAIN.replace(/\/+$/, '');
  const stableDate = new Date('2026-10-01T00:00:00.000Z');

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: stableDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: stableDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: stableDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Include all confirmed active products in the catalog
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.filter(
    (p) => p.available
  ).map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: stableDate,
    changeFrequency: 'weekly',
    priority: p.featured ? 0.85 : 0.75,
  }));

  return [...coreRoutes, ...productRoutes];
}
