import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Farm Visit | Aranya Organic Dairy Farm',
  description:
    'Visit our organic dairy farm in Shoolagiri, Hosur or reach out for fresh daily A2 milk delivery and subscriptions.',
  openGraph: {
    title: 'Contact & Farm Visit | Aranya Organic Dairy Farm',
    description:
      'Visit our organic dairy farm in Shoolagiri, Hosur or reach out for fresh daily A2 milk delivery and subscriptions.',
    url: 'https://aranyadairyfarm.com/contact',
    images: [
      {
        url: '/images/nature_hero_pasture.jpg',
        width: 1200,
        height: 630,
        alt: 'Aranya Organic Dairy Farm Location & Contact',
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
