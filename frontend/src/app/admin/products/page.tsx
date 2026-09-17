'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  Sparkles,
  Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getAdminProductsAction,
  updateProductAction,
  updateProductWithImageAction,
  createProductAction,
  quickUpdatePriceAction,
  syncTamilNamesAction,
  getAdminCategoriesAction,
  deleteProductAction,
} from '@/app/admin/actions';
import { resolveProductImageUrl } from '@/lib/catalog';
import { PRODUCTS } from '@/lib/products';

function getResolvedTamilName(product: { id?: string; name: string; name_tamil?: string | null }): string | null {
  if (product.name_tamil && !product.name_tamil.includes('?')) {
    return product.name_tamil;
  }
  const matched = PRODUCTS.find(
    (x) => x.id === product.id || x.name.toLowerCase() === product.name.toLowerCase()
  );
  if (matched?.nameTamil) {
    return matched.nameTamil;
  }
  return product.name_tamil && !product.name_tamil.includes('?') ? product.name_tamil : null;
}

interface AdminProduct {
  id: string;
  name: string;
  name_tamil: string | null;
  category_id: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  available: boolean;
  featured?: boolean;
  description: string | null;
  stock?: number | null;
  low_stock_threshold?: number | null;
  low_stock_alert_sent_at?: string | null;
  categories?: {
    id: string;
    name: string;
  } | null;
}


export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [metricFilter, setMetricFilter] = useState<'all' | 'live' | 'hidden' | 'price_pending'>('all');

  // Inline Price Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<string>('');
  const [inlineSaving, setInlineSaving] = useState(false);

  // Sync Tamil state
  const [syncingTamil, setSyncingTamil] = useState(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addNameTamil, setAddNameTamil] = useState('');
  const [addCategoryId, setAddCategoryId] = useState('');
  const [addCategoryName, setAddCategoryName] = useState('');
  const [addUnit, setAddUnit] = useState('500g');
  const [addPrice, setAddPrice] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addAvailable, setAddAvailable] = useState(true);
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addImageError, setAddImageError] = useState<string | null>(null);
  const [isAddDragging, setIsAddDragging] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editAvailable, setEditAvailable] = useState<boolean>(true);
  const [editFeatured, setEditFeatured] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<string>('');
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [editThreshold, setEditThreshold] = useState<string>('5');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


  // User feedback toast/alert
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await getAdminProductsAction(token);

      if (res.success && res.products) {
        setProducts(res.products as AdminProduct[]);
      } else {
        // Fallback: public select is allowed by RLS on products table
        const { data, error } = await supabase
          .from('products')
          .select('id, name, name_tamil, category_id, price, unit, image_url, available, featured, description, stock, low_stock_threshold, low_stock_alert_sent_at, created_at, categories(id, name)')
          .order('created_at', { ascending: true });

        if (!error && data) {
          setProducts(data as unknown as AdminProduct[]);
        } else if (res.error) {
          setFeedback({ type: 'error', message: res.error });
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching products';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load categories initially for dropdowns
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await getAdminCategoriesAction(session?.access_token);
        if (res.success && res.categories && res.categories.length > 0) {
          setAvailableCategories(res.categories);
        } else {
          // Fallback: load distinct categories from public categories table
          const { data } = await supabase
            .from('categories')
            .select('id, name')
            .order('name', { ascending: true });
          if (data && data.length > 0) {
            setAvailableCategories(data);
          }
        }
      } catch (err) {
        console.warn('Could not preload categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Sync available categories from loaded products if categories query returned empty
  useEffect(() => {
    if (products.length > 0 && availableCategories.length === 0) {
      const extracted: { id: string; name: string }[] = [];
      const seen = new Set<string>();
      for (const p of products) {
        if (p.categories?.id && p.categories?.name && !seen.has(p.categories.id)) {
          seen.add(p.categories.id);
          extracted.push({ id: p.categories.id, name: p.categories.name });
        }
      }
      if (extracted.length > 0) {
        setAvailableCategories(extracted);
      }
    }
  }, [products, availableCategories.length]);

  // Close Edit Form and clean up object URLs
  const handleCloseModal = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setEditingProduct(null);
    setEditPrice('');
    setEditAvailable(true);
    setEditCategoryId('');
    setEditCategoryName('');
    setEditUnit('');
    setEditDescription('');
    setEditStock('');
    setEditThreshold('5');
    setNewImageFile(null);
    setNewImagePreview(null);
    setImageError(null);
    setIsDragging(false);
  };

  // Open Edit Form
  const handleOpenEdit = (product: AdminProduct) => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setEditingProduct(product);
    setEditPrice(product.price !== null && product.price !== undefined ? String(product.price) : '');
    setEditAvailable(Boolean(product.available));
    setEditFeatured(Boolean(product.featured));
    const catId = product.category_id || product.categories?.id || '';
    const catName = product.categories?.name || '';
    setEditCategoryId(catId);
    setEditCategoryName(catName);
    setEditUnit(product.unit || '');
    setEditDescription(product.description || '');
    setEditStock(product.stock !== null && product.stock !== undefined ? String(product.stock) : '');
    setEditThreshold(product.low_stock_threshold !== null && product.low_stock_threshold !== undefined ? String(product.low_stock_threshold) : '5');

    // Ensure current product's category exists in availableCategories
    if (catId && catName && !availableCategories.some((c) => c.id === catId)) {
      setAvailableCategories((prev) => [...prev, { id: catId, name: catName }]);
    }

    setNewImageFile(null);
    setNewImagePreview(null);
    setImageError(null);
    setIsDragging(false);
    setFeedback(null);
  };


  // Validate and stage newly selected image file for Edit
  const handleFileValidationAndSelect = (file: File) => {
    setImageError(null);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isAllowedMime = allowedTypes.includes((file.type || '').toLowerCase());

    if (!isAllowedMime && !isAllowedExt) {
      setImageError('Unsupported format. Please select a JPG, PNG, or WebP image.');
      return;
    }
    const MAX_ALLOWED_BYTES = 4.2 * 1024 * 1024;
    if (file.size > MAX_ALLOWED_BYTES) {
      setImageError(
        `Image size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is 4MB. Please choose a smaller image.`
      );
      return;
    }
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  // Revert newly selected file back to existing photo
  const handleClearNewImage = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setNewImageFile(null);
    setNewImagePreview(null);
    setImageError(null);
  };

  // Drag and drop handlers for Edit
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidationAndSelect(e.dataTransfer.files[0]);
    }
  };

  // Save changes via Server Action (supporting both price/stock and image uploads)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setFeedback(null);
    setImageError(null);

    const parsedPrice = editPrice.trim() === '' ? null : Number(editPrice);
    if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice < 0)) {
      setFeedback({ type: 'error', message: 'Price must be a positive number or left blank.' });
      setSaving(false);
      return;
    }

    const parsedStock = editStock.trim() === '' ? null : Math.floor(Number(editStock));
    const parsedThreshold = editThreshold.trim() === '' ? 5 : Math.floor(Number(editThreshold));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append('id', editingProduct.id);
      formData.append('price', editPrice);
      formData.append('available', String(editAvailable));
      formData.append('featured', String(editFeatured));
      if (editCategoryId) {
        formData.append('categoryId', editCategoryId);
      }
      formData.append(
        'categoryName',
        editCategoryName || editingProduct.categories?.name || 'General Store'
      );
      formData.append('unit', editUnit);
      formData.append('description', editDescription);
      formData.append('stock', editStock);
      formData.append('low_stock_threshold', String(parsedThreshold));
      if (token) formData.append('token', token);
      if (newImageFile) formData.append('image', newImageFile);

      const res = await updateProductWithImageAction(formData);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.imageUrl
            ? `Successfully updated "${editingProduct.name}" and uploaded new photo!`
            : `Successfully updated "${editingProduct.name}"!`,
        });

        const matchedCat = editCategoryId
          ? availableCategories.find((c) => c.id === editCategoryId)
          : null;
        const finalCategoryObj = matchedCat
          ? { id: matchedCat.id, name: matchedCat.name }
          : editingProduct.categories;

        // Update local state immediately
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  price: parsedPrice,
                  available: editAvailable,
                  featured: editFeatured,
                  category_id: editCategoryId || p.category_id,
                  unit: editUnit.trim() || p.unit,
                  description: editDescription.trim() || null,
                  categories: finalCategoryObj,
                  image_url: res.imageUrl || p.image_url,
                  stock: parsedStock,
                  low_stock_threshold: parsedThreshold,
                }
              : p
          )
        );

        handleCloseModal();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update product. Please check server configuration and try again.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes('441') ||
        message.includes('Server Components render') ||
        message.includes('Body exceeded') ||
        message.includes('413')
      ) {
        setFeedback({
          type: 'error',
          message: 'Upload could not be processed. The selected image may exceed server limits (max 4MB). Please select an image under 4MB.',
        });
      } else {
        setFeedback({ type: 'error', message });
      }
    } finally {
      setSaving(false);
    }
  };


  // Delete product and free up storage
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? Any uploaded photos for it in storage will also be deleted to free up space.')) {
      return;
    }
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await deleteProductAction(productId, session?.access_token);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        handleCloseModal();
        setFeedback({ type: 'success', message: 'Product and associated files deleted successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete product.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Error deleting product.' });
    } finally {
      setDeleting(false);
    }
  };

  // Quick inline toggle for availability
  const handleQuickToggleAvailable = async (product: AdminProduct) => {
    const newAvailable = !product.available;

    // Optimistically update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, available: newAvailable } : p))
    );

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await updateProductAction(
        {
          id: product.id,
          price: product.price,
          available: newAvailable,
        },
        token
      );

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `"${product.name}" is now ${newAvailable ? 'Visible on storefront' : 'Hidden from storefront'}.`,
        });
      } else {
        // Revert on error
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, available: !newAvailable } : p))
        );
        setFeedback({ type: 'error', message: res.error || 'Failed to toggle availability.' });
      }
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, available: !newAvailable } : p))
      );
      setFeedback({ type: 'error', message: 'Failed to update availability.' });
    }
  };

  // Inline Price editing
  const handleStartInlinePrice = (product: AdminProduct) => {
    setInlineEditingId(product.id);
    setInlinePriceVal(product.price !== null && product.price !== undefined ? String(product.price) : '');
  };

  const handleSaveInlinePrice = async (productId: string) => {
    const val = inlinePriceVal.trim();
    let parsed: number | null = null;
    if (val !== '') {
      const num = Number(val);
      if (isNaN(num) || num < 0) {
        setFeedback({ type: 'error', message: 'Price must be a valid positive number or left blank.' });
        return;
      }
      parsed = num;
    }

    setInlineSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await quickUpdatePriceAction({ id: productId, price: parsed }, session?.access_token);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, price: parsed } : p))
        );
        setInlineEditingId(null);
        setFeedback({
          type: 'success',
          message: parsed !== null ? `Price updated to ₹${parsed.toFixed(2)}.` : 'Price marked as updating soon.',
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update price.' });
      }
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update price' });
    } finally {
      setInlineSaving(false);
    }
  };

  // Sync Tamil Names
  const handleSyncTamil = async () => {
    setSyncingTamil(true);
    setFeedback(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await syncTamilNamesAction(session?.access_token);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Successfully updated and repaired ${res.updatedCount} Tamil product names in Supabase!`,
        });
        await fetchProducts();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to sync Tamil names.',
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error syncing Tamil names',
      });
    } finally {
      setSyncingTamil(false);
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = async () => {
    if (availableCategories.length === 0) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await getAdminCategoriesAction(session?.access_token);
        if (res.success && res.categories && res.categories.length > 0) {
          setAvailableCategories(res.categories);
          setAddCategoryId(res.categories[0].id);
          setAddCategoryName(res.categories[0].name);
        }
      } catch (err) {
        console.warn('Could not fetch categories for add modal:', err);
      }
    } else {
      setAddCategoryId(availableCategories[0].id);
      setAddCategoryName(availableCategories[0].name);
    }

    setAddName('');
    setAddNameTamil('');
    setAddUnit('500g');
    setAddPrice('');
    setAddDescription('');
    setAddAvailable(true);
    setAddImageFile(null);
    if (addImagePreview) {
      URL.revokeObjectURL(addImagePreview);
    }
    setAddImagePreview(null);
    setAddImageError(null);
    setIsAddModalOpen(true);
  };

  // Close Add Product Modal
  const handleCloseAddModal = () => {
    if (addImagePreview) {
      URL.revokeObjectURL(addImagePreview);
    }
    setIsAddModalOpen(false);
    setAddImageFile(null);
    setAddImagePreview(null);
    setAddImageError(null);
  };

  const handleAddFileValidationAndSelect = (file: File) => {
    setAddImageError(null);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isAllowedMime = allowedTypes.includes((file.type || '').toLowerCase());

    if (!isAllowedMime && !isAllowedExt) {
      setAddImageError('Unsupported format. Please select a JPG, PNG, or WebP image.');
      return;
    }
    const MAX_ALLOWED_BYTES = 4.2 * 1024 * 1024;
    if (file.size > MAX_ALLOWED_BYTES) {
      setAddImageError(
        `Image size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is 4MB.`
      );
      return;
    }
    if (addImagePreview) {
      URL.revokeObjectURL(addImagePreview);
    }
    setAddImageFile(file);
    setAddImagePreview(URL.createObjectURL(file));
  };

  const handleClearAddImage = () => {
    if (addImagePreview) {
      URL.revokeObjectURL(addImagePreview);
    }
    setAddImageFile(null);
    setAddImagePreview(null);
    setAddImageError(null);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      setFeedback({ type: 'error', message: 'Product name is required.' });
      return;
    }
    if (!addCategoryId) {
      setFeedback({ type: 'error', message: 'Please select a product category.' });
      return;
    }

    setAddSaving(true);
    setFeedback(null);
    setAddImageError(null);

    const parsedPrice = addPrice.trim() === '' ? null : Number(addPrice);
    if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice < 0)) {
      setFeedback({ type: 'error', message: 'Price must be a positive number or left blank.' });
      setAddSaving(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append('name', addName.trim());
      formData.append('name_tamil', addNameTamil.trim());
      formData.append('category_id', addCategoryId);
      formData.append('categoryName', addCategoryName || 'General Store');
      formData.append('unit', addUnit.trim());
      formData.append('price', addPrice.trim());
      formData.append('description', addDescription.trim());
      formData.append('available', String(addAvailable));
      if (token) formData.append('token', token);
      if (addImageFile) formData.append('image', addImageFile);

      const res = await createProductAction(formData);

      if (res.success && res.product) {
        setFeedback({
          type: 'success',
          message: `Successfully created new product "${addName}"!`,
        });
        handleCloseAddModal();
        await fetchProducts();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to create product.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setFeedback({ type: 'error', message });
    } finally {
      setAddSaving(false);
    }
  };

  // Extract unique categories
  const categoriesList = Array.from(
    new Set(products.map((p) => p.categories?.name || 'Uncategorized'))
  ).sort();

  // Filter products by search, category, and metric filter
  const filteredProducts = products.filter((p) => {
    const resolvedTamil = getResolvedTamilName(p) || '';
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      resolvedTamil.toLowerCase().includes(search.toLowerCase());

    const categoryName = p.categories?.name || 'Uncategorized';
    const matchesCat = categoryFilter === 'All' || categoryName === categoryFilter;

    let matchesMetric = true;
    if (metricFilter === 'live') matchesMetric = p.available;
    else if (metricFilter === 'hidden') matchesMetric = !p.available;
    else if (metricFilter === 'price_pending') matchesMetric = p.price === null || p.price === undefined;

    return matchesSearch && matchesCat && matchesMetric;
  });

  const availableCount = products.filter((p) => p.available).length;
  const hiddenCount = products.filter((p) => !p.available).length;
  const pricePendingCount = products.filter((p) => p.price === null || p.price === undefined).length;

  return (
    <div className="space-y-6">
      {/* Header Summary & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] mt-1 font-sans">
            Add new products, adjust pricing, upload images, and control storefront availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={handleSyncTamil}
            disabled={syncingTamil}
            title="Repair and sync verified Tamil names from product dictionary"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#1B4D2E]/25 bg-white text-xs font-semibold uppercase tracking-wider text-[#1B4D2E] hover:bg-[#F2ECE7] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syncingTamil ? 'animate-spin' : 'text-[#E58A13]'}`} />
            <span>{syncingTamil ? 'Syncing...' : 'Sync Tamil Names'}</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchProducts();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#1B4D2E]/20 bg-white text-xs font-semibold uppercase tracking-wider text-[#1C241E] hover:bg-[#F2ECE7] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Chips - Clickable to filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setMetricFilter('all')}
          className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
            metricFilter === 'all'
              ? 'bg-white border-[#1B4D2E] shadow-sm ring-2 ring-[#1B4D2E]/20'
              : 'bg-white border-[#1B4D2E]/10 hover:border-[#1B4D2E]/30 shadow-xs'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider text-[#8A7B6E] font-bold block">
            Total Catalog
          </span>
          <span className="text-2xl font-serif font-bold text-[#1C241E] mt-0.5 block">
            {products.length}
          </span>
          <span className="text-[10px] text-[#57655B] mt-1 block">Click to view all</span>
        </button>

        <button
          type="button"
          onClick={() => setMetricFilter('live')}
          className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
            metricFilter === 'live'
              ? 'bg-emerald-50/50 border-[#1B4D2E] shadow-sm ring-2 ring-[#1B4D2E]/20'
              : 'bg-white border-[#1B4D2E]/10 hover:border-[#1B4D2E]/30 shadow-xs'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider text-[#1B4D2E] font-bold block">
            Live on Store
          </span>
          <span className="text-2xl font-serif font-bold text-[#1B4D2E] mt-0.5 block">
            {availableCount}
          </span>
          <span className="text-[10px] text-[#1B4D2E]/80 mt-1 block">Click to filter live</span>
        </button>

        <button
          type="button"
          onClick={() => setMetricFilter('hidden')}
          className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
            metricFilter === 'hidden'
              ? 'bg-amber-50/50 border-amber-600 shadow-sm ring-2 ring-amber-600/20'
              : 'bg-white border-[#1B4D2E]/10 hover:border-[#1B4D2E]/30 shadow-xs'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider text-[#8A7B6E] font-bold block">
            Hidden (Pending)
          </span>
          <span className="text-2xl font-serif font-bold text-[#8A7B6E] mt-0.5 block">
            {hiddenCount}
          </span>
          <span className="text-[10px] text-[#8A7B6E] mt-1 block">Click to filter hidden</span>
        </button>

        <button
          type="button"
          onClick={() => setMetricFilter('price_pending')}
          className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
            metricFilter === 'price_pending'
              ? 'bg-amber-50/50 border-[#6B472B] shadow-sm ring-2 ring-[#6B472B]/20'
              : 'bg-white border-[#1B4D2E]/10 hover:border-[#1B4D2E]/30 shadow-xs'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider text-[#6B472B] font-bold block">
            Price Pending
          </span>
          <span className="text-2xl font-serif font-bold text-[#6B472B] mt-0.5 block">
            {pricePendingCount}
          </span>
          <span className="text-[10px] text-[#6B472B]/80 mt-1 block">Click to filter unpriced</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-md border flex items-center justify-between gap-3 text-sm font-sans ${
            feedback.type === 'success'
              ? 'bg-[#E8F5EE] border-[#1B4D2E]/20 text-[#1B4D2E]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#1B4D2E] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-current hover:opacity-70 cursor-pointer p-1"
            aria-label="Dismiss feedback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A7B6E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or Tamil name..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/15 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B4D2E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FCFAF7] border border-[#1B4D2E]/15 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B4D2E] text-[#1C241E] cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {metricFilter !== 'all' && (
            <button
              onClick={() => setMetricFilter('all')}
              className="px-2.5 py-2 text-xs font-semibold text-[#8A7B6E] hover:text-[#1C241E] border border-dashed border-[#1B4D2E]/20 rounded-md bg-white cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-[#1B4D2E]/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#1B4D2E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase font-bold tracking-wider text-[#57655B]">
              Loading product catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-[#57655B] text-sm">
            No products match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFAF7] border-b border-[#1B4D2E]/10 text-[11px] uppercase tracking-wider font-bold text-[#57655B]">
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Storefront</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4D2E]/8 text-sm">
                {filteredProducts.map((p) => {
                  const hasPrice = p.price !== null && p.price !== undefined;
                  const isPendingRice = !p.available && p.categories?.name === 'Rice & Millets';
                  const resolvedTamil = getResolvedTamilName(p);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FAF8F5] transition-colors group"
                    >
                      {/* Name & Thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-[#F4EFEA] border border-[#1B4D2E]/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveProductImageUrl(p.image_url)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.src.endsWith('/images/placeholder-product.svg')) {
                                  target.src = '/images/placeholder-product.svg';
                                }
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-serif font-bold text-[#1C241E] flex items-center gap-1.5 flex-wrap">
                              {p.name}
                              {typeof p.stock === 'number' && p.stock !== null && p.stock <= (p.low_stock_threshold ?? 5) && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-red-100 text-red-700 border border-red-200 shrink-0">
                                  ⚠️ Low Stock ({p.stock})
                                </span>
                              )}
                            </div>
                            {resolvedTamil && (
                              <div className="text-xs text-[#1B4D2E] font-medium font-sans">
                                {resolvedTamil}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>


                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F2ECE7] text-[#57655B]">
                          {p.categories?.name || 'General Store'}
                        </span>
                      </td>

                      {/* Unit */}
                      <td className="py-3.5 px-4 text-xs text-[#57655B] font-mono">
                        {p.unit || '—'}
                      </td>

                      {/* Price with 1-click inline editing */}
                      <td className="py-3.5 px-4 font-sans">
                        {inlineEditingId === p.id ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="font-bold text-[#1C241E] text-sm">₹</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={inlinePriceVal}
                              onChange={(e) => setInlinePriceVal(e.target.value)}
                              placeholder="Price"
                              className="w-20 px-2 py-1 text-xs bg-white border border-[#1B4D2E] rounded font-mono focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlinePrice(p.id);
                                if (e.key === 'Escape') setInlineEditingId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveInlinePrice(p.id)}
                              disabled={inlineSaving}
                              className="p-1 bg-[#1B4D2E] text-white rounded hover:bg-[#143B23] cursor-pointer"
                              title="Save Price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlineEditingId(null)}
                              className="p-1 text-[#8A7B6E] hover:text-[#1C241E] cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : hasPrice ? (
                          <div
                            onClick={() => handleStartInlinePrice(p)}
                            className="group/price inline-flex items-center gap-1.5 cursor-pointer py-1 px-1.5 -ml-1.5 rounded hover:bg-[#F2ECE7]/70 transition-colors"
                            title="Click to edit price directly"
                          >
                            <span className="font-bold text-[#1C241E]">
                              ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <Edit2 className="w-3 h-3 text-[#8A7B6E] opacity-0 group-hover/price:opacity-100 transition-opacity" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartInlinePrice(p)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B472B] bg-[#F2ECE7] hover:bg-[#ebdcd1] px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="Click to set price"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B472B]/60 animate-pulse" />
                            <span>Set Price</span>
                            <Edit2 className="w-2.5 h-2.5 ml-0.5 text-[#6B472B]" />
                          </button>
                        )}
                      </td>

                      {/* Storefront Available Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleQuickToggleAvailable(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            p.available
                              ? 'bg-[#E8F5EE] text-[#1B4D2E] hover:bg-[#d8eedf]'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={`Click to ${p.available ? 'hide from' : 'show on'} storefront`}
                        >
                          {p.available ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                        {isPendingRice && (
                          <span className="block text-[10px] text-[#8A7B6E] mt-0.5">
                            Rice item
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1B4D2E]/25 hover:border-[#1B4D2E] hover:bg-[#1B4D2E] hover:text-white text-xs font-bold uppercase tracking-wider text-[#1B4D2E] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-[#1B4D2E]/15 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1B4D2E]/10 flex items-center justify-between bg-[#FCFAF7] shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1B4D2E]" />
                <h3 className="font-serif font-bold text-lg text-[#1C241E]">
                  Add New Product
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57655B] hover:bg-[#1B4D2E]/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Product Name (English) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Pure Desi Buffalo Milk"
                  className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                />
              </div>

              {/* Product Name (Tamil) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Tamil Name (தமிழ்)
                </label>
                <input
                  type="text"
                  value={addNameTamil}
                  onChange={(e) => setAddNameTamil(e.target.value)}
                  placeholder="e.g. எருமைப் பால்"
                  className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                />
              </div>

              {/* Category & Unit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                    Category *
                  </label>
                  <select
                    required
                    value={addCategoryId}
                    onChange={(e) => {
                      setAddCategoryId(e.target.value);
                      const cat = availableCategories.find((c) => c.id === e.target.value);
                      if (cat) setAddCategoryName(cat.name);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E] cursor-pointer"
                  >
                    {availableCategories.length === 0 ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      availableCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                    Packaging / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={addUnit}
                    onChange={(e) => setAddUnit(e.target.value)}
                    placeholder="e.g. 1 Litre, 500g, 1kg"
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Price in ₹ (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#8A7B6E]">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                    placeholder="Leave empty for 'Price updating soon'"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                  />
                </div>
                <p className="text-[11px] text-[#8A7B6E] mt-1">
                  Optional. Leave blank if pricing is seasonal or confirmed via WhatsApp.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="Optional details, benefits, or preparation methods..."
                  className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                />
              </div>

              {/* Product Photo Upload Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Product Photo
                </label>

                {addImagePreview ? (
                  <div className="flex items-center gap-3.5 p-3 bg-[#FCFAF7] border border-[#1B4D2E]/15 rounded-md mb-2">
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-[#F4EFEA] border border-[#1B4D2E]/15 shrink-0 relative flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={addImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4D2E]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E] shrink-0" />
                        <span>Photo Selected</span>
                      </div>
                      <p className="text-[11px] text-[#57655B] truncate mt-0.5 font-mono">
                        {addImageFile?.name} ({(addImageFile ? (addImageFile.size / 1024).toFixed(1) : 0)} KB)
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAddImage}
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#B84A28] hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsAddDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsAddDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsAddDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleAddFileValidationAndSelect(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-md p-3 text-center transition-colors ${
                      isAddDragging
                        ? 'border-[#1B4D2E] bg-[#E8F5EE]/40'
                        : 'border-[#1B4D2E]/20 hover:border-[#1B4D2E]/40 bg-[#FAF8F5]'
                    }`}
                  >
                    <input
                      type="file"
                      id="admin-add-product-image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAddFileValidationAndSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-add-product-image"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white border border-[#1B4D2E]/20 text-xs font-bold text-[#1B4D2E] hover:bg-[#F2ECE7] cursor-pointer shadow-2xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Photo from Device</span>
                    </label>
                    <p className="text-[11px] text-[#8A7B6E] mt-1">
                      JPG, PNG, WebP up to 4MB &bull; 1:1 square recommended
                    </p>
                  </div>
                )}

                {addImageError && (
                  <p className="text-[11px] text-[#B84A28] font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addImageError}</span>
                  </p>
                )}
              </div>

              {/* Storefront Visibility */}
              <div>
                <label className="flex items-center gap-3 p-3 border border-[#1B4D2E]/15 rounded-md cursor-pointer hover:bg-[#FCFAF7] transition-colors">
                  <input
                    type="checkbox"
                    checked={addAvailable}
                    onChange={(e) => setAddAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#1B4D2E] rounded focus:ring-[#1B4D2E] cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1C241E] block">
                      Make available on storefront immediately
                    </span>
                    <span className="text-[11px] text-[#57655B] block">
                      {addAvailable
                        ? 'Product will be visible on the public catalog.'
                        : 'Product will be saved as hidden/draft.'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  disabled={addSaving}
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-[#57655B] hover:bg-[#F2ECE7] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addSaving}
                  className="px-5 py-2.5 rounded bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {addSaving ? 'Creating Product...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-[#1B4D2E]/15 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1B4D2E]/10 flex items-center justify-between bg-[#FCFAF7] shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C241E]">
                  Edit Product
                </h3>
                <p className="text-xs text-[#57655B] font-sans">
                  {editingProduct.name}{' '}
                  {getResolvedTamilName(editingProduct) ? `(${getResolvedTamilName(editingProduct)})` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57655B] hover:bg-[#1B4D2E]/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Category & Unit Size Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                    Category *
                  </label>
                  <select
                    required
                    value={editCategoryId}
                    onChange={(e) => {
                      setEditCategoryId(e.target.value);
                      const cat = availableCategories.find((c) => c.id === e.target.value);
                      if (cat) setEditCategoryName(cat.name);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E] cursor-pointer"
                  >
                    {availableCategories.length === 0 ? (
                      <option value="">
                        {editingProduct.categories?.name || 'General Store'}
                      </option>
                    ) : (
                      availableCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                    Packaging / Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="e.g. 1 Litre, 500g, 1kg"
                    className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E]">
                    Product Description
                  </label>
                  <span className="text-[11px] text-[#8A7B6E] font-medium">Optional</span>
                </div>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter product description, benefits, or preparation details (optional)..."
                  className="w-full px-3 py-2 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E] placeholder:text-[#8A7B6E]/70 leading-relaxed"
                />
                <p className="text-[11px] text-[#8A7B6E] mt-1">
                  Optional. Displayed in customer product details &amp; quick-view modals across the website.
                </p>
              </div>

              {/* ── Stock Tracking ────────────────────────────────────── */}
              <div className="border border-[#1B4D2E]/10 rounded-md p-4 bg-[#F5F9F6] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1B4D2E]/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#1B4D2E]">📦</span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C241E]">
                    Stock Tracking &amp; Low-Stock Alert
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Current Stock */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#57655B] mb-1">
                      Current Stock (units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                    />
                  </div>

                  {/* Low Stock Threshold */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#57655B] mb-1">
                      Alert Threshold
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={editThreshold}
                      onChange={(e) => setEditThreshold(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                    />
                  </div>
                </div>

                {/* Low-stock warning badge */}
                {editStock !== '' && !isNaN(Number(editStock)) && Number(editStock) <= (Number(editThreshold) || 5) && Number(editStock) >= 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <span className="text-sm">⚠️</span>
                    <p className="text-xs font-semibold text-red-700">
                      Low stock! This product is at or below the alert threshold. An alert will be sent when saved.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-[#8A7B6E]">
                  Leave stock blank if not tracking. An alert fires once per product per 24 hours when stock ≤ threshold.
                </p>
              </div>

              {/* Product Photo Upload Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-2">
                  Product Photo
                </label>

                {/* Current / New Image Preview Container */}
                <div className="flex items-center gap-3.5 p-3.5 bg-[#FCFAF7] border border-[#1B4D2E]/15 rounded-md mb-2.5">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-[#F4EFEA] border border-[#1B4D2E]/15 shrink-0 relative flex items-center justify-center shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={newImagePreview || resolveProductImageUrl(editingProduct.image_url)}
                      alt={editingProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/images/placeholder-product.svg')) {
                          target.src = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {newImagePreview ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4D2E]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E] shrink-0" />
                          <span>New Photo Selected</span>
                        </div>
                        <p className="text-[11px] text-[#57655B] truncate mt-0.5 font-mono">
                          {newImageFile?.name} ({(newImageFile ? (newImageFile.size / 1024).toFixed(1) : 0)} KB)
                        </p>
                        <button
                          type="button"
                          onClick={handleClearNewImage}
                          className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#B84A28] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Revert / Keep existing</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-semibold text-[#1C241E] flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#8A7B6E]" />
                          <span>{editingProduct.image_url ? 'Current Product Photo' : 'No photo uploaded'}</span>
                        </div>
                        <p className="text-[11px] text-[#8A7B6E] mt-0.5 leading-snug">
                          {editingProduct.image_url
                            ? 'Custom photo currently displayed on customer storefront.'
                            : 'Default placeholder image is currently shown.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropzone & File Input */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-md p-3.5 text-center transition-colors ${
                    isDragging
                      ? 'border-[#1B4D2E] bg-[#E8F5EE]/40'
                      : 'border-[#1B4D2E]/20 hover:border-[#1B4D2E]/40 bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    type="file"
                    id="admin-product-image-file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileValidationAndSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-product-image-file"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white border border-[#1B4D2E]/20 text-xs font-bold text-[#1B4D2E] hover:bg-[#F2ECE7] cursor-pointer shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{newImageFile ? 'Change Photo Selection' : 'Select Photo from Device'}</span>
                  </label>
                  <p className="text-[11px] text-[#8A7B6E] mt-1.5">
                    or drag & drop file here &bull; JPG, PNG, WebP up to 4MB
                  </p>
                  <p className="text-[11px] text-[#1B4D2E] font-medium mt-1">
                    Best fit: 1:1 square photo (e.g. 800×800 px or 1000×1000 px) with product centered.
                  </p>
                </div>

                {/* Validation Error */}
                {imageError && (
                  <p className="text-[11px] text-[#B84A28] font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{imageError}</span>
                  </p>
                )}
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1.5">
                  Price in ₹ (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#8A7B6E]">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Leave blank for 'Price updating soon'"
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-[#FCFAF7] border border-[#1B4D2E]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] text-[#1C241E]"
                  />
                </div>
                <p className="text-[11px] text-[#8A7B6E] mt-1">
                  Leave completely empty to display the &quot;Price updating soon&quot; status.
                </p>
              </div>

              {/* Available Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-2">
                  Storefront Visibility
                </label>
                <label className="flex items-center gap-3 p-3 border border-[#1B4D2E]/15 rounded-md cursor-pointer hover:bg-[#FCFAF7] transition-colors">
                  <input
                    type="checkbox"
                    checked={editAvailable}
                    onChange={(e) => setEditAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#1B4D2E] rounded focus:ring-[#1B4D2E] cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1C241E] block">
                      Available for purchase
                    </span>
                    <span className="text-[11px] text-[#57655B] block">
                      {editAvailable
                        ? 'Product appears live on customer storefront catalog.'
                        : 'Product is hidden from customer storefront catalog.'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Show on Homepage Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-2">
                  Homepage Placement
                </label>
                <label className="flex items-center gap-3 p-3 border border-[#1B4D2E]/15 rounded-md cursor-pointer hover:bg-[#FCFAF7] transition-colors">
                  <input
                    type="checkbox"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#1B4D2E] rounded focus:ring-[#1B4D2E] cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1C241E] block">
                      Show on Homepage (Farm Favorites)
                    </span>
                    <span className="text-[11px] text-[#57655B] block">
                      {editFeatured
                        ? 'Product will be featured on the homepage Farm Favorites section (up to 3 items).'
                        : 'Product will not be highlighted in Farm Favorites on the homepage.'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id)}
                  disabled={saving || deleting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Deleting...' : 'Delete Product'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving || deleting}
                    className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-[#57655B] hover:bg-[#F2ECE7] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || deleting}
                    className="px-5 py-2.5 rounded bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? (newImageFile ? 'Uploading photo & saving...' : 'Saving changes...') : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
