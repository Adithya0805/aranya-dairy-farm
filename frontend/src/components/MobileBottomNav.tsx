'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileBottomNavProps {
  onOpenCart?: () => void;
  onOpenContact?: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MobileBottomNav({
  onOpenCart,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const isHome = pathname === '/';
  const isShop = pathname?.startsWith('/products');
  const isTrack = pathname?.startsWith('/track-order');

  return (
    <aside
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#122E1B]/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <nav className="grid grid-cols-4 items-center px-2 py-1.5" aria-label="Mobile Navigation Links">
        
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-all touch-manipulation min-h-[48px] active:scale-95 ${
            isHome ? 'text-[#D48B16] font-bold' : 'text-[#15321E] hover:text-[#D48B16]'
          }`}
          aria-label="Navigate to Home"
        >
          <Home className={`w-5 h-5 mb-0.5 ${isHome ? 'text-[#D48B16]' : 'text-[#15321E]'}`} />
          <span className="text-[10px] font-sans tracking-wider uppercase">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center py-1 transition-all touch-manipulation min-h-[48px] active:scale-95 ${
            isShop ? 'text-[#D48B16] font-bold' : 'text-[#15321E] hover:text-[#D48B16]'
          }`}
          aria-label="Navigate to Shop Products"
        >
          <ShoppingBag className={`w-5 h-5 mb-0.5 ${isShop ? 'text-[#D48B16]' : 'text-[#15321E]'}`} />
          <span className="text-[10px] font-sans tracking-wider uppercase">Shop</span>
        </Link>

        {/* 3. Track Order */}
        <Link
          href="/track-order"
          className={`flex flex-col items-center justify-center py-1 transition-all touch-manipulation min-h-[48px] active:scale-95 ${
            isTrack ? 'text-[#D48B16] font-bold' : 'text-[#15321E] hover:text-[#D48B16]'
          }`}
          aria-label="Track Order by ID"
        >
          <Truck className={`w-5 h-5 mb-0.5 ${isTrack ? 'text-[#D48B16]' : 'text-[#15321E]'}`} />
          <span className="text-[10px] font-sans tracking-wider uppercase">Track</span>
        </Link>

        {/* 4. Cart */}
        <button
          onClick={onOpenCart || openCart}
          className="relative flex flex-col items-center justify-center py-1 text-[#15321E] hover:text-[#D48B16] active:scale-95 transition-all touch-manipulation min-h-[48px] cursor-pointer"
          aria-label={`Open shopping cart, ${totalItems} items`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5 text-[#15321E]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#D48B16] text-white text-[9px] font-bold flex items-center justify-center font-sans animate-badge-pop">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Cart</span>
        </button>

      </nav>
    </aside>
  );
}
