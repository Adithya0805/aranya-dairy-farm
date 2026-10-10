import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCTS, getProductById, Product } from '@/lib/products';
import { FARM_DOMAIN } from '@/lib/contact';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return PRODUCTS.filter((p) => p.available).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found | Aranya Organic Dairy Farm',
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} (${product.nameTamil}) | Aranya Dairy Farm`;
  const description =
    product.description ||
    `Order pure, unadulterated ${product.name} (${product.nameTamil}) - ${product.unit}. Pasture-raised native cow harvest from Shoolagiri, fresh morning doorstep delivery across Hosur.`;
  const canonicalUrl = `${FARM_DOMAIN}/products/${product.id}`;
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${FARM_DOMAIN}${product.image}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Aranya Organic Dairy Farm',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} — Aranya Organic Dairy Farm Shoolagiri`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product || !product.available) {
    notFound();
  }

  // Related products from same category (excluding current)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.available && p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const productImageUrl = product.image.startsWith('http')
    ? product.image
    : `${FARM_DOMAIN}${product.image}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    alternateName: product.nameTamil,
    image: productImageUrl,
    description:
      product.description ||
      `Pure raw ${product.name} produced with sustainable Vedic farming practices at Aranya Dairy Farm in Shoolagiri.`,
    brand: {
      '@type': 'Brand',
      name: 'Aranya Organic Dairy Farm',
    },
    offers: {
      '@type': 'Offer',
      url: `${FARM_DOMAIN}/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.price ?? 0,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Aranya Organic Dairy Farm',
      },
    },
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
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${FARM_DOMAIN}/products/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
