'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenStory?: () => void;
  onOpenContact?: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function Header({
  onOpenCart,
  onSelectCategory,
}: HeaderProps) {
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

  // ── Categories Dropdown State ─────────────────────────────────────────────
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCategoriesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCategoryClick = (categoryName: string, e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(categoryName);
      setCategoriesOpen(false);
      const targetEl = document.getElementById('products') || document.getElementById('shop');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCategoriesOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#122E1B]/95 backdrop-blur-md border-b border-[#E58A13]/20 transition-all duration-300 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── Brand Title + Wordmark on Left ── */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white border border-[#E58A13]/40 shrink-0 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/aranya-logo.png"
                  alt="Aranya Organic Dairy Farm Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors leading-none">
                  ARANYA
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.2em] text-[#E58A13] font-bold mt-1">
                  Organic Dairy
                </span>
              </div>
            </Link>
          </div>

          {/* ── Center Editorial Nav Links (desktop only) ── */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-medium text-[#FAF7F2] uppercase tracking-wider">
            <Link
              href="/products"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Shop</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>

            {/* ── Categories Interactive Dropdown ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center gap-1.5 group/nav cursor-pointer uppercase tracking-wider text-xs font-sans text-[#FAF7F2]"
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                aria-label="Toggle categories menu"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesOpen ? 'rotate-180 text-[#E58A13]' : 'text-[#FAF7F2]/70 group-hover/nav:text-[#E58A13]'
                  }`}
                />
                <span
                  className={`absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] transition-transform duration-200 origin-left ${
                    categoriesOpen ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                  }`}
                />
              </button>

              {/* Dropdown Menu below Categories button with 3 links */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ease-out origin-top ${
                  categoriesOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-72 bg-[#122E1B] border border-[#E58A13]/35 rounded-2xl shadow-2xl p-2.5 space-y-1 backdrop-blur-xl">
                  <div className="px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#E58A13]/80 border-b border-white/10 mb-1">
                    Browse by Category
                  </div>

                  {/* 1. Pure A2 Dairy */}
                  <a
                    href="/products?category=Dairy"
                    onClick={(e) => handleCategoryClick('Dairy', e)}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-[#1C3E25] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors">
                        Pure A2 Dairy
                      </span>
                      <span className="text-[10px] text-[#E58A13] font-sans font-bold uppercase tracking-wider">
                        Dairy
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A8B7AA] font-sans mt-0.5">
                      Raw milk, Bilona ghee &amp; butter
                    </span>
                  </a>

                  {/* 2. Heritage Rice & Millets */}
                  <a
                    href="/products?category=Rice%20%26%20Millets"
                    onClick={(e) => handleCategoryClick('Rice & Millets', e)}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-[#1C3E25] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors">
                        Heritage Rice &amp; Millets
                      </span>
                      <span className="text-[10px] text-[#B84A28] font-sans font-bold uppercase tracking-wider">
                        Grains
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A8B7AA] font-sans mt-0.5">
                      Traditional rice &amp; native millets
                    </span>
                  </a>

                  {/* 3. Organic Pulses & Lentils */}
                  <a
                    href="/products?category=Pulses%20%26%20Lentils"
                    onClick={(e) => handleCategoryClick('Pulses & Lentils', e)}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-[#1C3E25] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors">
                        Organic Pulses &amp; Lentils
                      </span>
                      <span className="text-[10px] text-[#E58A13] font-sans font-bold uppercase tracking-wider">
                        Pulses
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A8B7AA] font-sans mt-0.5">
                      Unpolished dals &amp; legumes
                    </span>
                  </a>

                  {/* All Products Showcase Link */}
                  <div className="pt-2 mt-1 border-t border-white/10">
                    <Link
                      href="/products"
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl text-xs font-sans font-bold text-[#FAF7F2] hover:bg-[#E58A13] hover:text-white transition-all uppercase tracking-wider"
                    >
                      <span>All Products Showcase</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/story"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Our Story</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
            <Link
              href="/contact"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Contact</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
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
