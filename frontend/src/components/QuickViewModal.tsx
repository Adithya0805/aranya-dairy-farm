'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, MessageSquare } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface QuickViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({
  isOpen,
  product,
  onClose,
}: QuickViewModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Cached product to allow graceful exit animation
  const [cachedProduct, setCachedProduct] = useState<Product | null>(product);

  useEffect(() => {
    if (product) {
      setCachedProduct(product);
      setQty(1);
      setIsAdded(false);
    }
  }, [product]);

  const activeProduct = product || cachedProduct;

  // Lock body scroll while modal is open to prevent background double-scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!activeProduct) return null;

  const hasPrice = activeProduct.price !== null;

  const handleAddToCart = () => {
    if (!hasPrice) return;
    for (let i = 0; i < qty; i++) {
      addItem(activeProduct);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 650);
  };

  const handleNotifyMe = () => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, please notify me when pricing for ${activeProduct.name} (${activeProduct.nameTamil}) [${activeProduct.unit}] is available.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end sm:items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      {/* Modal Dialog (Bottom sheet on mobile, centered card on desktop) */}
      <div
        className={`relative z-[100] w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#122E1B]/15 overflow-y-auto flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-6 sm:translate-y-0 sm:scale-95'
        }`}
      >
        {/* Mobile top pull indicator */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#122E1B]/20" />
        </div>

        {/* Header with Category Tag and Close Button */}
        <div className="px-6 sm:px-8 pt-4 pb-3 flex items-center justify-between border-b border-[#122E1B]/10">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
            {activeProduct.category}
          </span>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#15321E] hover:text-[#E58A13] hover:bg-[#122E1B]/5 rounded-full transition-all cursor-pointer active:scale-95 ml-auto"
            aria-label="Close Quick View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Product Image */}
            <div className="aspect-square bg-[#F4EFEA] rounded-2xl overflow-hidden p-3 border border-[#122E1B]/10 flex items-center justify-center shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/placeholder-product.svg')) {
                    target.src = '/images/placeholder-product.svg';
                  }
                }}
              />
            </div>

            {/* Product Core Info */}
            <div className="space-y-3">
              <div>
                <h3
                  id="quick-view-title"
                  className="text-2xl sm:text-3xl font-serif font-bold text-[#15321E] leading-tight"
                >
                  {activeProduct.name}
                </h3>
                <p className="text-sm font-sans text-[#122E1B]/75 font-medium mt-1">
                  {activeProduct.nameTamil}
                </p>
              </div>

              <p className="text-xs text-[#8A7B6E] font-sans">
                Pack Size: <span className="text-[#15321E] font-semibold">{activeProduct.unit}</span>
              </p>

              {/* Price or Updating State */}
              <div className="pt-0.5">
                {hasPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-[#15321E]">
                      {formatPrice(activeProduct.price!)}
                    </span>
                    <span className="text-xs text-[#5F6E62] font-sans font-medium">
                      ({activeProduct.unit})
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-xs font-sans font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E58A13] animate-pulse" />
                    <span>Price updating soon</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed pt-1">
                {activeProduct.description ||
                  `Farm-fresh ${activeProduct.name} (${activeProduct.nameTamil}), direct from Aranya Organic Dairy Farm in Shoolagiri. Free from chemical preservatives, synthetic additives, and artificial processing.`}
              </p>
            </div>
          </div>

          {/* Standards & Trust Bullet Points */}
          <div className="bg-white/80 border border-[#122E1B]/10 rounded-2xl p-4 space-y-2.5 text-xs font-sans text-[#15321E]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E58A13] shrink-0" />
              <span>100% natural, farm-sourced &amp; cold-chain handled</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E58A13] shrink-0" />
              <span>Doorstep morning delivery for orders placed before 8 PM</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2">
            {hasPrice ? (
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden shrink-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="w-11 h-11 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all touch-manipulation cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#15321E] font-sans select-none">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    className="w-11 h-11 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all touch-manipulation cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 min-h-[48px] rounded-full text-white font-sans text-xs uppercase font-bold tracking-wider px-6 py-3.5 flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                    isAdded
                      ? 'bg-[#15321E] text-[#FAF7F2] shadow-none'
                      : 'bg-[#E58A13] hover:bg-[#CA7508] shadow-[#E58A13]/25'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#8FA382]" />
                      <span>Added to Cart! ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        ADD TO CART • {formatPrice((activeProduct.price ?? 0) * qty)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNotifyMe}
                className="w-full min-h-[48px] rounded-full bg-[#E58A13] hover:bg-[#CA7508] active:scale-[0.98] text-white font-sans text-xs uppercase font-bold tracking-wider px-6 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[#E58A13]/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
