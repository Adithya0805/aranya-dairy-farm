export interface Product {
  id: string;
  name: string;
  category: 'Milk' | 'Ghee' | 'Dairy Fresh';
  unit: string;
  description: string;
  available: boolean;
}

// Single source of truth for products. Leave empty for Phase 1 Coming Soon state.
export const PRODUCTS: Product[] = [];
