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
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#1B4D2E]/10 transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── Left Editorial Nav Links (desktop only) ── */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-medium text-[#1C241E] uppercase tracking-wider">
            <a
              href="#products"
              className="hover:text-[#1B4D2E] transition-colors py-3 min-h-[44px] flex items-center"
            >
              Shop
            </a>
            <button
              onClick={onOpenStory}
              className="hover:text-[#1B4D2E] transition-colors py-3 min-h-[44px] flex items-center cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[#1B4D2E] transition-colors py-3 min-h-[44px] flex items-center cursor-pointer"
            >
              Get in Touch
            </button>
            <a
              href="#gallery"
              className="hover:text-[#1B4D2E] transition-colors py-3 min-h-[44px] flex items-center"
            >
              Gallery
            </a>
          </nav>

          {/* ── Brand Title ── */}
          <div className="flex-1 md:flex-none text-left md:text-center">
            <a href="#" className="inline-block group py-2">
              <span className="font-serif text-xl sm:text-3xl font-normal tracking-tight text-[#1C241E] group-hover:text-[#1B4D2E] transition-colors">
                ARANYA
              </span>
              <span className="block text-[9px] uppercase font-sans tracking-[0.25em] text-[#6B472B] -mt-0.5 font-medium">
                Organic Dairy
              </span>
            </a>
          </div>

          {/* ── Right Actions (desktop) ── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon with live badge */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center gap-1.5 bg-[#F2ECE7] hover:bg-[#E8E1DA] py-2 px-4 rounded-full transition-colors touch-manipulation min-h-[44px]"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-4 h-4 text-[#1C241E]" />
              <span className="text-xs font-semibold text-[#1C241E] font-sans">{totalItems}</span>
              {totalItems > 0 && (
                <span
                  key={badgeAnimKey}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1B4D2E] flex items-center justify-center animate-badge-pop"
                >
                  <span className="text-[9px] font-bold text-white leading-none">{totalItems > 9 ? '9+' : totalItems}</span>
                </span>
              )}
            </button>
          </div>

          {/* ── Minimal Sticky Mobile Top Header (Logo + Cart only; nav is in persistent bottom bar) ── */}
          <div className="md:hidden flex items-center">
            <button
              onClick={onOpenCart}
              className="relative w-11 h-11 flex items-center justify-center text-[#1C241E] hover:bg-[#1B4D2E]/8 touch-manipulation rounded-full transition-colors"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-5 h-5 text-[#1C241E]" />
              {totalItems > 0 && (
                <span
                  key={`m-${badgeAnimKey}`}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1B4D2E] flex items-center justify-center animate-badge-pop"
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
