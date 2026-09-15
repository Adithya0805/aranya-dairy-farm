import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Our Story & Heritage | Aranya Organic Dairy Farm',
  description:
    'Discover our 9-year journey of ethical dairy farming in Shoolagiri, Hosur. Native Gir & Sahiwal cows, calf-first milking, and traditional Vedic Bilona ghee.',
  openGraph: {
    title: 'Our Story & Heritage | Aranya Organic Dairy Farm',
    description:
      'Discover our 9-year journey of ethical dairy farming in Shoolagiri, Hosur. Native Gir & Sahiwal cows, calf-first milking, and traditional Vedic Bilona ghee.',
    url: `${FARM_DOMAIN}/story`,
    images: [
      {
        url: '/images/nature_hero_pasture.jpg',
        width: 1200,
        height: 630,
        alt: 'Aranya Organic Dairy Farm Story & Cows',
      },
    ],
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
