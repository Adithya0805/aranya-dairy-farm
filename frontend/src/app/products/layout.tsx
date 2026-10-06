import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: {
    absolute: 'Shop All Products | Aranya Organic Dairy Farm',
  },
  description:
    'Order farm-fresh A2 cow milk, traditional wooden-churned Bilona ghee, paneer, and groceries in Shoolagiri. Fresh morning doorstep delivery straight to Hosur.',
  openGraph: {
    title: 'Shop All Products | Aranya Organic Dairy Farm',
    description:
      'Order farm-fresh A2 cow milk, traditional wooden-churned Bilona ghee, paneer, and groceries in Shoolagiri. Fresh morning doorstep delivery straight to Hosur.',
    url: `${FARM_DOMAIN}/products`,
    siteName: 'Aranya Organic Dairy Farm',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shop Organic A2 Dairy Products — Aranya Farm Shoolagiri, Hosur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products | Aranya Organic Dairy Farm',
    description:
      'Order farm-fresh A2 cow milk, traditional wooden-churned Bilona ghee, paneer, and groceries in Shoolagiri. Fresh morning doorstep delivery straight to Hosur.',
    images: ['/images/og-image.jpg'],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
