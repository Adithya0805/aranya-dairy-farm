import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: {
    absolute: 'Book Farm Visit & Daily Milk Delivery Contact | Aranya Organic Dairy Farm',
  },
  alternates: {
    canonical: '/contact',
  },
  description:
    'Book a family visit to Aranya Organic Dairy Farm in Shoolagiri or contact our team for daily fresh A2 milk and Vedic Bilona ghee deliveries across Hosur homes.',
  openGraph: {
    title: 'Book Farm Visit & Daily Milk Delivery Contact | Aranya Organic Dairy Farm',
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
    title: 'Book Farm Visit & Daily Milk Delivery Contact | Aranya Organic Dairy Farm',
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
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: FARM_DOMAIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact & Farm Visit',
        item: `${FARM_DOMAIN}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
