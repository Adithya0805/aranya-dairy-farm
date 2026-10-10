import type { MetadataRoute } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/admin/*', '/api/', '/api/*'],
    },
    sitemap: `${FARM_DOMAIN.replace(/\/+$/, '')}/sitemap.xml`,
  };
}
