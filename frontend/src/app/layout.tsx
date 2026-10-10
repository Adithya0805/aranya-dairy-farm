import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ChatAssistantWidget from "@/components/ChatAssistantWidget";
import PersistentMobileCartBar from "@/components/PersistentMobileCartBar";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FARM_DOMAIN } from "@/lib/contact";

export const metadata: Metadata = {
  metadataBase: new URL(FARM_DOMAIN),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Aranya Organic Dairy Farm | A2 Milk, Ghee & Grocery — Hosur",
    template: "%s | Aranya Organic Dairy Farm",
  },
  description:
    "Pure raw A2 milk, Vedic Bilona ghee, and fresh organic provisions from free-grazing cows at Aranya Dairy Farm in Shoolagiri. Delivered daily across Hosur homes.",
  keywords: [
    "A2 Milk Hosur",
    "Organic Dairy Farm Shoolagiri",
    "Bilona Ghee Tamil Nadu",
    "Aranya Dairy Farm",
    "Pure A2 Cow Milk Hosur",
    "Vedic Bilona Ghee Shoolagiri",
    "Desi Cow Milk Delivery Hosur",
    "Organic Farm Provisions Hosur",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Aranya Organic Dairy Farm | A2 Milk, Ghee & Grocery — Hosur",
    description:
      "Pure raw A2 milk, Vedic Bilona ghee, and fresh organic provisions from free-grazing cows at Aranya Dairy Farm in Shoolagiri. Delivered daily across Hosur homes.",
    url: FARM_DOMAIN,
    siteName: "Aranya Organic Dairy Farm",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aranya Organic Dairy Farm — Pure A2 Milk & Vedic Bilona Ghee in Shoolagiri, Hosur",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aranya Organic Dairy Farm | A2 Milk, Ghee & Grocery — Hosur",
    description:
      "Pure raw A2 milk, Vedic Bilona ghee, and fresh organic provisions from free-grazing cows at Aranya Dairy Farm in Shoolagiri. Delivered daily across Hosur homes.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/aranya-logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aranya Dairy",
  },
};

export const viewport = {
  themeColor: "#1B4D2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${FARM_DOMAIN}/#website`,
      "url": FARM_DOMAIN,
      "name": "Aranya Organic Dairy Farm",
      "description": "Pure raw A2 milk, Vedic Bilona ghee, and fresh organic provisions in Shoolagiri, Hosur.",
      "publisher": {
        "@id": `${FARM_DOMAIN}/#organization`
      },
      "inLanguage": ["en-IN", "ta-IN"]
    },
    {
      "@type": ["DairyFarm", "LocalBusiness", "Organization"],
      "@id": `${FARM_DOMAIN}/#organization`,
      "name": "Aranya Organic Dairy Farm",
      "legalName": "Aranya Organic Dairy Farm",
      "url": FARM_DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "@id": `${FARM_DOMAIN}/#logo`,
        "url": `${FARM_DOMAIN}/images/aranya-logo.png`,
        "caption": "Aranya Organic Dairy Farm Logo"
      },
      "image": `${FARM_DOMAIN}/images/nature_hero_pasture.jpg`,
      "description": "Pure raw A2 Gir cow milk, Vedic Bilona ghee, and natural farm provisions from free-grazing native cows in Shoolagiri. Delivered daily before 7:30 AM across Hosur.",
      "email": "info@aranyaorganicdairyfarm.com",
      "telephone": "+91-9944338612",
      "foundingDate": "2017",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shoolagiri, Bangalore-Chennai NH 44 Highway",
        "addressLocality": "Shoolagiri, Hosur",
        "addressRegion": "Tamil Nadu",
        "postalCode": "635117",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.6657,
        "longitude": 78.0125
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Hosur"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Shoolagiri"
        },
        {
          "@type": "City",
          "name": "Bengaluru"
        }
      ],
      "priceRange": "₹₹",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "05:30",
          "closes": "20:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "3.6",
        "reviewCount": "15",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased">
        {/* CartProvider wraps the entire app so any component can access cart state */}
        <CartProvider>
          {children}
          <CartDrawer />
          <PersistentMobileCartBar />
          <WhatsAppCTA />
          <ChatAssistantWidget />
          <CookieBanner />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
