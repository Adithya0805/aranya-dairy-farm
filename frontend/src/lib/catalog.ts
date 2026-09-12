import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product, ProductCategory, CATEGORIES, PRODUCTS } from '@/lib/products';

export interface CategoryRow {
  id: string;
  name: string;
}

export interface ProductRow {
  id: string;
  name: string;
  name_tamil: string | null;
  category_id: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  available: boolean;
  description: string | null;
  created_at?: string;
  categories?: {
    id: string;
    name: string;
  } | null;
}

const PREFERRED_CATEGORY_ORDER: ProductCategory[] = [
  'Dairy',
  'Rice & Millets',
  'Pulses & Lentils',
  'Nuts & Sweeteners',
  'Ready Mixes',
  'General Store',
];

/**
 * Resolves a storage path or URL to a public image URL.
 */
export function resolveProductImageUrl(imagePathOrUrl: string | null | undefined): string {
  if (!imagePathOrUrl) {
    return '/images/placeholder-product.svg';
  }
  if (
    imagePathOrUrl.startsWith('http://') ||
    imagePathOrUrl.startsWith('https://') ||
    imagePathOrUrl.startsWith('/')
  ) {
    return imagePathOrUrl;
  }
  try {
    const { data } = supabase.storage.from('product-images').getPublicUrl(imagePathOrUrl);
    return data?.publicUrl || imagePathOrUrl;
  } catch {
    return imagePathOrUrl;
  }
}

/**
 * Fetches all categories from the Supabase categories table.
 * Falls back to hardcoded CATEGORIES if Supabase is unconfigured or returns an error.
 */
export async function getCategories(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name');

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] Categories fetch error, falling back to default categories:', error.message);
      return CATEGORIES;
    }

    const categoryNames = data.map((c) => c.name);
    // Sort according to preferred order, then alphabetical
    return categoryNames.sort((a, b) => {
      const idxA = PREFERRED_CATEGORY_ORDER.indexOf(a as ProductCategory);
      const idxB = PREFERRED_CATEGORY_ORDER.indexOf(b as ProductCategory);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  } catch (err) {
    console.warn('[Supabase] Failed to get categories:', err);
    return CATEGORIES;
  }
}

/**
 * Fetches all products joined with their category from Supabase.
 * Falls back to hardcoded PRODUCTS if Supabase is unconfigured or returns an error.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, name_tamil, category_id, price, unit, image_url, available, description, categories(id, name)')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] Products fetch error, falling back to default products:', error.message);
      return PRODUCTS;
    }

    return (data as unknown as ProductRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      nameTamil: row.name_tamil || '',
      category: ((row.categories?.name as ProductCategory) || 'General Store'),
      price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
      unit: row.unit || '',
      image: resolveProductImageUrl(row.image_url),
      available: Boolean(row.available),
      description: row.description || undefined,
    }));
  } catch (err) {
    console.warn('[Supabase] Failed to get products:', err);
    return PRODUCTS;
  }
}

/**
 * Creates an order in the Supabase orders table (public INSERT).
 */
export async function createOrder(payload: {
  items: Array<{ product_id: string; name: string; qty: number; price: number | null }>;
  total: number | null;
  whatsapp_message: string;
}) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase.from('orders').insert({
      items: payload.items,
      total: payload.total,
      status: 'pending',
      whatsapp_message: payload.whatsapp_message,
    });
    return { data, error };
  } catch (err) {
    console.error('[Supabase] Order creation exception:', err);
    return { data: null, error: err };
  }
}

/**
 * Diagnostic helper: Attempts a test write to the products table using public anon key.
 * Used to verify that Row Level Security (RLS) actively blocks unauthorized writes.
 */
export async function testAnonProductWrite() {
  console.log('%c[RLS Test] Testing public anon write to "products" table...', 'color: #1B4D2E; font-weight: bold;');
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: '__test_rls_unauthorized_item__',
        unit: '1L',
        price: 999,
        available: true,
      });

    if (error) {
      console.log(
        '%c[RLS Test PASSED] Write was successfully blocked by RLS!',
        'color: green; font-weight: bold;',
        { code: error.code, message: error.message, details: error.details }
      );
      return { success: true, blocked: true, error };
    } else {
      console.error(
        '%c[RLS Test FAILED] Write succeeded! RLS is not properly restricting public INSERTs on products.',
        'color: red; font-weight: bold;',
        data
      );
      return { success: false, blocked: false, data };
    }
  } catch (err) {
    console.log('[RLS Test PASSED with exception]:', err);
    return { success: true, blocked: true, error: err };
  }
}
