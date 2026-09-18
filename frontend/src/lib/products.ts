// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all Aranya Dairy Farm catalog products.
// Domestic retail grocery store catalog ("Mallige Kadai") with 32 total products.
//
// PRICING NOTE:
// Final pricing is not yet confirmed by the client. Price is set to null for ALL
// products for now. No placeholder/fake ₹ amounts are shown anywhere in the UI.
// When client provides the final price list, update the price field to a number
// (e.g. price: 80) — no layout or component changes are needed.
//
// AVAILABILITY & RICE SECTION NOTE:
// - Exactly 24 confirmed products have available: true and are live in the catalog.
// - The 8 traditional Rice items have available: false and are excluded from the
//   visible storefront grid until client confirms exact milling, varieties & sizes.
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'Dairy'
  | 'Rice & Millets'
  | 'Pulses & Lentils'
  | 'Nuts & Sweeteners'
  | 'Ready Mixes'
  | 'General Store';

export const CATEGORIES: ProductCategory[] = [
  'Dairy',
  'Rice & Millets',
  'Pulses & Lentils',
  'Nuts & Sweeteners',
  'Ready Mixes',
  'General Store',
];

export interface Product {
  id: string;
  name: string;
  nameTamil: string;
  category: ProductCategory;
  price: number | null; // in ₹ (numeric when set, null when pending client pricing)
  unit: string;         // e.g. "1 Litre", "500g", "1 kg"
  image: string;        // neutral placeholder until real photography is shot
  available: boolean;   // true for 24 confirmed items, false for 8 pending Rice items
  featured?: boolean;   // true if featured on homepage Farm Favorites
  createdAt?: string;   // ISO timestamp
  description?: string;
}

export const PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. DAIRY (7 Products — Confirmed Available)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fresh-milk',
    name: 'Fresh Farm Milk',
    nameTamil: 'பசும்பால்',
    category: 'Dairy',
    price: null,
    unit: '1 Litre',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Fresh, unadulterated whole cow milk from local pasture-fed cows in Shoolagiri.',
  },
  {
    id: 'a2-desi-cow-milk',
    name: 'A2 Desi Cow Milk',
    nameTamil: 'A2 நாட்டுப் பசும்பால்',
    category: 'Dairy',
    price: null,
    unit: '1 Litre Glass Bottle',
    image: '/images/a2_milk_bottle.jpg',
    available: true,
    featured: true,
    description: '100% pure raw A2 milk from free-roaming Gir and Sahiwal cows, naturally rich in A2 beta-casein.',
  },
  {
    id: 'milk-generic',
    name: 'Farm Whole Milk',
    nameTamil: 'பண்ணைப் பால்',
    category: 'Dairy',
    price: null,
    unit: '1 Litre',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Wholesome daily whole farm milk for domestic household cooking and tea/coffee.',
  },
  {
    id: 'fresh-butter',
    name: 'Fresh Cultured Butter',
    nameTamil: 'வெண்ணெய்',
    category: 'Dairy',
    price: null,
    unit: '250g',
    image: '/images/vedic_butter.jpg',
    available: true,
    featured: true,
    description: 'Traditional cultured butter, freshly hand-churned daily from whole farm cream.',
  },
  {
    id: 'cow-ghee',
    name: 'Pure Cow Ghee',
    nameTamil: 'பசும் நெய்',
    category: 'Dairy',
    price: null,
    unit: '500ml Glass Jar',
    image: '/images/traditional_ghee_bowl.webp',
    available: true,
    description: 'Pure golden cow ghee prepared traditionally with natural aroma and granular texture.',
  },
  {
    id: 'desi-cow-ghee',
    name: 'Traditional Desi Cow Ghee',
    nameTamil: 'தேசி பசும் நெய்',
    category: 'Dairy',
    price: null,
    unit: '500ml Glass Jar',
    image: '/images/traditional_ghee_bowl.webp',
    available: true,
    featured: true,
    description: 'Authentic Desi cow ghee crafted following time-tested indigenous Indian methods.',
  },
  {
    id: 'pure-desi-ghee',
    name: 'Pure A2 Vedic Desi Ghee',
    nameTamil: 'தூய தேசி நெய்',
    category: 'Dairy',
    price: null,
    unit: '500ml Glass Jar',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Woodfired Vedic Bilona ghee hand-churned from cultured curd, zero additives or preservatives.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. RICE & MILLETS (12 Products total: 4 Millets active, 8 Rice items pending)
  // ═══════════════════════════════════════════════════════════════════════════

  // Confirmed Millets (4 Products — Available)
  {
    id: 'siri-mix',
    name: 'Siri Mix (Pearl, Foxtail & Kodo)',
    nameTamil: 'சிரி மிக்ஸ் (கம்பு, திணை, வரகு)',
    category: 'Rice & Millets',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Wholesome power mix of native millets: Kambu (Pearl), Thinai (Foxtail), and Varagu (Kodo).',
  },
  {
    id: 'proso-millet',
    name: 'Proso Millet',
    nameTamil: 'பனி வரகு (சாமை)',
    category: 'Rice & Millets',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Naturally gluten-free grain rich in protein, complex carbohydrates, and dietary minerals.',
  },
  {
    id: 'foxtail-millet',
    name: 'Foxtail Millet',
    nameTamil: 'திணை',
    category: 'Rice & Millets',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Ancient grain celebrated for high dietary fiber, iron, and slow-releasing energy.',
  },
  {
    id: 'barnyard-millet',
    name: 'Barnyard Millet',
    nameTamil: 'குதிரைவாலி',
    category: 'Rice & Millets',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Low-glycemic wholesome millet, ideal for daily porridge, upma, and nutritious khichdi.',
  },

  // ── PENDING RICE VARIETIES (8 items — available: false) ────────────────────
  // Note: These 8 traditional rice items exist in the data structure as transcribed
  // from the client notebook draft, but remain marked `available: false` and are
  // intentionally hidden from the visible storefront until names, milling styles,
  // and packaging sizes are explicitly confirmed with the client.
  {
    id: 'mappillai-samba',
    name: 'Mappillai Samba Rice',
    nameTamil: 'மாப்பிள்ளை சம்பா',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Legendary Tamil heritage red rice variety renowned for strength, stamina, and zinc content.',
  },
  {
    id: 'karuppu-kavuni',
    name: 'Karuppu Kavuni Black Rice',
    nameTamil: 'கருப்பு கவுனி',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Ancient royal black rice rich in anthocyanin antioxidants, dietary fiber, and minerals.',
  },
  {
    id: 'seeraga-samba',
    name: 'Seeraga Samba Rice',
    nameTamil: 'சீரக சம்பா',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Tiny aromatic grain famed across South India for fragrant biryanis and festive feasts.',
  },
  {
    id: 'thooyamalli',
    name: 'Thooyamalli Rice',
    nameTamil: 'தூயமல்லி',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Pristine jasmine-like white heritage rice, exceptionally light on stomach and easy to digest.',
  },
  {
    id: 'poongar',
    name: 'Poongar Traditional Rice',
    nameTamil: 'பூங்கார்',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Traditional wellness red rice variety, traditionally cherished for women and maternal nutrition.',
  },
  {
    id: 'kaattuyanam',
    name: 'Kaattuyanam Rice',
    nameTamil: 'காட்டுயானம்',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Ancient tall-stem wild rice variety loaded with calcium, magnesium, and natural fiber.',
  },
  {
    id: 'kichili-samba',
    name: 'Kichili Samba Rice',
    nameTamil: 'கிச்சிலி சம்பா',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Fine heritage grain with low glycemic response, widely favored for daily South Indian meals.',
  },
  {
    id: 'kullakkar',
    name: 'Kullakkar Rice',
    nameTamil: 'குள்ளக்கார்',
    category: 'Rice & Millets',
    price: null,
    unit: '1 kg',
    image: '/images/placeholder-product.svg',
    available: false,
    description: 'Resilient indigenous red rice variety prized for making nutritive gruel, idlis, and dosas.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PULSES & LENTILS (6 Products — Confirmed Available)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fried-gram',
    name: 'Fried Gram (Pottukadalai)',
    nameTamil: 'பொரித்த கடலை / பொட்டுக்கடலை',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Crispy roasted split Bengal gram, essential for South Indian chutneys, snacks, and sweets.',
  },
  {
    id: 'green-gram',
    name: 'Green Gram (Whole Moong)',
    nameTamil: 'பாசிப்பயறு (முழு)',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Whole unpolished green moong beans, excellent for sprouting, sundal, and wholesome curries.',
  },
  {
    id: 'horse-gram',
    name: 'Horse Gram (Kollu)',
    nameTamil: 'கொள்ளு',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'High-protein ancient rustic pulse, celebrated for warmth, metabolism, rasam, and thuvaiyal.',
  },
  {
    id: 'moong-dal',
    name: 'Moong Dal (Split Yellow)',
    nameTamil: 'பாசிப்பருப்பு (உரித்த பாசிப்பயறு)',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Dehusked split yellow lentils that cook quickly into silky, easy-to-digest kootu and dal.',
  },
  {
    id: 'toor-dal',
    name: 'Toor Dal',
    nameTamil: 'துவரம் பருப்பு',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Premium unpolished split pigeon peas, the foundational heart of daily South Indian sambar.',
  },
  {
    id: 'urad-dal',
    name: 'Urad Dal (Split White)',
    nameTamil: 'உளுத்தம் பருப்பு (உரித்த)',
    category: 'Pulses & Lentils',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Clean split white urad lentils, indispensable for airy fermentation of fluffy idlis and medu vadas.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. NUTS & SWEETENERS (2 Products — Confirmed Available)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'peanuts',
    name: 'Peanuts / Groundnuts',
    nameTamil: 'நிலக்கடலை / வேர்க்கடலை',
    category: 'Nuts & Sweeteners',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Farm-fresh raw groundnuts rich in healthy natural fats, protein, and satisfying crunch.',
  },
  {
    id: 'jaggery-powder',
    name: 'Organic Jaggery Powder',
    nameTamil: 'நாட்டுச் சர்க்கரை / வெல்லப் பொடி',
    category: 'Nuts & Sweeteners',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Unrefined sugarcane jaggery powder, free from chemical clarifying agents, rich in natural iron.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. READY MIXES (3 Products — Confirmed Available)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'barnyard-pongal-mix',
    name: 'Barnyard Millet Pongal Mix',
    nameTamil: 'குதிரைவாலி பொங்கல் மிக்ஸ்',
    category: 'Ready Mixes',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Wholesome instant breakfast blend of barnyard millet, split moong dal, and fragrant seasoning.',
  },
  {
    id: 'barnyard-bisibelebath-mix',
    name: 'Barnyard Bisibelebath Mix',
    nameTamil: 'குதிரைவாலி பிசிபேளாபாத் மிக்ஸ்',
    category: 'Ready Mixes',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Nutritious Karnataka-style spicy hot lentil rice mix powered with fiber-rich barnyard millet.',
  },
  {
    id: 'dosa-hittu',
    name: 'Millet Dosa Batter Flour (Dosa Hittu)',
    nameTamil: 'தோசை மாவு (சிறு தானிய மாவு)',
    category: 'Ready Mixes',
    price: null,
    unit: '500g',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Finely milled multi-millet flour blend for crisp, golden, healthy home-cooked dosas.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. GENERAL STORE (2 Products — Confirmed Available)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'amul-pure-ghee',
    name: 'Amul Pure Ghee',
    nameTamil: 'அமுல் நெய்',
    category: 'General Store',
    price: null,
    unit: '500ml',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Standard packaged pure dairy ghee available in the local retail store inventory.',
  },
  {
    id: 'vanaspati-ghee',
    name: 'Vanaspati Ghee',
    nameTamil: 'வனஸ்பதி நெய்',
    category: 'General Store',
    price: null,
    unit: '500ml',
    image: '/images/placeholder-product.svg',
    available: true,
    description: 'Commercial vegetable cooking fat for domestic kitchen frying, sweets, and bakery.',
  },
];

/**
 * Returns human-readable label for product price.
 * Shows "Price updating soon" whenever price is null (no fake ₹ amounts).
 */
export function getProductPriceLabel(product: Product): string {
  if (product.price === null || product.price === undefined) {
    return 'Price updating soon';
  }
  return formatPrice(product.price);
}

/** Helper to format a numeric price into the ₹ label string e.g. "₹80.00". */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
