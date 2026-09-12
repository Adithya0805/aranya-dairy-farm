'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Minus, ShoppingBag, Bell, Check } from 'lucide-react';
import { PRODUCTS, Product, ProductCategory, CATEGORIES, getProductPriceLabel, formatPrice } from '@/lib/products';
import { getCategories, getProducts, testAnonProductWrite } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import { WA_CATALOG_INQUIRY, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ProductsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

export default function ProductsSection({ onSelectProduct }: ProductsSectionProps) {
  const { addItem, items } = useCart();

  // Section scroll reveal
  const sectionRef = useScrollReveal<HTMLElement>();

  // Dynamic Catalog State from Supabase (with fallback defaults)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Category filter state ('All' or one of the dynamic category names)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  // Load live catalog and categories from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        if (isMounted) {
          if (cats && cats.length > 0) setCategories(cats);
          if (prods && prods.length > 0) {
            setProducts(prods);
            setLocalQty((prev) => {
              const updated = { ...prev };
              prods.forEach((p) => {
                if (!(p.id in updated)) updated[p.id] = 1;
              });
              return updated;
            });
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
  }, []);

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
        id="products"
        ref={sectionRef}
        className="reveal-section py-16 sm:py-24 bg-[#FCFAF7] border-b border-[#1B4D2E]/10 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-8 sm:mb-12">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4D2E]/10 text-[#1B4D2E] text-xs font-semibold uppercase tracking-wider">
                <span>மளிகைக் கடை • Farm Store Catalog</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#1C241E] tracking-tight">
                Farm provisions
              </h2>
              <p className="text-sm sm:text-base text-[#57655B] max-w-lg font-sans leading-relaxed">
                Pure A2 milk, traditional Bilona ghee, native millets, lentils, and daily domestic grocery essentials from our Shoolagiri farm.
              </p>
            </div>

            <div className="lg:col-span-5 lg:text-right">
              <a
                href={WA_CATALOG_INQUIRY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#1C241E] hover:bg-[#1B4D2E] text-white font-sans text-xs uppercase font-semibold tracking-widest px-8 py-4 min-h-[48px] flex items-center justify-center lg:inline-flex transition-colors touch-manipulation"
              >
                Inquire Full Price List
              </a>
            </div>
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
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-200 ease-out min-h-[40px] touch-manipulation cursor-pointer active:scale-95
                      ${
                        isSelected
                          ? 'bg-[#1B4D2E] text-white font-bold shadow-md shadow-[#1B4D2E]/15 scale-[1.02]'
                          : 'bg-[#F2ECE7] hover:bg-[#E8E1DA] hover:text-[#1B4D2E] text-[#1C241E] font-medium border border-transparent'
                      }
                    `}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${category} (${count} products)`}
                  >
                    <span>{category}</span>
                    <span
                      className={`
                        text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors duration-200
                        ${isSelected ? 'bg-white/25 text-white' : 'bg-[#1C241E]/10 text-[#57655B]'}
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid
              — 1 column on mobile (< 640px)
              — 2 columns on tablet (sm)
              — 3 columns on desktop (md+)
              Smooth fade transition when category filter changes
          */}
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
                  className="group flex flex-col bg-white border border-[#1B4D2E]/10 rounded-sm p-4 sm:p-5 hover:border-[#1B4D2E]/35 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1B4D2E]/6 active:scale-[0.99] transition-all duration-200 ease-out animate-card-reveal"
                  style={{ animationDelay: `${(index % 6) * 80}ms` }}
                >

                  {/* Product Image — displays Supabase storage photo or soft neutral placeholder */}
                  <div
                    className="w-full aspect-square bg-[#F4EFEA] overflow-hidden mb-4 relative cursor-pointer rounded-sm flex items-center justify-center"
                    onClick={() => onSelectProduct?.(product)}
                    aria-label={`View details for ${product.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/images/placeholder-product.svg')) {
                          target.src = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                    {/* In-cart badge */}
                    {inCart > 0 && (
                      <div className="absolute top-3 right-3 bg-[#1B4D2E] text-white text-[10px] font-bold font-sans px-2.5 py-1 rounded-full shadow-sm">
                        {inCart} in cart
                      </div>
                    )}

                    {/* Category tag */}
                    <div className="absolute bottom-2.5 left-2.5 bg-[#FCFAF7]/90 backdrop-blur-xs text-[#57655B] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        className="font-serif text-lg sm:text-xl text-[#1C241E] group-hover:text-[#1B4D2E] transition-colors cursor-pointer leading-snug"
                        onClick={() => onSelectProduct?.(product)}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Tamil Name (Authentic local grocery touch) */}
                    <p className="text-xs font-sans text-[#1B4D2E] font-medium tracking-wide">
                      {product.nameTamil}
                    </p>

                    {/* Packaging Unit */}
                    <p className="text-xs text-[#8A7B6E] font-sans">
                      Pack: <span className="text-[#1C241E] font-medium">{product.unit}</span>
                    </p>

                    {/* Price Display */}
                    <div className="pt-2">
                      {hasPrice ? (
                        <p className="text-base font-sans font-bold text-[#1C241E]">
                          {formatPrice(product.price!)}
                        </p>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F2ECE7] text-[#6B472B] text-[11px] font-sans font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6B472B]/60 animate-pulse" />
                          <span>Price updating soon</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Controls
                      — When price is available: Stepper + Add to Cart
                      — When price is null: "Notify Me" WhatsApp button
                      Zero layout changes will be required when price is populated later.
                  */}
                  <div className="mt-auto pt-2 border-t border-[#1B4D2E]/8">
                    {hasPrice ? (
                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#1B4D2E]/20 rounded-full overflow-hidden shrink-0 bg-[#FAF7F2]">
                          <button
                            onClick={() => changeLocalQty(product.id, -1)}
                            disabled={lQty <= 1}
                            className="w-11 h-11 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/10 active:scale-90 disabled:opacity-25 transition-all duration-150 touch-manipulation cursor-pointer"
                            aria-label={`Decrease quantity for ${product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#1C241E] font-sans select-none">
                            {lQty}
                          </span>
                          <button
                            onClick={() => changeLocalQty(product.id, 1)}
                            className="w-11 h-11 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/10 active:scale-90 transition-all duration-150 touch-manipulation cursor-pointer"
                            aria-label={`Increase quantity for ${product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#1C241E] hover:bg-[#1B4D2E] active:scale-[0.97] active:bg-[#143A22] text-white text-xs uppercase font-semibold tracking-wider py-3 px-3 min-h-[44px] rounded-sm transition-all duration-150 touch-manipulation cursor-pointer shadow-xs hover:shadow-md"
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
                        className="w-full flex items-center justify-center gap-2 border border-[#1B4D2E]/25 hover:border-[#1B4D2E] bg-[#FCFAF7] hover:bg-[#1B4D2E] text-[#1B4D2E] hover:text-white text-xs uppercase font-semibold tracking-wider py-3 px-3 min-h-[44px] rounded-sm transition-all duration-200 touch-manipulation active:scale-[0.98] cursor-pointer"
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
            <div className="py-16 text-center space-y-3 bg-white border border-[#1B4D2E]/10 rounded-sm p-8">
              <p className="font-serif text-2xl text-[#1C241E]">No items currently available in this category</p>
              <p className="text-sm text-[#57655B] font-sans max-w-md mx-auto">
                We are actively restocking and confirming items with the farm. In the meantime, select another category or check back soon.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-4 inline-block bg-[#1B4D2E] text-white text-xs uppercase font-semibold tracking-widest px-6 py-3 rounded transition-colors touch-manipulation"
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
