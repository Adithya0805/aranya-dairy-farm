'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '919876543210'; // replace with real number

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPriceLabel, removeItem, updateQuantity, clearCart, buildWhatsAppMessage } =
    useCart();
  const [orderSent, setOrderSent] = useState(false);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    clearCart();
    setOrderSent(true);
  };

  const handleClose = () => {
    // Reset order-sent state when drawer is closed so next visit is clean
    setOrderSent(false);
    onClose();
  };

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ── */}
      {/* On mobile: full-width bottom sheet; on sm+: right sidebar */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`
          fixed z-50 bg-[#FCFAF7] flex flex-col
          transition-transform duration-300 ease-in-out
          /* Mobile: bottom sheet, full width */
          bottom-0 left-0 right-0 h-[92dvh] rounded-t-2xl
          /* sm+: right sidebar */
          sm:bottom-auto sm:top-0 sm:left-auto sm:right-0 sm:h-full sm:w-[420px] sm:max-w-[90vw] sm:rounded-none
          shadow-2xl
          ${isOpen
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
          }
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#1B4D2E]/10 bg-[#FCFAF7] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1B4D2E]" />
            <h2 className="font-serif text-xl text-[#1C241E]">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-sans text-[#6B472B]">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              )}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-[#1C241E] hover:bg-[#1B4D2E]/8 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Order Sent Confirmation State */}
          {orderSent ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-[#1B4D2E]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#1C241E]">Order Sent!</h3>
                <p className="text-sm text-[#57655B] leading-relaxed">
                  We&apos;ll confirm your order on WhatsApp shortly and share delivery details. 🙏
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 bg-[#1C241E] hover:bg-[#1B4D2E] text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#F2ECE7] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#8A7B6E]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#1C241E]">Your cart is empty</h3>
                <p className="text-sm text-[#57655B]">
                  Add some fresh A2 dairy products to get started.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 border border-[#1C241E] text-[#1C241E] hover:bg-[#1C241E] hover:text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <ul className="divide-y divide-[#1B4D2E]/8 px-4 sm:px-5 pt-2 pb-4">
              {items.map(({ product, quantity }) => {
                const lineTotal = `₹${(product.price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                return (
                  <li key={product.id} className="py-4 flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-[#EAE6DF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info + Controls */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif text-base text-[#1C241E] leading-snug">{product.name}</p>
                          <p className="text-[11px] text-[#8A7B6E] font-sans">{product.unit}</p>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 text-[#8A7B6E] hover:text-red-500 transition-colors shrink-0 -mt-0.5"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#1B4D2E]/20 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/8 transition-colors touch-manipulation"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#1C241E] font-sans select-none">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/8 transition-colors touch-manipulation"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Per-item subtotal */}
                        <span className="text-sm font-semibold font-sans text-[#1C241E]">{lineTotal}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer: Total + WhatsApp CTA ── */}
        {!orderSent && items.length > 0 && (
          <div className="shrink-0 border-t border-[#1B4D2E]/10 bg-[#FCFAF7] px-5 sm:px-6 pt-4 pb-6 space-y-4">
            {/* Running Total */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-sans text-[#57655B] uppercase tracking-wider text-xs font-semibold">Order Total</span>
              <span className="font-serif text-xl text-[#1C241E] font-bold">{totalPriceLabel}</span>
            </div>
            <p className="text-[11px] text-[#8A7B6E] font-sans -mt-1">
              Delivery charges calculated at confirmation.
            </p>

            {/* WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1FB055] text-white font-sans text-sm font-bold py-4 rounded-none transition-colors touch-manipulation"
            >
              <MessageSquare className="w-4 h-4 fill-white shrink-0" />
              <span>Order via WhatsApp</span>
            </button>

            <p className="text-[11px] text-center text-[#8A7B6E] font-sans">
              We&apos;ll confirm your order and share a delivery slot on WhatsApp.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
