'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';

export default function PersistentMobileCartBar() {
  const pathname = usePathname();
  const { totalItems, totalPrice, openCart } = useCart();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Only show when there are items in the cart
  const isVisible = totalItems > 0;

  return (
    <aside
      aria-label="Persistent Mobile Cart Summary"
      className={`
        md:hidden fixed left-0 right-0 z-40
        bg-[#15321E]/95 backdrop-blur-md text-white
        border-t border-[#E58A13]/40
        shadow-[0_-4px_25px_rgba(0,0,0,0.22)]
        px-4 py-2.5
        transition-all duration-300 ease-out
        ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-[120%] opacity-0 pointer-events-none'
        }
      `}
      style={{
        bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Left: Cart badge & total */}
        <button
          type="button"
          onClick={openCart}
          className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer touch-manipulation active:opacity-80"
          aria-label={`View cart with ${totalItems} item${totalItems === 1 ? '' : 's'}, total ${formatPrice(totalPrice)}`}
        >
          <div className="relative w-9 h-9 rounded-full bg-[#E58A13] flex items-center justify-center text-white shrink-0 shadow-sm animate-badge-pop">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-white text-[#15321E] text-[10px] font-bold flex items-center justify-center font-sans shadow-xs">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-sans font-bold text-[#FAF7F2] truncate">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
            <p className="text-[11px] font-sans font-semibold text-[#E58A13] leading-tight">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>
        </button>

        {/* Right: Open Cart CTA */}
        <button
          type="button"
          onClick={openCart}
          className="
            inline-flex items-center justify-center gap-1.5
            bg-[#E58A13] hover:bg-[#CA7508] active:scale-95
            text-white font-sans text-xs uppercase font-bold tracking-wider
            px-4 py-2 min-h-[40px] rounded-full
            shadow-md shadow-[#E58A13]/25 transition-all
            touch-manipulation cursor-pointer shrink-0
          "
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
