'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Bell, Plus, Minus, Eye, ArrowRight } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FeaturedProductsPreviewProps {
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function FeaturedProductsPreview({
  products,
  onSelectProduct,
  onQuickView,
}: FeaturedProductsPreviewProps) {
  const { addItem, items } = useCart();
  const sectionRef = useScrollReveal<HTMLElement>();

  // Show products where featured = true (limit 3). If fewer than 3, show only what exists without placeholders.
  const previewProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter((p) => p.featured).slice(0, 3);
  }, [products]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (product.price === null) return;
    const qty = quantities[product.id] ?? 1;
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleNotifyMe = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, please notify me when pricing for ${product.name} (${product.nameTamil}) is available.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  if (previewProducts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="reveal-section py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#122E1B]/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
            Direct From Shoolagiri
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#15321E] tracking-tight">
            Farm Favorites
          </h2>
          <p className="text-sm sm:text-base text-[#5F6E62] font-sans leading-relaxed">
            Our most cherished daily staples — crafted naturally, uncompromised by shortcuts.
          </p>
        </div>

        {/* Product Cards Preview - dynamically handles 1, 2, or 3 cards */}
        <div
          className={`grid grid-cols-1 ${
            previewProducts.length === 1
              ? 'max-w-md mx-auto'
              : previewProducts.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : 'md:grid-cols-3'
          } gap-8 lg:gap-10`}
        >
          {previewProducts.map((product, index) => {
            const hasPrice = product.price !== null;
            const inCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
            const currentQty = quantities[product.id] ?? 1;

            return (
              <div
                key={product.id}
                className="group reveal-child flex flex-col bg-white rounded-2xl border border-[#122E1B]/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E58A13]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-5"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                {/* Product Image */}
                <div
                  className="w-full aspect-square bg-[#F4EFEA] rounded-xl overflow-hidden mb-4 relative cursor-pointer flex items-center justify-center p-2.5"
                  onClick={() => onSelectProduct?.(product)}
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
                      if (onQuickView) {
                        onQuickView(product);
                      } else {
                        onSelectProduct?.(product);
                      }
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
                        if (onQuickView) {
                          onQuickView(product);
                        } else {
                          onSelectProduct?.(product);
                        }
                      }}
                      className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-xs text-[#15321E] border border-[#122E1B]/20 text-xs font-sans font-bold uppercase tracking-wider shadow-lg hover:bg-[#E58A13] hover:text-white hover:border-[#E58A13] active:scale-95 transition-all duration-200 cursor-pointer"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-current" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#B84A28] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded z-10">
                    {product.category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-5 flex-1">
                  <h3
                    className="font-serif text-xl text-[#15321E] group-hover:text-[#E58A13] transition-colors cursor-pointer font-bold leading-snug"
                    onClick={() => onSelectProduct?.(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs font-sans text-[#122E1B]/80 font-medium">
                    {product.nameTamil}
                  </p>
                  <p className="text-xs text-[#8A7B6E] font-sans">
                    Unit: <span className="text-[#15321E] font-medium">{product.unit}</span>
                  </p>

                  <div className="pt-2">
                    {hasPrice ? (
                      <p className="text-lg font-sans font-bold text-[#15321E]">
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

                {/* Action CTA matching pill amber style */}
                <div className="mt-auto pt-3 border-t border-[#122E1B]/8">
                  {hasPrice ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden shrink-0 bg-[#FAF7F2]">
                        <button
                          onClick={() => handleQtyChange(product.id, -1)}
                          disabled={currentQty <= 1}
                          className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all touch-manipulation cursor-pointer"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-[#15321E] font-sans select-none">
                          {currentQty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all touch-manipulation cursor-pointer"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white text-xs uppercase font-bold tracking-wider py-3 px-4 min-h-[44px] rounded-full shadow-md shadow-[#E58A13]/20 transition-all duration-150 touch-manipulation cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNotifyMe(product)}
                      className="w-full flex items-center justify-center gap-2 border border-[#E58A13] hover:bg-[#E58A13] text-[#E58A13] hover:text-white text-xs uppercase font-bold tracking-wider py-3 px-4 min-h-[44px] rounded-full transition-all duration-150 touch-manipulation active:scale-95 cursor-pointer"
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

        {/* Big Important Button to full product showcase */}
        <div className="text-center pt-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-3 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs sm:text-sm uppercase font-bold tracking-widest px-8 sm:px-10 py-4 sm:py-4.5 rounded-full shadow-xl shadow-[#E58A13]/25 transition-all min-h-[52px] touch-manipulation cursor-pointer group"
          >
            <span>View All Products in Showcase</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
