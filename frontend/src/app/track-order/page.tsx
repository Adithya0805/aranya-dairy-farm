import { Suspense } from 'react';
import type { Metadata } from 'next';
import TrackOrderContent from './TrackOrderContent';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: {
    absolute: 'Track Your Order | Aranya Organic Dairy Farm',
  },
  description:
    'Track real-time delivery status for your Aranya Organic Dairy Farm order. Pure raw A2 milk and Vedic ghee dispatched daily from Shoolagiri direct to Hosur.',
  openGraph: {
    title: 'Track Your Order | Aranya Organic Dairy Farm',
    description:
      'Track real-time delivery status for your Aranya Organic Dairy Farm order. Pure raw A2 milk and Vedic ghee dispatched daily from Shoolagiri direct to Hosur.',
    url: `${FARM_DOMAIN}/track-order`,
    siteName: 'Aranya Organic Dairy Farm',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Track Order — Aranya Organic Dairy Farm Shoolagiri, Hosur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Your Order | Aranya Organic Dairy Farm',
    description:
      'Track real-time delivery status for your Aranya Organic Dairy Farm order. Pure raw A2 milk and Vedic ghee dispatched daily from Shoolagiri direct to Hosur.',
    images: ['/images/og-image.jpg'],
  },
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#1B4D2E]/20 border-t-[#1B4D2E] rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
