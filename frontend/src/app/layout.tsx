import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ChatAssistantWidget from "@/components/ChatAssistantWidget";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FARM_DOMAIN } from "@/lib/contact";

export const metadata: Metadata = {
  metadataBase: new URL(FARM_DOMAIN),
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
  ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* CartProvider wraps the entire app so any component can access cart state */}
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppCTA />
          <ChatAssistantWidget />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
