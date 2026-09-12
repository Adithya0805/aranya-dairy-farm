'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient, verifyAdminUser } from '@/lib/supabaseServer';

export interface AdminProductPayload {
  id: string;
  price: number | null;
  available: boolean;
}

/**
 * Server Action: Fetches all 32 products for the Admin panel.
 */
export async function getAdminProductsAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', products: [] };
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('products')
      .select('id, name, name_tamil, category_id, price, unit, image_url, available, description, created_at, categories(id, name)')
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message, products: [] };
    }

    return { success: true, products: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, products: [] };
  }
}

/**
 * Server Action: Updates a product's price and availability status.
 * Uses the service_role key to bypass RLS safely on the server.
 */
export async function updateProductAction(payload: AdminProductPayload, token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('products')
      .update({
        price: payload.price,
        available: payload.available,
      })
      .eq('id', payload.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate frontend storefront and admin caches
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Fetches all customer orders for the Admin panel.
 * Orders table has public SELECT blocked by RLS, so this relies on service_role.
 */
export async function getAdminOrdersAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', orders: [] };
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, orders: [] };
    }

    return { success: true, orders: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, orders: [] };
  }
}

/**
 * Server Action: Updates an order's fulfillment status (pending/confirmed/delivered).
 */
export async function updateOrderStatusAction(
  { orderId, status }: { orderId: string; status: string },
  token?: string
) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
