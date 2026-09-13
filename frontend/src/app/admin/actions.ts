'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient, verifyAdminUser } from '@/lib/supabaseServer';
import { PRODUCTS } from '@/lib/products';

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

    // Revalidate frontend storefront and admin caches safely
    try {
      revalidatePath('/');
      revalidatePath('/admin/products');
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

    // Revalidate storefront and admin caches safely
    try {
      revalidatePath('/');
      revalidatePath('/admin/products');
    } catch (revErr) {
      console.warn('[Admin] revalidatePath warning:', revErr);
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
