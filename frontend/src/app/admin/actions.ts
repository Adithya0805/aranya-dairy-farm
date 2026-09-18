'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient, verifyAdminUser } from '@/lib/supabaseServer';
import { PRODUCTS } from '@/lib/products';

export interface AdminProductPayload {
  id: string;
  price: number | null;
  available: boolean;
  featured?: boolean;
  category_id?: string | null;
  unit?: string | null;
  description?: string | null;
  stock?: number | null;
  low_stock_threshold?: number | null;
}

// ── Low-Stock Alert Helper ────────────────────────────────────────────────────

/**
 * Checks if a low-stock alert should be sent for the given product and,
 * if so, fires the alert (email via Resend if configured, plus server log)
 * and updates the last-alert timestamp in the database.
 *
 * Anti-spam: only fires once per product per 24 hours.
 */
async function checkAndSendLowStockAlert(opts: {
  productId: string;
  productName: string;
  stock: number;
  threshold: number;
  lastAlertAt: string | null;
}): Promise<void> {
  const { productId, productName, stock, threshold, lastAlertAt } = opts;

  // Only alert if stock is at or below threshold
  if (stock > threshold) return;

  // Anti-spam: skip if an alert was sent in the last 24 hours
  if (lastAlertAt) {
    const lastAlert = new Date(lastAlertAt).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - lastAlert < twentyFourHours) {
      console.info(`[LowStockAlert] Skipping alert for "${productName}" — already alerted within 24h.`);
      return;
    }
  }

  const alertMessage = `⚠️ LOW STOCK ALERT: "${productName}" is running low — ${stock} unit${stock === 1 ? '' : 's'} left. Please restock soon.`;

  // 1. Always log prominently to server console
  console.warn(`[LowStockAlert] ${alertMessage}`);

  // 2. Send email via Resend if configured
  const resendKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL || process.env.NEXT_PUBLIC_FARM_EMAIL;
  if (resendKey && alertEmail) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'alerts@aranyaorganicdairyfarm.com',
          to: [alertEmail],
          subject: `⚠️ Low Stock Alert: ${productName}`,
          text: `${alertMessage}\n\nLog in to your admin panel to update stock levels:\nhttps://aranyaorganicdairyfarm.com/admin/products`,
          html: `<p><strong>${alertMessage}</strong></p><p>Log in to your admin panel to update stock levels.</p>`,
        }),
      });
      if (response.ok) {
        console.info(`[LowStockAlert] Email alert sent to ${alertEmail} for "${productName}".`);
      } else {
        console.warn(`[LowStockAlert] Email send failed (${response.status}) for "${productName}".`);
      }
    } catch (emailErr) {
      console.warn('[LowStockAlert] Email send exception:', emailErr);
    }
  }

  // 3. Update the last-alert timestamp in the database
  try {
    const admin = getAdminClient();
    await admin
      .from('products')
      .update({ low_stock_alert_sent_at: new Date().toISOString() })
      .eq('id', productId);
  } catch (updateErr) {
    console.warn('[LowStockAlert] Failed to update last-alert timestamp:', updateErr);
  }
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
      .select('id, name, name_tamil, category_id, price, unit, image_url, available, featured, description, stock, low_stock_threshold, low_stock_alert_sent_at, created_at, categories(id, name)')
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
 * Resolves a human-readable category name to its storage subfolder.
 * e.g. "Rice & Millets" -> "rice-millets", "Dairy" -> "dairy"
 */
function getCategoryFolder(categoryName?: string | null): string {
  if (!categoryName) return 'general-store';
  const slug = categoryName
    .toLowerCase()
    .replace(/&/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  return slug || 'general-store';
}

/**
 * Extracts the storage file path from an existing image_url if stored in product-images bucket.
 */
function extractStoragePath(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  // Local static paths (e.g. /images/...) are not storage objects
  if (imageUrl.startsWith('/')) return null;

  if (imageUrl.includes('/product-images/')) {
    const parts = imageUrl.split('/product-images/');
    const pathWithQuery = parts[1] || null;
    return pathWithQuery ? pathWithQuery.split('?')[0] : null;
  }

  // Relative storage path like 'dairy/a2-desi-cow-milk.jpg'
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    return imageUrl.split('?')[0];
  }

  return null;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 4.2 * 1024 * 1024; // 4.2MB to stay within Vercel's 4.5MB Serverless Function request limit

function getExtension(file: File): string {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpg';
  const nameParts = file.name.split('.');
  if (nameParts.length > 1) {
    const ext = nameParts.pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  }
  return 'jpg';
}

/**
 * Server Action: Updates a product's price, availability status, category, unit, and description.
 * Uses the service_role key to bypass RLS safely on the server.
 */
export async function updateProductAction(payload: AdminProductPayload, token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const updateData: Record<string, unknown> = {
      price: payload.price,
      available: payload.available,
    };

    if (payload.category_id !== undefined) updateData.category_id = payload.category_id;
    if (payload.unit !== undefined) updateData.unit = payload.unit ? payload.unit.trim() : null;
    if (payload.description !== undefined) updateData.description = payload.description ? payload.description.trim() : null;
    if (payload.featured !== undefined) updateData.featured = Boolean(payload.featured);
    if (payload.stock !== undefined) updateData.stock = payload.stock;
    if (payload.low_stock_threshold !== undefined && payload.low_stock_threshold !== null) {
      updateData.low_stock_threshold = payload.low_stock_threshold;
    }

    const { error } = await admin
      .from('products')
      .update(updateData)
      .eq('id', payload.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate frontend storefront and admin caches safely
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    // Check for low-stock condition and send alert if warranted
    if (typeof payload.stock === 'number' && payload.stock !== null) {
      try {
        const { data: currentProduct } = await admin
          .from('products')
          .select('name, low_stock_threshold, low_stock_alert_sent_at')
          .eq('id', payload.id)
          .single();

        if (currentProduct) {
          const threshold =
            typeof payload.low_stock_threshold === 'number'
              ? payload.low_stock_threshold
              : (currentProduct.low_stock_threshold ?? 5);

          await checkAndSendLowStockAlert({
            productId: payload.id,
            productName: currentProduct.name,
            stock: payload.stock,
            threshold,
            lastAlertAt: currentProduct.low_stock_alert_sent_at,
          });
        }
      } catch (alertErr) {
        console.warn('[Admin] Low-stock alert check failed:', alertErr);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}



/**
 * Server Action: Updates a product's price, availability, category, unit, description, and optionally uploads a new image.
 * Uses service_role to upload to Supabase Storage and remove any old image in storage.
 */
export async function updateProductWithImageAction(formData: FormData) {
  const token = formData.get('token') as string | null;
  const auth = await verifyAdminUser(token || undefined);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  const id = formData.get('id') as string | null;
  if (!id) {
    return { success: false, error: 'Product ID is required.' };
  }

  const rawPrice = formData.get('price') as string | null;
  const rawAvailable = formData.get('available') as string | null;
  const rawFeatured = formData.get('featured') as string | null;
  const categoryName = formData.get('categoryName') as string | null;
  const categoryId = formData.get('categoryId') as string | null;
  const unit = formData.get('unit') as string | null;
  const description = formData.get('description') as string | null;
  const imageFile = formData.get('image') as File | null;
  const rawStock = formData.get('stock') as string | null;
  const rawThreshold = formData.get('low_stock_threshold') as string | null;

  let parsedPrice: number | null = null;
  if (rawPrice !== null && rawPrice !== undefined && rawPrice.trim() !== '') {
    const num = Number(rawPrice);
    if (isNaN(num) || num < 0) {
      return { success: false, error: 'Price must be a positive number or left blank.' };
    }
    parsedPrice = num;
  }

  let parsedStock: number | null = null;
  if (rawStock !== null && rawStock !== undefined && rawStock.trim() !== '') {
    const num = Math.floor(Number(rawStock));
    if (!isNaN(num) && num >= 0) {
      parsedStock = num;
    }
  }

  let parsedThreshold: number | null = null;
  if (rawThreshold !== null && rawThreshold !== undefined && rawThreshold.trim() !== '') {
    const num = Math.floor(Number(rawThreshold));
    if (!isNaN(num) && num >= 0) {
      parsedThreshold = num;
    }
  }

  const isAvailable = rawAvailable === 'true';

  try {
    const admin = getAdminClient();
    let newImageUrl: string | undefined = undefined;

    // Handle image upload if a new file was provided
    if (imageFile && typeof imageFile === 'object' && 'size' in imageFile && imageFile.size > 0) {
      const mimeType = (imageFile.type || '').toLowerCase();
      const ext = getExtension(imageFile);
      const isAllowedMime = ALLOWED_MIME_TYPES.includes(mimeType);
      const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

      if (!isAllowedMime && !isAllowedExt) {
        return {
          success: false,
          error: 'Invalid file format. Please upload a JPG, PNG, or WebP image.',
        };
      }

      if (imageFile.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Image file exceeds the 4.2MB limit. Please upload a smaller file.',
        };
      }

      const categoryFolder = getCategoryFolder(categoryName);
      const storagePath = `${categoryFolder}/${id}-${Date.now()}.${ext}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadContentType = mimeType || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

      const { error: uploadError } = await admin.storage
        .from('product-images')
        .upload(storagePath, buffer, {
          contentType: uploadContentType,
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          error: `Failed to upload image to storage: ${uploadError.message}`,
        };
      }

      const { data: publicUrlData } = admin.storage
        .from('product-images')
        .getPublicUrl(storagePath);

      newImageUrl = publicUrlData.publicUrl;

      // Clean up previous image in storage to avoid accumulating orphan files
      try {
        const { data: currentProduct } = await admin
          .from('products')
          .select('image_url')
          .eq('id', id)
          .single();

        const oldPath = extractStoragePath(currentProduct?.image_url);
        if (oldPath && oldPath !== storagePath) {
          await admin.storage.from('product-images').remove([oldPath]);
        }
      } catch (cleanupErr) {
        console.warn('[Admin Storage] Cleanup old image warning:', cleanupErr);
      }
    }

    // Build update payload
    const updatePayload: {
      price: number | null;
      available: boolean;
      featured?: boolean;
      image_url?: string;
      category_id?: string;
      unit?: string | null;
      description?: string | null;
      stock?: number | null;
      low_stock_threshold?: number;
    } = {
      price: parsedPrice,
      available: isAvailable,
    };

    if (rawFeatured !== null && rawFeatured !== undefined) {
      updatePayload.featured = rawFeatured === 'true';
    }

    if (categoryId && categoryId.trim() !== '') {
      updatePayload.category_id = categoryId.trim();
    }
    if (unit !== null && unit !== undefined) {
      updatePayload.unit = unit.trim() || null;
    }
    if (description !== null && description !== undefined) {
      updatePayload.description = description.trim() || null;
    }
    if (rawStock !== null && rawStock !== undefined) {
      updatePayload.stock = parsedStock;
    }
    if (parsedThreshold !== null) {
      updatePayload.low_stock_threshold = parsedThreshold;
    }

    if (newImageUrl) {
      updatePayload.image_url = newImageUrl;
    }

    const { error: updateError } = await admin
      .from('products')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Revalidate storefront and admin caches safely
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    // Check for low-stock condition and send alert if warranted
    if (typeof parsedStock === 'number') {
      try {
        const { data: productForAlert } = await admin
          .from('products')
          .select('name, low_stock_threshold, low_stock_alert_sent_at')
          .eq('id', id)
          .single();

        if (productForAlert) {
          const threshold = parsedThreshold ?? (productForAlert.low_stock_threshold ?? 5);
          await checkAndSendLowStockAlert({
            productId: id,
            productName: productForAlert.name,
            stock: parsedStock,
            threshold,
            lastAlertAt: productForAlert.low_stock_alert_sent_at,
          });
        }
      } catch (alertErr) {
        console.warn('[Admin] Low-stock alert check failed:', alertErr);
      }
    }

    return { success: true, imageUrl: newImageUrl };
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

/**
 * Server Action: Fetches all available categories for product creation/editing.
 */
export async function getAdminCategoriesAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', categories: [] };
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      return { success: false, error: error.message, categories: [] };
    }

    return { success: true, categories: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, categories: [] };
  }
}

/**
 * Server Action: Creates a new product with optional image upload in Supabase.
 */
export async function createProductAction(formData: FormData) {
  const token = formData.get('token') as string | null;
  const auth = await verifyAdminUser(token || undefined);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  const name = (formData.get('name') as string | null)?.trim();
  if (!name) {
    return { success: false, error: 'Product name is required.' };
  }

  const nameTamil = (formData.get('name_tamil') as string | null)?.trim() || null;
  const categoryId = (formData.get('category_id') as string | null)?.trim() || null;
  const categoryName = (formData.get('categoryName') as string | null)?.trim() || null;
  const unit = (formData.get('unit') as string | null)?.trim() || null;
  const description = (formData.get('description') as string | null)?.trim() || null;
  const rawPrice = formData.get('price') as string | null;
  const rawAvailable = formData.get('available') as string | null;
  const imageFile = formData.get('image') as File | null;

  let parsedPrice: number | null = null;
  if (rawPrice !== null && rawPrice !== undefined && rawPrice.trim() !== '') {
    const num = Number(rawPrice);
    if (isNaN(num) || num < 0) {
      return { success: false, error: 'Price must be a valid positive number.' };
    }
    parsedPrice = num;
  }

  const isAvailable = rawAvailable === 'true' || rawAvailable === 'on';

  try {
    const admin = getAdminClient();
    let imageUrl: string | null = null;

    // Handle Image Upload if provided
    if (imageFile && typeof imageFile === 'object' && 'size' in imageFile && imageFile.size > 0) {
      const mimeType = (imageFile.type || '').toLowerCase();
      const ext = getExtension(imageFile);
      const isAllowedMime = ALLOWED_MIME_TYPES.includes(mimeType);
      const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

      if (!isAllowedMime && !isAllowedExt) {
        return {
          success: false,
          error: 'Invalid file format. Please upload a JPG, PNG, or WebP image.',
        };
      }

      if (imageFile.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Image file exceeds the 4.2MB limit. Please upload a smaller file.',
        };
      }

      const categoryFolder = getCategoryFolder(categoryName);
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const storagePath = `${categoryFolder}/${slug}-${Date.now()}.${ext}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadContentType = mimeType || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

      const { error: uploadError } = await admin.storage
        .from('product-images')
        .upload(storagePath, buffer, {
          contentType: uploadContentType,
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: `Image upload failed: ${uploadError.message}` };
      }

      imageUrl = storagePath;
    }

    const { data: newProduct, error: insertError } = await admin
      .from('products')
      .insert({
        name,
        name_tamil: nameTamil,
        category_id: categoryId,
        price: parsedPrice,
        unit,
        image_url: imageUrl,
        available: isAvailable,
        description,
      })
      .select('id, name, name_tamil, category_id, price, unit, image_url, available, description, created_at, categories(id, name)')
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, product: newProduct };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Fast 1-click toggle for product storefront availability.
 */
export async function quickToggleAvailabilityAction(
  { id, available }: { id: string; available: boolean },
  token?: string
) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('products')
      .update({ available })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, available };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Fast 1-click update for product price.
 */
export async function quickUpdatePriceAction(
  { id, price }: { id: string; price: number | null },
  token?: string
) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('products')
      .update({ price })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, price };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Repairs and syncs all Tamil names in Supabase products table
 * using the verified single-source catalog dictionary from @/lib/products.
 */
export async function syncTamilNamesAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', updatedCount: 0 };
  }

  try {
    const admin = getAdminClient();
    let updatedCount = 0;

    for (const prod of PRODUCTS) {
      if (prod.nameTamil) {
        const { error } = await admin
          .from('products')
          .update({ name_tamil: prod.nameTamil })
          .ilike('name', prod.name);

        if (!error) {
          updatedCount++;
        }
      }
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/products');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, updatedCount };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, updatedCount: 0 };
  }
}

/**
 * Server Action: Deletes a specific order record from the database.
 */
export async function deleteOrderAction(orderId: string, token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/admin/orders');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, orderId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Purges all delivered orders to keep database clean and sustainable.
 */
export async function deleteDeliveredOrdersAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', count: 0 };
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('orders')
      .delete()
      .ilike('status', 'delivered')
      .select('id');

    if (error) {
      return { success: false, error: error.message, count: 0 };
    }

    try {
      revalidatePath('/admin/orders');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, count: data?.length || 0 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, count: 0 };
  }
}

/**
 * Server Action: Deletes a product and removes its associated storage image.
 */
export async function deleteProductAction(productId: string, token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();

    // Check for associated image in Supabase storage
    const { data: product } = await admin
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .single();

    if (product?.image_url) {
      const storagePath = extractStoragePath(product.image_url);
      if (storagePath) {
        try {
          await admin.storage.from('product-images').remove([storagePath]);
        } catch (stErr) {
          console.warn('[Admin] Could not remove product image from storage:', stErr);
        }
      }
    }

    const { error } = await admin
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/products');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true, productId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FARM VISIT REQUEST ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminVisitRequest {
  id: string;
  name: string;
  phone: string;
  preferred_date: string;
  time_slot: string;
  num_visitors: number;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'declined' | string;
  created_at: string;
}

/**
 * Server Action: Fetches all farm visit requests for the Admin portal,
 * sorted by soonest requested date first (preferred_date ASC).
 */
export async function getAdminVisitsAction(token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized', visits: [] };
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('farm_visit_requests')
      .select('id, name, phone, preferred_date, time_slot, num_visitors, notes, status, created_at')
      .order('preferred_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, visits: [] };
    }

    return { success: true, visits: (data || []) as AdminVisitRequest[] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, visits: [] };
  }
}

/**
 * Server Action: Updates a visit request status (e.g. 'pending', 'confirmed', 'declined').
 */
export async function updateVisitStatusAction(
  id: string,
  status: 'pending' | 'confirmed' | 'declined' | string,
  token?: string
) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('farm_visit_requests')
      .update({ status: status.toLowerCase() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/admin/visits');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Deletes a specific farm visit request.
 */
export async function deleteVisitAction(id: string, token?: string) {
  const auth = await verifyAdminUser(token);
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('farm_visit_requests')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      revalidatePath('/admin/visits');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

