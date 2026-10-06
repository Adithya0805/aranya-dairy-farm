import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Thank You | Aranya Organic Dairy Farm',
  },
  description:
    'Thank you for contacting Aranya Organic Dairy Farm in Shoolagiri. Our farm team will confirm your request and delivery details on WhatsApp shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
