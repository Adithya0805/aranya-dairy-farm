'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, MessageSquare, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import StickyMobileAddToCartBar from './StickyMobileAddToCartBar';

export interface ModalContent {
  title: string;
  subtitle?: string;
  category?: string;
  image?: string;
  bodyParagraphs: string[];
  bulletPoints?: string[];
  ctaLabel?: string;
  whatsappMessage?: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ModalContent | null;
  product?: Product | null;
}

export default function DetailModal({
  isOpen,
  onClose,
  content,
  product,
}: DetailModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset local state when product changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setIsAdded(false);
      setShowStickyBar(false);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, product]);

  // Handle escape key
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

  // Scroll listener for sticky add-to-cart bar
  const handleScroll = () => {
    if (!drawerRef.current) return;
    setShowStickyBar(drawerRef.current.scrollTop > 160);
  };

  if (!mounted || !isOpen || !content) return null;

  const hasPrice = product?.price !== null && product?.price !== undefined;

  const handleAddToCart = (targetProduct: Product, addQty: number) => {
    if (targetProduct.price === null) return;
    for (let i = 0; i < addQty; i++) {
      addItem(targetProduct);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const defaultWhatsappMsg = encodeURIComponent(
    `Hello Aranya Dairy Farm, I'd like to learn more about ${content.title}.`
  );
  const finalWhatsappMsg = content.whatsappMessage
    ? encodeURIComponent(content.whatsappMessage)
    : defaultWhatsappMsg;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* ── Backdrop Overlay ── */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Right-Side Slide Drawer ── */}
      <aside
        ref={drawerRef}
        onScroll={handleScroll}
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        className="fixed top-0 right-0 bottom-0 z-10 w-full max-w-lg bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#122E1B]/15 overflow-y-auto overscroll-contain animate-in slide-in-from-right duration-300 pb-[calc(56px+env(safe-area-inset-bottom,0px))] md:pb-0"
      >
        <div>
          {/* Drawer Header */}
          <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md px-6 py-4 border-b border-[#122E1B]/10 flex items-center justify-between z-10">
            {content.category && (
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
                {content.category}
              </span>
            )}
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#15321E] hover:text-[#E58A13] rounded-full hover:bg-[#122E1B]/5 active:scale-95 transition-all ml-auto cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optional Header Image */}
          {content.image && (
            <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#F4EFEA] border-b border-[#122E1B]/10 flex items-center justify-center p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/placeholder-product.svg')) {
                    target.src = '/images/placeholder-product.svg';
                  }
                }}
              />
            </div>
          )}

          {/* Drawer Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              {content.subtitle && (
                <p className="text-xs font-sans font-bold uppercase tracking-wider text-[#B84A28] mb-1">
                  {content.subtitle}
                </p>
              )}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#15321E]">
                {content.title}
              </h2>
            </div>

            {/* Product Price & Inline Quick Action (if product view) */}
            {product && (
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#122E1B]/10 space-y-3.5 shadow-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-sans font-medium text-[#8A7B6E]">Price & Packaging:</span>
                  {hasPrice ? (
                    <span className="text-xl font-sans font-bold text-[#15321E]">
                      {formatPrice(product.price!)}
                    </span>
                  ) : (
                    <span className="text-xs font-sans font-semibold text-[#E58A13] uppercase tracking-wider">
                      Price updating soon
                    </span>
                  )}
                </div>

                {hasPrice && (
                  <div className="flex items-center gap-3 pt-1">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden shrink-0 bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        disabled={qty <= 1}
                        className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all touch-manipulation cursor-pointer"
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
                        className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all touch-manipulation cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to cart button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, qty)}
                      disabled={isAdded}
                      className={`flex-1 min-h-[44px] rounded-full text-white font-sans text-xs uppercase font-bold tracking-wider px-5 py-3 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                        isAdded
                          ? 'bg-[#15321E] text-[#FAF7F2]'
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
                            Add to Cart • {formatPrice((product.price ?? 0) * qty)}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Paragraphs */}
            <div className="space-y-4 text-sm text-[#5F6E62] leading-relaxed font-sans">
              {content.bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bullet Highlights */}
            {content.bulletPoints && content.bulletPoints.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#122E1B]/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#15321E]">
                  Key Standards & Details
                </h4>
                <ul className="space-y-2.5">
                  {content.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#15321E]">
                      <CheckCircle className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-[#122E1B]/10 bg-[#FAF7F2] space-y-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${finalWhatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] bg-[#E58A13] hover:bg-[#CA7508] active:scale-[0.98] text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E58A13]/20 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{content.ctaLabel || 'Inquire on WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="w-full min-h-[44px] flex items-center justify-center text-center text-xs text-[#B84A28] hover:underline active:scale-95 font-medium py-1 transition-all cursor-pointer"
          >
            Back to Products
          </button>
        </div>
      </aside>

      {/* Sticky Mobile Add to Cart Bar */}
      {product && (
        <StickyMobileAddToCartBar
          product={product}
          isVisible={showStickyBar && isOpen}
          onAddToCart={(p, q) => handleAddToCart(p, q)}
        />
      )}
    </div>,
    document.body
  );
}
