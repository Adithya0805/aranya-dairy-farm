import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ChatAssistantWidget from "@/components/ChatAssistantWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://aranyadairyfarm.com"),
  title: "Aranya Organic Dairy Farm | Fresh A2 Milk & Bilona Ghee in Shoolagiri, Hosur",
  description:
    "9-year established organic dairy farm in Shoolagiri, Hosur, Tamil Nadu. 100% pure raw A2 cow milk, traditional Bilona ghee, paneer, and curd delivered in eco glass bottles.",
  keywords: [
    "A2 Milk Hosur",
    "Organic Dairy Farm Shoolagiri",
    "Bilona Ghee Tamil Nadu",
    "Aranya Dairy Farm",
    "Pure A2 Cow Milk Hosur",
  ],
  openGraph: {
    title: "Aranya Organic Dairy Farm — Pure A2 Milk & Bilona Ghee",
    description:
      "Ethical pasture-raised cows, 4°C instant chilling, zero preservatives. Delivered fresh in glass bottles.",
    url: "https://aranyadairyfarm.com",
    siteName: "Aranya Organic Dairy Farm",
    images: [
      {
        url: "/images/nature_hero_pasture.jpg",
        width: 1200,
        height: 630,
        alt: "Aranya Dairy Farm Pasture-Raised Native Cows",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aranya Organic Dairy Farm — Pure A2 Milk & Bilona Ghee",
    description:
      "Ethical pasture-raised cows, 4°C instant chilling, zero preservatives. Delivered fresh in glass bottles.",
    images: ["/images/nature_hero_pasture.jpg"],
  },
  icons: {
    icon: [
      { url: '/images/aranya-logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/images/aranya-logo.png', type: 'image/png' },
    ],
    shortcut: '/images/aranya-logo.png',
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
          <ChatAssistantWidget />
        </CartProvider>
      </body>
    </html>
  );
}
