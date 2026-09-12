'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Header({ onOpenCart, onOpenStory, onOpenContact }: HeaderProps) {
  const { totalItems } = useCart();

  // ── Cart badge pop animation ──────────────────────────────────────────────
  const [badgeAnimKey, setBadgeAnimKey] = useState(0);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setBadgeAnimKey((k) => k + 1);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-40 bg-[#122E1B]/95 backdrop-blur-md border-b border-[#E58A13]/20 transition-all duration-300 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── Brand Title + Wordmark on Left ── */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group py-2">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors">
                ARANYA
              </span>
              <span className="hidden sm:inline-block h-4 w-px bg-[#E58A13]/40" />
              <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.2em] text-[#E58A13] font-semibold">
                Organic Dairy
              </span>
            </a>
          </div>

          {/* ── Center Editorial Nav Links (desktop only) ── */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-medium text-[#FAF7F2] uppercase tracking-wider">
            <a
              href="#shop"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Shop</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </a>
            <a
              href="#categories"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Categories</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </a>
            <button
              onClick={onOpenStory}
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Our Story</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
            <button
              onClick={onOpenContact}
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Contact</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
          </nav>

          {/* ── Right Actions (desktop) ── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon with live amber badge */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] border border-[#E58A13]/30 active:scale-95 py-2 px-4 rounded-full transition-all duration-150 touch-manipulation min-h-[44px] cursor-pointer text-[#FAF7F2]"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-4 h-4 text-[#E58A13]" />
              <span className="text-xs font-semibold text-[#FAF7F2] font-sans">{totalItems}</span>
              {totalItems > 0 && (
                <span
                  key={badgeAnimKey}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E58A13] flex items-center justify-center animate-badge-pop"
                >
                  <span className="text-[9px] font-bold text-white leading-none">{totalItems > 9 ? '9+' : totalItems}</span>
                </span>
              )}
            </button>
          </div>

          {/* ── Minimal Sticky Mobile Top Header (Logo + Cart only) ── */}
          <div className="md:hidden flex items-center">
            <button
              onClick={onOpenCart}
              className="relative w-11 h-11 flex items-center justify-center text-[#FAF7F2] hover:bg-white/10 active:scale-90 touch-manipulation rounded-full transition-all duration-150 cursor-pointer"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-5 h-5 text-[#FAF7F2]" />
              {totalItems > 0 && (
                <span
                  key={`m-${badgeAnimKey}`}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E58A13] flex items-center justify-center animate-badge-pop"
                >
                  <span className="text-[9px] font-bold text-white leading-none">{totalItems > 9 ? '9+' : totalItems}</span>
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
