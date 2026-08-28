import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aranya Organic Dairy Farm | Fresh A2 Milk & Bilona Ghee in Shoolagiri, Hosur",
  description: "9-year established organic dairy farm in Shoolagiri, Hosur, Tamil Nadu. 100% pure raw A2 cow milk, traditional Bilona ghee, paneer, and curd delivered in eco glass bottles.",
  keywords: ["A2 Milk Hosur", "Organic Dairy Farm Shoolagiri", "Bilona Ghee Tamil Nadu", "Aranya Dairy Farm", "Pure A2 Cow Milk Hosur"],
  openGraph: {
    title: "Aranya Organic Dairy Farm — Pure A2 Milk & Bilona Ghee",
    description: "Ethical pasture-raised cows, 4°C instant chilling, zero preservatives. Delivered fresh in glass bottles.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
