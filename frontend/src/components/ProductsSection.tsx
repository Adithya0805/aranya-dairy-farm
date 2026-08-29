'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { PRODUCTS, Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import { WA_CATALOG_INQUIRY } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ProductsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

export default function ProductsSection({ onSelectProduct }: ProductsSectionProps) {
  const { addItem, items } = useCart();

  // Section scroll reveal
  const sectionRef = useScrollReveal<HTMLElement>();

  // Per-card local quantities (before adding to cart)
  const [localQty, setLocalQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  );

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Track which product's icon should bounce (cleared after animation)
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = useCallback(
    (product: Product) => {
      const qty = localQty[product.id] ?? 1;
      for (let i = 0; i < qty; i++) {
        addItem(product);
      }
      setToast({ show: true, message: `${product.name} added to cart` });
      setLocalQty((prev) => ({ ...prev, [product.id]: 1 }));

      // Trigger icon bounce
      setBouncingId(product.id);
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      bounceTimerRef.current = setTimeout(() => setBouncingId(null), 420);
    },
    [addItem, localQty]
  );

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
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-10 sm:mb-16">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-4xl sm:text-6xl font-serif text-[#1C241E] tracking-tight">
                Best sellers
              </h2>
              <p className="text-sm sm:text-base text-[#57655B] max-w-lg font-sans leading-relaxed">
                Transform your daily family nutrition with our best-selling A2 whole milk and hand-churned Bilona ghee.
              </p>
            </div>

            <div className="lg:col-span-5 lg:text-right">
              <a
                href={WA_CATALOG_INQUIRY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#1C241E] hover:bg-[#1B4D2E] text-white font-sans text-xs uppercase font-semibold tracking-widest px-8 py-4 min-h-[48px] flex items-center justify-center lg:inline-flex transition-colors touch-manipulation"
              >
                Shop Best Sellers
              </a>
            </div>
          </div>

          {/* Product Card Grid
              — single column on mobile (< md)
              — 3 columns on md+
              Cards stagger in using CSS animation-delay via inline style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {PRODUCTS.map((product, index) => {
              const inCart = cartQty(product.id);
              const lQty = localQty[product.id] ?? 1;
              const isBouncing = bouncingId === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col animate-card-reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >

                  {/* Product Image — square on very small screens to prevent over-tall crops */}
                  <div
                    className="w-full aspect-square sm:aspect-[3/4] bg-[#EAE6DF] overflow-hidden mb-4 relative cursor-pointer"
                    onClick={() => onSelectProduct?.(product)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors" />
                    {/* In-cart badge */}
                    {inCart > 0 && (
                      <div className="absolute top-3 right-3 bg-[#1B4D2E] text-white text-[10px] font-bold font-sans px-2 py-1 rounded-full">
                        {inCart} in cart
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1 mb-4">
                    <h3
                      className="font-serif text-lg sm:text-xl text-[#1C241E] group-hover:text-[#1B4D2E] transition-colors cursor-pointer leading-snug"
                      onClick={() => onSelectProduct?.(product)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-base font-sans font-semibold text-[#1C241E]">
                      {product.priceLabel}
                    </p>
                    <p className="text-xs text-[#8A7B6E] font-sans">{product.unit}</p>
                  </div>

                  {/* Add to Cart Controls
                      Both buttons are min 44×44px for comfortable mobile tapping */}
                  <div className="mt-auto flex items-center gap-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center border border-[#1B4D2E]/20 rounded-full overflow-hidden shrink-0">
                      <button
                        onClick={() => changeLocalQty(product.id, -1)}
                        disabled={lQty <= 1}
                        className="w-11 h-11 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/8 disabled:opacity-30 transition-colors touch-manipulation"
                        aria-label={`Decrease quantity for ${product.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#1C241E] font-sans select-none">
                        {lQty}
                      </span>
                      <button
                        onClick={() => changeLocalQty(product.id, 1)}
                        className="w-11 h-11 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/8 transition-colors touch-manipulation"
                        aria-label={`Increase quantity for ${product.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart — flex-1 so it fills remaining width */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1C241E] hover:bg-[#1B4D2E] active:scale-95 text-white text-xs uppercase font-semibold tracking-wider py-3 px-3 min-h-[44px] transition-all touch-manipulation"
                    >
                      <ShoppingBag
                        className={`w-4 h-4 shrink-0 ${isBouncing ? 'animate-icon-bounce' : ''}`}
                      />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

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
