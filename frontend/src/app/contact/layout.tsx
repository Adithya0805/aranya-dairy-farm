import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: {
    absolute: 'Visit Our Farm & Contact Us | Aranya Organic Dairy Farm',
  },
  description:
    'Book a family visit to Aranya Organic Dairy Farm in Shoolagiri or contact our team for daily fresh A2 milk and Vedic Bilona ghee deliveries across Hosur homes.',
  openGraph: {
    title: 'Visit Our Farm & Contact Us | Aranya Organic Dairy Farm',
    description:
      'Book a family visit to Aranya Organic Dairy Farm in Shoolagiri or contact our team for daily fresh A2 milk and Vedic Bilona ghee deliveries across Hosur homes.',
    url: `${FARM_DOMAIN}/contact`,
    siteName: 'Aranya Organic Dairy Farm',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Visit Aranya Organic Dairy Farm — Shoolagiri & Hosur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit Our Farm & Contact Us | Aranya Organic Dairy Farm',
    description:
      'Book a family visit to Aranya Organic Dairy Farm in Shoolagiri or contact our team for daily fresh A2 milk and Vedic Bilona ghee deliveries across Hosur homes.',
    images: ['/images/og-image.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
