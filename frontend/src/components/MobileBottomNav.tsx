'use client';

import React from 'react';
import { ShoppingBag, LayoutGrid, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenContact: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MobileBottomNav({
  onOpenCart,
  onOpenContact,
}: MobileBottomNavProps) {
  const { totalItems } = useCart();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopClick = () => {
    scrollToSection('products');
  };

  const handleCategoriesClick = () => {
    scrollToSection('category-filters');
  };

  return (
    <aside
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-t border-[#1B4D2E]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <nav className="grid grid-cols-4 items-center px-2 py-1.5" aria-label="Mobile Navigation Links">
        {/* Shop */}
        <button
          onClick={handleShopClick}
          className="flex flex-col items-center justify-center py-1 text-[#1C241E] hover:text-[#1B4D2E] active:scale-95 transition-all touch-manipulation min-h-[48px]"
          aria-label="Navigate to Product Catalog"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5 text-[#1C241E]" />
          <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Shop</span>
        </button>

        {/* Categories */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center py-1 text-[#1C241E] hover:text-[#1B4D2E] active:scale-95 transition-all touch-manipulation min-h-[48px]"
          aria-label="Browse Product Categories"
        >
          <LayoutGrid className="w-5 h-5 mb-0.5 text-[#1C241E]" />
          <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Categories</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-[#1C241E] hover:text-[#1B4D2E] active:scale-95 transition-all touch-manipulation min-h-[48px]"
          aria-label={`Open shopping cart, ${totalItems} items`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5 text-[#1C241E]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#1B4D2E] text-white text-[9px] font-bold flex items-center justify-center font-sans animate-badge-pop">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Cart</span>
        </button>

        {/* Contact */}
        <button
          onClick={onOpenContact}
          className="flex flex-col items-center justify-center py-1 text-[#1C241E] hover:text-[#1B4D2E] active:scale-95 transition-all touch-manipulation min-h-[48px]"
          aria-label="Contact farm team"
        >
          <Phone className="w-5 h-5 mb-0.5 text-[#1C241E]" />
          <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Contact</span>
        </button>
      </nav>
    </aside>
  );
}
