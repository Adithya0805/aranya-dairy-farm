'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, LayoutGrid, ShoppingCart, Phone, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenContact?: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function MobileBottomNav({
  onOpenCart,
  onOpenContact: _onOpenContact,
  onSelectCategory,
}: MobileBottomNavProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleShopClick = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/products');
    }
  };

  const handleCategoryItemClick = (cat: string) => {
    setSheetOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
      const el = document.getElementById('category-filters') || document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(`/products?category=${encodeURIComponent(cat)}`);
  };

  return (
    <>
      {/* Category Selection Bottom Sheet for Mobile */}
      {sheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSheetOpen(false)} />
          <div className="relative w-full bg-[#122E1B] border-t border-[#E58A13]/35 rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom duration-250">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-serif text-lg font-bold text-[#FAF7F2]">
                Explore Farm Categories
              </span>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-full bg-white/5 active:scale-95"
                aria-label="Close categories sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleCategoryItemClick('Dairy')}
                className="w-full text-left p-3 rounded-xl bg-[#1C3E25] hover:bg-[#244F30] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-serif text-sm font-bold text-[#FAF7F2]">
                    Pure A2 Dairy
                  </div>
                  <div className="text-[11px] text-[#A8B7AA] font-sans">
                    Raw A2 milk, Bilona ghee &amp; butter
                  </div>
                </div>
                <span className="text-[10px] font-sans uppercase font-bold text-[#E58A13] bg-[#E58A13]/10 px-2 py-0.5 rounded">
                  Dairy
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryItemClick('Rice & Millets')}
                className="w-full text-left p-3 rounded-xl bg-[#1C3E25] hover:bg-[#244F30] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-serif text-sm font-bold text-[#FAF7F2]">
                    Heritage Rice &amp; Millets
                  </div>
                  <div className="text-[11px] text-[#A8B7AA] font-sans">
                    Traditional rice &amp; native millets
                  </div>
                </div>
                <span className="text-[10px] font-sans uppercase font-bold text-[#B84A28] bg-[#B84A28]/15 px-2 py-0.5 rounded">
                  Grains
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryItemClick('Pulses & Lentils')}
                className="w-full text-left p-3 rounded-xl bg-[#1C3E25] hover:bg-[#244F30] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-serif text-sm font-bold text-[#FAF7F2]">
                    Organic Pulses &amp; Lentils
                  </div>
                  <div className="text-[11px] text-[#A8B7AA] font-sans">
                    Unpolished dals &amp; legumes
                  </div>
                </div>
                <span className="text-[10px] font-sans uppercase font-bold text-[#E58A13] bg-[#E58A13]/10 px-2 py-0.5 rounded">
                  Pulses
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/products"
                onClick={() => setSheetOpen(false)}
                className="w-full py-3 px-4 rounded-full bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>View All Products Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <aside
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#122E1B]/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <nav className="grid grid-cols-4 items-center px-2 py-1.5" aria-label="Mobile Navigation Links">
          {/* Shop */}
          <button
            onClick={handleShopClick}
            className="flex flex-col items-center justify-center py-1 text-[#15321E] hover:text-[#E58A13] active:scale-95 transition-all touch-manipulation min-h-[48px]"
            aria-label="Navigate to Product Catalog"
          >
            <ShoppingBag className="w-5 h-5 mb-0.5 text-[#15321E]" />
            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Shop</span>
          </button>

          {/* Categories Button */}
          <button
            onClick={() => setSheetOpen((prev) => !prev)}
            className="flex flex-col items-center justify-center py-1 text-[#15321E] hover:text-[#E58A13] active:scale-95 transition-all touch-manipulation min-h-[48px]"
            aria-label="Browse Product Categories"
          >
            <LayoutGrid className="w-5 h-5 mb-0.5 text-[#15321E]" />
            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Categories</span>
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative flex flex-col items-center justify-center py-1 text-[#15321E] hover:text-[#E58A13] active:scale-95 transition-all touch-manipulation min-h-[48px]"
            aria-label={`Open shopping cart, ${totalItems} items`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 mb-0.5 text-[#15321E]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E58A13] text-white text-[9px] font-bold flex items-center justify-center font-sans animate-badge-pop">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Cart</span>
          </button>

          {/* Contact */}
          <Link
            href="/contact"
            className="flex flex-col items-center justify-center py-1 text-[#15321E] hover:text-[#E58A13] active:scale-95 transition-all touch-manipulation min-h-[48px]"
            aria-label="Open contact information"
          >
            <Phone className="w-5 h-5 mb-0.5 text-[#15321E]" />
            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">Contact</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
