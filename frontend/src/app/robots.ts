import type { MetadataRoute } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${FARM_DOMAIN}/sitemap.xml`,
  };
}
