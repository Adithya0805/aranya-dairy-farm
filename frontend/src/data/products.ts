export interface Product {
  id: string;
  name: string;
  category: 'Milk' | 'Ghee' | 'Dairy Fresh';
  price: string;
  unit: string;
  description: string;
  badges: string[];
  popular?: boolean;
  image: string;
  highlights: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'a2-milk-1l',
    name: 'Raw A2 Whole Cow Milk',
    category: 'Milk',
    price: '₹75',
    unit: '1 Litre Glass Bottle',
    description: '100% pure, unpasteurized, unprocessed A2 milk from free-roaming, grass-fed native cows in Shoolagiri.',
    badges: ['100% A2 Protein', 'Zero Preservatives', 'Daily Delivery'],
    popular: true,
    image: '🥛',
    highlights: ['Free-roaming pasture grazed', 'Chilled within 30 mins of milking', 'Sterilized eco glass bottles']
  },
  {
    id: 'bilona-ghee-500ml',
    name: 'Traditional Bilona Cow Ghee',
    category: 'Ghee',
    price: '₹650',
    unit: '500 ml Glass Jar',
    description: 'Handcrafted using the ancient 5-stage Bilona method — curd churned to butter, slowly boiled on clay stoves.',
    badges: ['Vedic Bilona Method', 'Rich Aroma', 'High Immunity'],
    popular: true,
    image: '🏺',
    highlights: ['Made from A2 curd butter', 'Granular golden texture', 'Zero additives or chemicals']
  },
  {
    id: 'fresh-paneer-200g',
    name: 'Fresh Farm Cottage Cheese (Paneer)',
    category: 'Dairy Fresh',
    price: '₹120',
    unit: '200g Pack',
    description: 'Ultra-soft, melt-in-the-mouth paneer curdled naturally using organic lemon extract from whole A2 milk.',
    badges: ['Melt In Mouth', 'High Protein', 'Freshly Made'],
    popular: false,
    image: '🧀',
    highlights: ['Curdled with organic lemon', 'No artificial coagulants', 'Rich in natural calcium']
  },
  {
    id: 'set-curd-500g',
    name: 'Organic Set Thick Curd (Dahi)',
    category: 'Dairy Fresh',
    price: '₹55',
    unit: '500g Eco Tub',
    description: 'Thick, creamy traditional set curd cultured with indigenous probiotic starters for natural gut health.',
    badges: ['Probiotic Rich', 'Natural Ferment', 'Gut Friendly'],
    popular: false,
    image: '🥣',
    highlights: ['Natural live cultures', 'Thick non-watery texture', 'Aids digestion naturally']
  },
  {
    id: 'white-butter-250g',
    name: 'Pure Desi White Butter (Makhan)',
    category: 'Dairy Fresh',
    price: '₹180',
    unit: '250g Pack',
    description: 'Freshly hand-churned unsalted white butter with authentic rural aroma and rich creamy taste.',
    badges: ['Hand Churned', 'Unsalted', 'Authentic Taste'],
    popular: false,
    image: '🧈',
    highlights: ['Zero added salt or colors', 'Rich in Vitamin A & K2', 'Direct from churn to packaging']
  }
];
