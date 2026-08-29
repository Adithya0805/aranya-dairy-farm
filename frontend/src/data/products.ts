export interface Product {
  id: string;
  name: string;
  category: 'Milk' | 'Ghee' | 'Butter' | 'Curd';
  unit: string;
  price: string;
  image: string;
  description: string;
  details: string[];
  available: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'a2-milk',
    name: 'Raw A2 Whole Milk',
    category: 'Milk',
    unit: '1 Litre Glass Bottle',
    price: '₹80.00',
    image: '/images/a2_milk_bottle.jpg',
    description: '100% pure, unprocessed raw A2 milk from free-roaming, grass-fed native cows.',
    details: [
      'Unpasteurized & non-homogenized natural milk',
      'Rich in A2 beta-casein protein for effortless digestion',
      'Chilled to 4°C within 30 minutes of hands-free milking',
      'Delivered daily before 7:00 AM in sanitized eco glass bottles'
    ],
    available: true
  },
  {
    id: 'bilona-ghee',
    name: 'Traditional Bilona Cow Ghee',
    category: 'Ghee',
    unit: '500g Glass Jar',
    price: '₹1,400.00',
    image: '/images/bilona_ghee_jar.jpg',
    description: 'Hand-churned from curd using Vedic Bilona method over slow woodfire.',
    details: [
      'Crafted from 25+ litres of pure A2 milk per kg of ghee',
      'Granular texture with golden natural aroma',
      'Zero additives, preservatives, or artificial colors',
      'Packed with natural butyric acid, omega-3, and vitamin K2'
    ],
    available: true
  },
  {
    id: 'vedic-butter',
    name: 'Vedic Artisanal Butter',
    category: 'Butter',
    unit: '250g Block',
    price: '₹450.00',
    image: '/images/vedic_butter.jpg',
    description: 'Freshly churned cultured white & golden butter with a rich creamy finish.',
    details: [
      'Hand-churned daily from whole A2 cultured cream',
      'Lightly unsalted and high in bioavailable milk fat',
      'Zero chemical emulsifiers or stabilizers',
      'Ideal for traditional cooking, baking, or spreading'
    ],
    available: true
  }
];
