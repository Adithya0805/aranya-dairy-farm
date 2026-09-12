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
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAdminProductsAction, updateProductAction, updateProductWithImageAction } from '@/app/admin/actions';
import { resolveProductImageUrl } from '@/lib/catalog';

interface AdminProduct {
  id: string;
  name: string;
  name_tamil: string | null;
  category_id: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  available: boolean;
  description: string | null;
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

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editAvailable, setEditAvailable] = useState<boolean>(true);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

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
          .select('id, name, name_tamil, category_id, price, unit, image_url, available, description, created_at, categories(id, name)')
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

  // Close Edit Form and clean up object URLs
  const handleCloseModal = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setEditingProduct(null);
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
    setNewImageFile(null);
    setNewImagePreview(null);
    setImageError(null);
    setIsDragging(false);
    setFeedback(null);
  };

  // Validate and stage newly selected image file
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

  // Drag and drop handlers
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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append('id', editingProduct.id);
      formData.append('price', editPrice);
      formData.append('available', String(editAvailable));
      formData.append('categoryName', editingProduct.categories?.name || 'General Store');
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

        // Update local state immediately
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  price: parsedPrice,
                  available: editAvailable,
                  image_url: res.imageUrl || p.image_url,
                }
              : p
          )
        );

        handleCloseModal();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update product. Ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
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

  // Extract unique categories
  const categoriesList = Array.from(
    new Set(products.map((p) => p.categories?.name || 'Uncategorized'))
  ).sort();

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.name_tamil && p.name_tamil.toLowerCase().includes(search.toLowerCase()));

    const categoryName = p.categories?.name || 'Uncategorized';
    const matchesCat = categoryFilter === 'All' || categoryName === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const availableCount = products.filter((p) => p.available).length;
  const hiddenCount = products.filter((p) => !p.available).length;

  return (
    <div className="space-y-6">
      {/* Header Summary & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] mt-1 font-sans">
            Manage pricing, packaging units, and storefront visibility for all 32 items.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Metrics Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#8A7B6E] font-bold block">
            Total Catalog
          </span>
          <span className="text-2xl font-serif font-bold text-[#1C241E] mt-0.5 block">
            {products.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#1B4D2E] font-bold block">
            Live on Store
          </span>
          <span className="text-2xl font-serif font-bold text-[#1B4D2E] mt-0.5 block">
            {availableCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#8A7B6E] font-bold block">
            Hidden (Pending)
          </span>
          <span className="text-2xl font-serif font-bold text-[#8A7B6E] mt-0.5 block">
            {hiddenCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#6B472B] font-bold block">
            Price Pending
          </span>
          <span className="text-2xl font-serif font-bold text-[#6B472B] mt-0.5 block">
            {products.filter((p) => p.price === null).length}
          </span>
        </div>
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
      </div>

      {/* Products Table (Desktop & Tablet) */}
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
                            <div className="font-serif font-bold text-[#1C241E]">
                              {p.name}
                            </div>
                            {p.name_tamil && (
                              <div className="text-xs text-[#1B4D2E] font-medium font-sans">
                                {p.name_tamil}
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

                      {/* Price */}
                      <td className="py-3.5 px-4 font-sans">
                        {hasPrice ? (
                          <span className="font-bold text-[#1C241E]">
                            ?{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B472B] bg-[#F2ECE7] px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B472B]/60 animate-pulse" />
                            Updating soon
                          </span>
                        )}
                      </td>

                      {/* Available Toggle */}
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
                  {editingProduct.name} {editingProduct.name_tamil ? `(${editingProduct.name_tamil})` : ''}
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
              {/* Product Info Summary */}
              <div className="p-3 bg-[#F4EFEA] rounded text-xs space-y-1 text-[#57655B]">
                <p>
                  <span className="font-semibold text-[#1C241E]">Category:</span>{' '}
                  {editingProduct.categories?.name || 'General Store'}
                </p>
                <p>
                  <span className="font-semibold text-[#1C241E]">Unit Size:</span>{' '}
                  {editingProduct.unit || 'Standard'}
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
                  Price in ? (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#8A7B6E]">
                    ?
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

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-[#57655B] hover:bg-[#F2ECE7] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (newImageFile ? 'Uploading photo & saving...' : 'Saving changes...') : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
