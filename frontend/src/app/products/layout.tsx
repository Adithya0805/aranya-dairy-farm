import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Farm Fresh Products | Aranya Organic Dairy Farm',
  description:
    'Explore 100% pure raw A2 cow milk, Vedic Bilona ghee, unadulterated paneer, curd, fresh butter, and cold-pressed oils from Aranya Dairy Farm, Shoolagiri, Hosur.',
  openGraph: {
    title: 'Farm Fresh Products | Aranya Organic Dairy Farm',
    description:
      'Explore 100% pure raw A2 cow milk, Vedic Bilona ghee, unadulterated paneer, curd, fresh butter, and cold-pressed oils.',
    url: 'https://aranyadairyfarm.com/products',
    images: [
      {
        url: '/images/nature_hero_pasture.jpg',
        width: 1200,
        height: 630,
        alt: 'Aranya Organic Dairy Farm Products',
      },
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
