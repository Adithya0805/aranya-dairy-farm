'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Minus, ShoppingBag, Bell, Check, Eye } from 'lucide-react';
import { PRODUCTS, Product, ProductCategory, CATEGORIES, getProductPriceLabel, formatPrice } from '@/lib/products';
import { getCategories, getProducts, testAnonProductWrite } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import { WA_CATALOG_INQUIRY, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getRecentOrderCountAction } from '@/app/actions/orderStats';

interface ProductsSectionProps {
  onSelectProduct?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onProductsLoaded?: (products: Product[]) => void;
}

export default function ProductsSection({
  onSelectProduct,
  onQuickView,
  selectedCategory: externalCategory,
  onCategoryChange,
  onProductsLoaded,
}: ProductsSectionProps) {
  const { addItem, items } = useCart();

  // Section scroll reveal
  const sectionRef = useScrollReveal<HTMLElement>();

  // Dynamic Catalog State from Supabase (with fallback defaults)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Category filter state ('All' or one of the dynamic category names)
  const [selectedCategory, setSelectedCategory] = useState<string>(externalCategory || 'All');

  useEffect(() => {
    if (externalCategory !== undefined) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    onCategoryChange?.(cat);
  };

  // Per-card local quantities (for products that have an active price)
  const [localQty, setLocalQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  );

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Track which product's icon should bounce on add
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Real order activity state (aggregated count from last 7 days)
  const [weeklyOrderCount, setWeeklyOrderCount] = useState<number | null>(null);

  // Load live catalog and categories from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [cats, prods, orderStats] = await Promise.all([
          getCategories(),
          getProducts(),
          getRecentOrderCountAction(),
        ]);
        if (isMounted) {
          if (cats && cats.length > 0) setCategories(cats);
          if (prods && prods.length > 0) {
            setProducts(prods);
            onProductsLoaded?.(prods);
            setLocalQty((prev) => {
              const updated = { ...prev };
              prods.forEach((p) => {
                if (!(p.id in updated)) updated[p.id] = 1;
              });
              return updated;
            });
          }
          if (orderStats && orderStats.success) {
            setWeeklyOrderCount(orderStats.count);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching live catalog from Supabase:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadCatalog();

    // Expose helpers on window for browser console testing
    if (typeof window !== 'undefined') {
      const win = window as unknown as Window & {
        testSupabaseRLS?: typeof testAnonProductWrite;
        supabase?: typeof supabase;
      };
      win.testSupabaseRLS = testAnonProductWrite;
      win.supabase = supabase;
    }

    return () => {
      isMounted = false;
    };
  }, [onProductsLoaded]);

  // ── RICE SECTION HANDLING & AVAILABILITY ──────────────────────────────────
  // Exactly 24 confirmed products are marked available: true.
  // The 8 traditional Rice items remain available: false (transcribed in database
  // but excluded from the visible storefront catalog until client confirms final details).
  const availableProducts = useMemo(
    () => products.filter((p) => p.available),
    [products]
  );

  // Category counts based on confirmed available products from Supabase
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: availableProducts.length };
    categories.forEach((cat) => {
      counts[cat] = availableProducts.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [availableProducts, categories]);

  // Filtered products to display in the grid
  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'All') return availableProducts;
    return availableProducts.filter((p) => p.category === selectedCategory);
  }, [availableProducts, selectedCategory]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      // If price is not yet available, do not add to cart
      if (product.price === null) return;

      const qty = localQty[product.id] ?? 1;
      for (let i = 0; i < qty; i++) {
        addItem(product);
      }
      setToast({ show: true, message: `${product.name} added to cart` });
      setLocalQty((prev) => ({ ...prev, [product.id]: 1 }));

      setBouncingId(product.id);
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      bounceTimerRef.current = setTimeout(() => setBouncingId(null), 420);
    },
    [addItem, localQty]
  );

  const handleNotifyMe = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, please notify me when pricing for ${product.name} (${product.nameTamil}) is available.`
    );
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setToast({
      show: true,
      message: `Opening WhatsApp to request notification for ${product.name}`,
    });
  };

  const changeLocalQty = (productId: string, delta: number) => {
    setLocalQty((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] ?? 1) + delta),
    }));
  };

  const cartQty = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <>
      <section
        id="shop"
        ref={sectionRef}
        className="reveal-section py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#122E1B]/10 w-full"
      >
        {/* Anchor for backwards-compatibility */}
        <div id="products" className="scroll-mt-24" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Full-bleed Photo Banner Header overlay in hero style */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/7] min-h-[220px] sm:min-h-[260px] flex items-center justify-center overflow-hidden bg-[#122E1B] mb-12 sm:mb-16 rounded-3xl shadow-lg border border-[#122E1B]/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nature_hero_pasture.jpg"
              alt="Our Shop - Aranya Organic Dairy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#122E1B] via-[#122E1B]/60 to-black/40" />
            <div className="relative z-10 text-center px-4 space-y-2.5 animate-fade-in">
              <span className="inline-block text-xs uppercase font-sans tracking-[0.25em] text-[#E58A13] font-bold">
                Farm Provisions &amp; Daily Grocery • மளிகைக் கடை
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#FAF7F2] font-bold tracking-tight drop-shadow-md">
                Our Shop
              </h2>
              <p className="text-xs sm:text-sm text-[#F4EFEB] font-sans max-w-lg mx-auto leading-relaxed">
                Pure A2 milk, traditional Bilona ghee, native millets, lentils, and daily domestic grocery essentials from our Shoolagiri farm.
              </p>
            </div>
          </div>

          {/* Top Info Bar with WhatsApp catalog inquiry */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#15321E]">
                All Farm Offerings
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 mt-1">
                <p className="text-xs sm:text-sm text-[#5F6E62]">
                  Showing {displayedProducts.length} verified farm items
                </p>
                {/* Genuine order activity count — ONLY rendered if real weekly count >= 5 */}
                {weeklyOrderCount !== null && weeklyOrderCount >= 5 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#122E1B]/5 text-[#15321E] border border-[#122E1B]/10 text-xs font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E58A13] animate-pulse" />
                    <span>{weeklyOrderCount} orders this week</span>
                  </span>
                )}
              </div>
            </div>
            <a
              href={WA_CATALOG_INQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#122E1B] hover:bg-[#1C3E25] text-white font-sans text-xs uppercase font-bold tracking-wider px-6 py-3 min-h-[44px] rounded-full transition-all touch-manipulation active:scale-95"
            >
              Inquire Full Price List
            </a>
          </div>

          {/* Category Filter Chips / Tabs (Horizontal scrollable, dynamic from Supabase) */}
          <div id="category-filters" className="mb-10 sm:mb-14 scroll-mt-24">
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
              {['All', ...categories].map((category) => {
                const isSelected = selectedCategory === category;
                const count = categoryCounts[category] ?? 0;
                return (
                  <button
                    key={category}
                    onClick={() => handleSelectCategory(category)}
                    className={`
                      shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-200 ease-out min-h-[40px] touch-manipulation cursor-pointer active:scale-95
                      ${
                        isSelected
                          ? 'bg-[#E58A13] text-white font-bold shadow-md shadow-[#E58A13]/25 scale-[1.02]'
                          : 'bg-[#FAF7F2] hover:bg-[#F2ECE7] hover:text-[#15321E] text-[#15321E] font-medium border border-[#122E1B]/10'
                      }
                    `}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${category} (${count} products)`}
                  >
                    <span>{category}</span>
                    <span
                      className={`
                        text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors duration-200
                        ${isSelected ? 'bg-white/25 text-white' : 'bg-[#15321E]/10 text-[#5F6E62]'}
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 animate-grid-fade"
          >
            {displayedProducts.map((product, index) => {
              const inCart = cartQty(product.id);
              const lQty = localQty[product.id] ?? 1;
              const isBouncing = bouncingId === product.id;
              const hasPrice = product.price !== null;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white border border-[#122E1B]/10 rounded-2xl p-4 sm:p-5 hover:border-[#E58A13]/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#122E1B]/6 active:scale-[0.99] transition-all duration-200 ease-out animate-card-reveal"
                  style={{ animationDelay: `${(index % 6) * 80}ms` }}
                >

                  {/* Product Image */}
                  <div
                    className="w-full aspect-square bg-[#F4EFEA] overflow-hidden mb-4 relative cursor-pointer rounded-xl flex items-center justify-center p-2.5"
                    onClick={() => onSelectProduct?.(product)}
                    aria-label={`View details for ${product.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/images/placeholder-product.svg')) {
                          target.src = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />

                    {/* In-cart badge */}
                    {inCart > 0 && (
                      <div className="absolute top-3 right-3 bg-[#E58A13] text-white text-[10px] font-bold font-sans px-2.5 py-1 rounded-full shadow-sm z-10">
                        {inCart} in cart
                      </div>
                    )}

                    {/* Mobile Quick-View Pill (top-left) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView ? onQuickView(product) : onSelectProduct?.(product);
                      }}
                      className="sm:hidden absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2]/95 backdrop-blur-xs text-[#15321E] border border-[#122E1B]/15 text-[10px] font-sans font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="w-3 h-3 text-[#E58A13]" />
                      <span>Quick View</span>
                    </button>

                    {/* Desktop Hover Quick-View Pill (centered) */}
                    <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView ? onQuickView(product) : onSelectProduct?.(product);
                        }}
                        className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-xs text-[#15321E] border border-[#122E1B]/20 text-xs font-sans font-bold uppercase tracking-wider shadow-lg hover:bg-[#E58A13] hover:text-white hover:border-[#E58A13] active:scale-95 transition-all duration-200 cursor-pointer"
                        aria-label={`Quick view ${product.name}`}
                      >
                        <Eye className="w-3.5 h-3.5 text-current" />
                        <span>Quick View</span>
                      </button>
                    </div>

                    {/* Category tag in terracotta accent */}
                    <div className="absolute bottom-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#B84A28] border border-[#B84A28]/20 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full z-10">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        className="font-serif text-lg sm:text-xl text-[#15321E] font-bold group-hover:text-[#E58A13] transition-colors cursor-pointer leading-snug"
                        onClick={() => onSelectProduct?.(product)}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Tamil Name */}
                    <p className="text-xs font-sans text-[#122E1B]/75 font-medium tracking-wide">
                      {product.nameTamil}
                    </p>

                    {/* Packaging Unit */}
                    <p className="text-xs text-[#8A7B6E] font-sans">
                      Pack: <span className="text-[#15321E] font-medium">{product.unit}</span>
                    </p>

                    {/* Price Display */}
                    <div className="pt-2">
                      {hasPrice ? (
                        <p className="text-base font-sans font-bold text-[#15321E]">
                          {formatPrice(product.price!)}
                        </p>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-[11px] font-sans font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E58A13] animate-pulse" />
                          <span>Price updating soon</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="mt-auto pt-2 border-t border-[#122E1B]/8">
                    {hasPrice ? (
                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden shrink-0 bg-[#FAF7F2]">
                          <button
                            onClick={() => changeLocalQty(product.id, -1)}
                            disabled={lQty <= 1}
                            className="w-11 h-11 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all duration-150 touch-manipulation cursor-pointer"
                            aria-label={`Decrease quantity for ${product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#15321E] font-sans select-none">
                            {lQty}
                          </span>
                          <button
                            onClick={() => changeLocalQty(product.id, 1)}
                            className="w-11 h-11 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all duration-150 touch-manipulation cursor-pointer"
                            aria-label={`Increase quantity for ${product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add to Cart in amber pill style */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-[0.97] text-white text-xs uppercase font-bold tracking-wider py-3 px-3 min-h-[44px] rounded-full transition-all duration-150 touch-manipulation cursor-pointer shadow-md shadow-[#E58A13]/20"
                        >
                          <ShoppingBag
                            className={`w-4 h-4 shrink-0 ${isBouncing ? 'animate-icon-bounce' : ''}`}
                          />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ) : (
                      /* Price Pending State: Notify Me via WhatsApp button */
                      <button
                        onClick={() => handleNotifyMe(product)}
                        className="w-full flex items-center justify-center gap-2 border border-[#E58A13] hover:bg-[#E58A13] bg-[#FAF7F2] text-[#E58A13] hover:text-white text-xs uppercase font-bold tracking-wider py-3 px-3 min-h-[44px] rounded-full transition-all duration-200 touch-manipulation active:scale-[0.98] cursor-pointer"
                        aria-label={`Notify me when price for ${product.name} is available`}
                      >
                        <Bell className="w-3.5 h-3.5 shrink-0" />
                        <span>Notify Me on Price</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Empty state if a selected category has no available products */}
          {displayedProducts.length === 0 && (
            <div className="py-16 text-center space-y-3 bg-white border border-[#122E1B]/10 rounded-2xl p-8">
              <p className="font-serif text-2xl text-[#15321E] font-bold">No items currently available in this category</p>
              <p className="text-sm text-[#5F6E62] font-sans max-w-md mx-auto">
                We are actively restocking and confirming items with the farm. In the meantime, select another category or check back soon.
              </p>
              <button
                onClick={() => handleSelectCategory('All')}
                className="mt-4 inline-block bg-[#E58A13] hover:bg-[#CA7508] text-white text-xs uppercase font-bold tracking-widest px-6 py-3 rounded-full transition-colors touch-manipulation"
              >
                View All Products
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: '' })}
      />
    </>
  );
}
