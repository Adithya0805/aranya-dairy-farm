import type { MetadataRoute } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = FARM_DOMAIN;
  return [
    {
      url: baseUrl + '/',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: baseUrl + '/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: baseUrl + '/story',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: baseUrl + '/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
