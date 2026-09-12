'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingBag, Check, MessageSquare } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface StickyMobileAddToCartBarProps {
  product: Product | null;
  isVisible: boolean;
  onAddToCart?: (product: Product, qty: number) => void;
}

export default function StickyMobileAddToCartBar({
  product,
  isVisible,
  onAddToCart,
}: StickyMobileAddToCartBarProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQty(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const hasPrice = product.price !== null;

  const handleAdd = () => {
    if (!hasPrice) return;
    if (onAddToCart) {
      onAddToCart(product, qty);
    } else {
      for (let i = 0; i < qty; i++) {
        addItem(product);
      }
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleNotifyWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, please notify me when pricing for ${product.name} (${product.nameTamil}) [${product.unit}] is available.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Sticky Add to Cart Bar"
      className={`md:hidden fixed left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#122E1B]/15 px-3.5 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-[120%] opacity-0 pointer-events-none'
      }`}
      style={{
        bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-between gap-2.5 max-w-lg mx-auto">
        {/* Product Thumbnail & Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#F4EFEA] border border-[#122E1B]/10 p-1 shrink-0 overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/placeholder-product.svg')) {
                  target.src = '/images/placeholder-product.svg';
                }
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-xs font-bold text-[#15321E] truncate leading-tight">
              {product.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              {hasPrice ? (
                <span className="text-xs font-sans font-bold text-[#15321E]">
                  {formatPrice(product.price!)}
                </span>
              ) : (
                <span className="text-[10px] font-sans font-semibold text-[#E58A13] uppercase tracking-wide">
                  Price soon
                </span>
              )}
              <span className="text-[10px] text-[#8A7B6E] font-sans truncate">
                • {product.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Stepper & Add Button */}
        {hasPrice ? (
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Stepper */}
            <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden bg-white shrink-0">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                disabled={qty <= 1}
                className="w-8 h-8 flex items-center justify-center text-[#15321E] active:bg-[#E58A13]/20 disabled:opacity-30 transition-all touch-manipulation cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-semibold text-[#15321E] font-sans select-none">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#15321E] active:bg-[#E58A13]/20 transition-all touch-manipulation cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdded}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-white font-sans text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all touch-manipulation cursor-pointer ${
                isAdded
                  ? 'bg-[#15321E] text-[#FAF7F2]'
                  : 'bg-[#E58A13] hover:bg-[#CA7508] shadow-[#E58A13]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#8FA382]" />
                  <span>Added! ✓</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNotifyWhatsApp}
            className="min-h-[36px] px-3 py-1.5 rounded-full bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 shadow-sm touch-manipulation cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Inquire</span>
          </button>
        )}
      </div>
    </aside>
  );
}
