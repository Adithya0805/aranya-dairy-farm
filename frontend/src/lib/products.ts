// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all Aranya Dairy Farm products.
// To add a new product: append one object to PRODUCTS below.
// No other code changes are required — the cart, product grid, and WhatsApp
// checkout message builder all read from this array automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;        // in ₹ (numeric, for arithmetic)
  priceLabel: string;   // formatted label shown in UI e.g. "₹80.00"
  unit: string;         // e.g. "1 Litre Glass Bottle"
  image: string;        // path relative to /public
  description: string;
  category: 'Milk' | 'Ghee' | 'Butter' | 'Curd';
}

export const PRODUCTS: Product[] = [
  {
    id: 'a2-raw-whole-milk',
    name: 'Raw A2 Whole Milk',
    price: 80,
    priceLabel: '₹80.00',
    unit: '1 Litre Glass Bottle',
    image: '/images/a2_milk_bottle.jpg',
    description:
      '100% pure, unprocessed raw A2 milk from free-roaming, grass-fed native cows. Chilled to 4°C within 30 minutes of milking.',
    category: 'Milk',
  },
  {
    id: 'traditional-bilona-cow-ghee',
    name: 'Traditional Bilona Cow Ghee',
    price: 1400,
    priceLabel: '₹1,400.00',
    unit: '500g Glass Jar',
    image: '/images/bilona_ghee_jar.jpg',
    description:
      'Hand-churned from curd using the Vedic Bilona method over slow woodfire. Granular texture, golden aroma, zero additives.',
    category: 'Ghee',
  },
  {
    id: 'vedic-artisanal-butter',
    name: 'Vedic Artisanal Butter',
    price: 450,
    priceLabel: '₹450.00',
    unit: '250g Block',
    image: '/images/vedic_butter.jpg',
    description:
      'Freshly hand-churned cultured butter from whole A2 cream. Lightly unsalted, high in bioavailable milk fat, zero chemical emulsifiers.',
    category: 'Butter',
  },
  // ── Add future products here ───────────────────────────────────────────────
];

/** Helper to format a numeric price back into the ₹ label string. */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
