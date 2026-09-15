import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact & Farm Visit | Aranya Organic Dairy Farm',
  description:
    'Visit our organic dairy farm in Shoolagiri, Hosur or reach out for fresh daily A2 milk delivery and subscriptions.',
  openGraph: {
    title: 'Contact & Farm Visit | Aranya Organic Dairy Farm',
    description:
      'Visit our organic dairy farm in Shoolagiri, Hosur or reach out for fresh daily A2 milk delivery and subscriptions.',
    url: `${FARM_DOMAIN}/contact`,
    images: [
      {
        url: '/images/nature_hero_pasture.jpg',
        width: 1200,
        height: 630,
        alt: 'Aranya Organic Dairy Farm Location & Contact',
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
