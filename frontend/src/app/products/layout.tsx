import type { Metadata } from 'next';
import { FARM_DOMAIN } from '@/lib/contact';
import { PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: {
    absolute: 'A2 Milk, Vedic Bilona Ghee & Organic Groceries | Aranya Dairy Farm',
  },
  alternates: {
    canonical: '/products',
  },
  description:
    'Order farm-fresh A2 cow milk, traditional wooden-churned Bilona ghee, paneer, and groceries in Shoolagiri. Fresh morning doorstep delivery straight to Hosur.',
  openGraph: {
    title: 'A2 Milk, Vedic Bilona Ghee & Organic Groceries | Aranya Dairy Farm',
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
    title: 'A2 Milk, Vedic Bilona Ghee & Organic Groceries | Aranya Dairy Farm',
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
  const confirmedProducts = PRODUCTS.filter((p) => p.available);
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Aranya Organic Dairy Farm Harvest & Provisions',
    description: 'Farm-fresh unadulterated A2 milk, Vedic Bilona ghee, and natural groceries from Shoolagiri.',
    itemListElement: confirmedProducts.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        alternateName: p.nameTamil,
        description: p.description || `${p.name} from Aranya Organic Dairy Farm, Shoolagiri.`,
        image: p.image.startsWith('http') ? p.image : `${FARM_DOMAIN}${p.image}`,
        brand: {
          '@type': 'Brand',
          name: 'Aranya Organic Dairy Farm',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: p.price ?? 0,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Aranya Organic Dairy Farm',
          },
        },
      },
    })),
  };

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
        name: 'Products',
        item: `${FARM_DOMAIN}/products`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
