'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { submitOrderAction } from '@/app/actions/orders';
import { createOrder } from '@/lib/catalog';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartDrawer({ isOpen: externalIsOpen, onClose: externalOnClose }: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalPriceLabel,
    isCartOpen: contextIsOpen,
    closeCart: contextCloseCart,
    removeItem,
    updateQuantity,
    clearCart,
    buildWhatsAppMessage,
  } = useCart();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : contextIsOpen;
  const onClose = externalOnClose !== undefined ? externalOnClose : contextCloseCart;

  const [orderSent, setOrderSent] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState<string>('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generates a quick client fallback code if server is slow
  const generateLocalCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const message = buildWhatsAppMessage();
    const fallbackCode = generateLocalCode();
    const siteUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || '');

    const orderPayload = {
      items: items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        qty: i.quantity,
        price: i.product.price,
      })),
      total: items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0),
      whatsapp_message: message,
    };

    let confirmedCode = fallbackCode;

    try {
      // Fast submit to Supabase server action
      const res = await submitOrderAction(orderPayload);
      if (res.success && (res.orderCode || res.orderId)) {
        confirmedCode = res.orderCode || (res.orderId ? res.orderId.replace(/-/g, '').slice(0, 8).toUpperCase() : fallbackCode);
      } else {
        await createOrder(orderPayload);
      }
    } catch {
      try {
        await createOrder(orderPayload);
      } catch (err) {
        console.warn('[CartDrawer] Could not save order to Supabase:', err);
      }
    }

    const trackingLink = `${siteUrl}/track-order?code=${confirmedCode}`;
    const finalMessage =
      message +
      `\n\n─────────────────────\n📦 Order Code: #${confirmedCode}\n🔗 Track your order: ${trackingLink}\n─────────────────────`;

    const finalUrl = buildWhatsAppUrl(finalMessage);
    setLastOrderCode(confirmedCode);
    setLastWhatsAppUrl(finalUrl);

    // Deep link redirect to WhatsApp — NEVER blocked by browser popup blockers!
    if (typeof window !== 'undefined') {
      window.location.href = finalUrl;
    }

    clearCart();
    setIsSubmitting(false);
    setOrderSent(true);
  };

  const handleClose = () => {
    setOrderSent(false);
    setIsSubmitting(false);
    onClose();
  };

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // prevent background scroll on iOS
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[9999] pointer-events-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ──
          Mobile:  full-width bottom sheet, slides up from bottom, 92dvh tall
          sm+:     right sidebar, slides in from right, full height
          300ms ease-in-out on transform — GPU-accelerated, no jank            */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`
          fixed z-10 bg-[#FAF7F2] flex flex-col shadow-2xl
          /* Mobile bottom sheet */
          bottom-0 left-0 right-0
          h-[92dvh]
          rounded-t-3xl
          /* Desktop right sidebar */
          sm:bottom-auto sm:top-0 sm:left-auto sm:right-0
          sm:h-full sm:w-[440px] sm:max-w-[95vw]
          sm:rounded-none
          /* Transition — transform only (GPU) */
          transition-transform duration-300 ease-in-out
          ${isOpen
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full pointer-events-none'
          }
        `}
      >

        {/* Mobile drag handle indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1 rounded-full bg-[#122E1B]/20" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#122E1B]/10 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E58A13]" />
            <h2 className="font-serif text-xl font-bold text-[#15321E]">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-sans font-medium text-[#B84A28]">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#15321E] hover:bg-[#122E1B]/8 active:scale-95 transition-all touch-manipulation cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">

          {/* Order Sent Confirmation */}
          {orderSent ? (
            <div className="flex flex-col items-center justify-center h-full px-6 sm:px-8 text-center space-y-5 py-8">
              <div className="w-16 h-16 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-[#1B4D2E]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#1C241E] font-bold">Order Forwarded to WhatsApp!</h3>
                {lastOrderCode && (
                  <p className="text-xs font-mono font-bold text-[#1B4D2E] bg-[#1B4D2E]/10 px-3 py-1 rounded-full inline-block">
                    Order Code: #{lastOrderCode}
                  </p>
                )}
                <p className="text-sm text-[#57655B] leading-relaxed max-w-sm mx-auto">
                  We&apos;ll confirm your order and delivery schedule on WhatsApp shortly. 🙏
                </p>
              </div>

              {lastWhatsAppUrl && (
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB055] text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Re-open WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleClose}
                className="mt-2 border border-[#1C241E] text-[#1C241E] hover:bg-[#1C241E] hover:text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5 rounded-full transition-colors touch-manipulation cursor-pointer"
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
                <p className="text-sm text-[#57655B]">Add some fresh A2 dairy products to get started.</p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 border border-[#1C241E] text-[#1C241E] hover:bg-[#1C241E] hover:text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5 rounded-full transition-colors touch-manipulation cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          ) : (
            /* Cart Items List */
            <ul className="divide-y divide-[#1B4D2E]/8 px-4 sm:px-5 pt-1 pb-4">
              {items.map(({ product, quantity }) => {
                const lineTotal = product.price !== null
                  ? `₹${(product.price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : 'Price updating soon';
                return (
                  <li key={product.id} className="py-4 flex gap-3 sm:gap-4">

                    {/* Product image — fixed square */}
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-[#EAE6DF] rounded-xl flex items-center justify-center p-1 border border-[#122E1B]/10">
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

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-serif text-base text-[#1C241E] leading-snug">{product.name}</p>
                          {product.nameTamil && (
                            <p className="text-[12px] text-[#1B4D2E] font-medium font-sans">{product.nameTamil}</p>
                          )}
                          <p className="text-[11px] text-[#8A7B6E] font-sans truncate">{product.unit}</p>
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-10 h-10 flex items-center justify-center text-[#8A7B6E] hover:text-red-500 active:scale-90 transition-all duration-150 shrink-0 touch-manipulation rounded-full cursor-pointer"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#1B4D2E]/20 rounded-full overflow-hidden bg-[#FAF7F2]">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/10 active:scale-90 transition-all duration-150 touch-manipulation cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#1C241E] font-sans select-none">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/10 active:scale-90 transition-all duration-150 touch-manipulation cursor-pointer"
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
          <div
            className="shrink-0 border-t border-[#122E1B]/10 bg-[#FAF7F2] px-5 sm:px-6 pt-4 pb-safe-4 space-y-3.5"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Running Total */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-[#5F6E62] uppercase tracking-wider text-xs font-semibold">
                Order Total
              </span>
              <span className="font-serif text-2xl text-[#15321E] font-bold">{totalPriceLabel}</span>
            </div>
            <p className="text-[11px] text-[#8A7B6E] font-sans -mt-2">
              Delivery charges calculated at confirmation.
            </p>

            {/* WhatsApp Checkout Button */}
            <button
              onClick={handleWhatsAppCheckout}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1FB055] active:bg-[#18943E] disabled:opacity-60 text-white font-sans text-sm font-bold py-4 min-h-[52px] rounded-full shadow-lg shadow-[#25D366]/20 transition-all touch-manipulation active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white shrink-0" />
              <span>{isSubmitting ? 'Opening WhatsApp...' : 'Order via WhatsApp'}</span>
            </button>

            <p className="text-[11px] text-center text-[#5F6E62] font-sans">
              We&apos;ll confirm your order and share a delivery slot on WhatsApp.
            </p>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
