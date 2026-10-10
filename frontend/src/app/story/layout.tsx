import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';

export const metadata: Metadata = {
  title: {
    absolute: 'Our 9-Year Story — Vedic Dairy & Gir Cow Stewardship | Aranya Farm Shoolagiri',
  },
  alternates: {
    canonical: '/story',
  },
  description:
    "Discover Aranya Farm's 9-year Vedic journey in Shoolagiri. Pasture-raised Gir cows, calf-first milking, and ethical chemical-free dairy serving Hosur families.",
  openGraph: {
    title: 'Our 9-Year Story — Vedic Dairy & Gir Cow Stewardship | Aranya Farm Shoolagiri',
    description:
      "Discover Aranya Farm's 9-year Vedic journey in Shoolagiri. Pasture-raised Gir cows, calf-first milking, and ethical chemical-free dairy serving Hosur families.",
    url: `${FARM_DOMAIN}/story`,
    siteName: 'Aranya Organic Dairy Farm',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Our 9-Year Story — Aranya Organic Dairy Farm Shoolagiri, Hosur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our 9-Year Story — Vedic Dairy & Gir Cow Stewardship | Aranya Farm Shoolagiri',
    description:
      "Discover Aranya Farm's 9-year Vedic journey in Shoolagiri. Pasture-raised Gir cows, calf-first milking, and ethical chemical-free dairy serving Hosur families.",
    images: ['/images/og-image.jpg'],
  },
};

export default function StoryLayout({
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
        name: 'Our Story',
        item: `${FARM_DOMAIN}/story`,
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
