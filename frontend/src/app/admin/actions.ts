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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function getExtension(file: File): string {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') return 'jpg';
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
 * Server Action: Updates a product's price, availability, and optionally uploads a new image.
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
  const categoryName = formData.get('categoryName') as string | null;
  const imageFile = formData.get('image') as File | null;

  let parsedPrice: number | null = null;
  if (rawPrice !== null && rawPrice !== undefined && rawPrice.trim() !== '') {
    const num = Number(rawPrice);
    if (isNaN(num) || num < 0) {
      return { success: false, error: 'Price must be a positive number or left blank.' };
    }
    parsedPrice = num;
  }

  const isAvailable = rawAvailable === 'true';

  try {
    const admin = getAdminClient();
    let newImageUrl: string | undefined = undefined;

    // Handle image upload if a new file was provided
    if (imageFile && typeof imageFile === 'object' && 'size' in imageFile && imageFile.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
        return {
          success: false,
          error: 'Invalid file format. Please upload a JPG, PNG, or WebP image.',
        };
      }

      if (imageFile.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'Image file exceeds the 5MB limit. Please upload a smaller file.',
        };
      }

      const categoryFolder = getCategoryFolder(categoryName);
      const ext = getExtension(imageFile);
      const storagePath = `${categoryFolder}/${id}-${Date.now()}.${ext}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await admin.storage
        .from('product-images')
        .upload(storagePath, buffer, {
          contentType: imageFile.type,
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
      const { data: currentProduct } = await admin
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      const oldPath = extractStoragePath(currentProduct?.image_url);
      if (oldPath && oldPath !== storagePath) {
        await admin.storage.from('product-images').remove([oldPath]);
      }
    }

    // Build update payload
    const updatePayload: {
      price: number | null;
      available: boolean;
      image_url?: string;
    } = {
      price: parsedPrice,
      available: isAvailable,
    };

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

    // Revalidate storefront and admin caches
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');

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
