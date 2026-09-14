'use server';

import { getAdminClient } from '@/lib/supabaseServer';

export interface OrderItemPayload {
  product_id: string;
  name: string;
  qty: number;
  price: number | null;
}

export interface SubmitOrderPayload {
  items: OrderItemPayload[];
  total: number | null;
  whatsapp_message: string;
}

export interface SubmitOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Server Action: Validates and logs customer orders into Supabase.
 * Enforces server-side data integrity before persisting.
 */
export async function submitOrderAction(payload: SubmitOrderPayload): Promise<SubmitOrderResult> {
  try {
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      return { success: false, error: 'Order must contain at least one item.' };
    }

    if (payload.items.length > 50) {
      return { success: false, error: 'Order exceeds maximum item limit (50 items).' };
    }

    const sanitizedItems: OrderItemPayload[] = [];
    let calculatedTotal = 0;
    let hasNullPrice = false;

    for (const item of payload.items) {
      if (!item.product_id || typeof item.product_id !== 'string') {
        return { success: false, error: 'Invalid product identifier in order item.' };
      }

      const name = String(item.name || '').trim().slice(0, 150);
      const qty = Math.floor(Number(item.qty) || 0);

      if (qty < 1 || qty > 99) {
        return { success: false, error: `Invalid quantity (${qty}) for item "${name}". Must be between 1 and 99.` };
      }

      const rawPrice = item.price;
      const price = rawPrice !== null && rawPrice !== undefined && !isNaN(Number(rawPrice))
        ? Math.max(0, Math.round(Number(rawPrice) * 100) / 100)
        : null;

      if (price === null) {
        hasNullPrice = true;
      } else {
        calculatedTotal += price * qty;
      }

      sanitizedItems.push({
        product_id: item.product_id,
        name,
        qty,
        price,
      });
    }

    const sanitizedMessage = String(payload.whatsapp_message || '')
      .trim()
      .slice(0, 5000);

    // If all items have null prices, total is null.
    // Otherwise, use server-calculated total rounded to 2 decimals.
    const finalTotal = hasNullPrice && calculatedTotal === 0
      ? null
      : Math.round(calculatedTotal * 100) / 100;

    const admin = getAdminClient();
    const { data, error } = await admin
      .from('orders')
      .insert({
        items: sanitizedItems,
        total: finalTotal,
        status: 'pending',
        whatsapp_message: sanitizedMessage,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[OrdersAction] Database insert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, orderId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[OrdersAction] Exception during order submission:', message);
    return { success: false, error: message };
  }
}
