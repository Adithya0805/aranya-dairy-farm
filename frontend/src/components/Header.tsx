'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronDown, ArrowRight, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRIMARY_FARM_EMAIL, buildGmailComposeUrl } from '@/lib/contact';

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
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-xs font-sans font-medium text-[#FAF7F2] uppercase tracking-wider">
            <Link
              href="/products"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Shop</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>

            <Link
              href="/contact#visit"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>Farm Visit</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>

            <Link
              href="/story"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer"
            >
              <span>About</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>

            <Link
              href="/track-order"
              className="relative hover:text-[#E58A13] transition-colors py-3 min-h-[44px] flex items-center group/nav cursor-pointer text-[#E58A13] font-bold"
            >
              <span>Track Order</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-[#E58A13] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          </nav>

          {/* ── Right Actions (desktop) ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Email / Gmail Direct Action Button */}
            <a
              href={buildGmailComposeUrl({
                to: PRIMARY_FARM_EMAIL,
                subject: 'Inquiry — Aranya Organic Dairy Farm',
                body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to inquire about:',
              })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Email us at ${PRIMARY_FARM_EMAIL} via Gmail`}
              className="inline-flex items-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] border border-[#E58A13]/30 hover:border-[#E58A13]/70 active:scale-95 py-2 px-3.5 rounded-full transition-all duration-150 touch-manipulation min-h-[44px] cursor-pointer text-[#FAF7F2] text-xs font-sans font-semibold group shadow-xs"
              title="Compose inquiry in Gmail"
            >
              <Mail className="w-4 h-4 text-[#E58A13] group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Email Us</span>
              <span className="text-[10px] font-bold text-[#E58A13] bg-[#E58A13]/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Gmail
              </span>
            </a>

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

          {/* ── Minimal Sticky Mobile Top Header (Mail + Cart) ── */}
          <div className="md:hidden flex items-center gap-1.5">
            <a
              href={buildGmailComposeUrl({
                to: PRIMARY_FARM_EMAIL,
                subject: 'Mobile Inquiry — Aranya Organic Dairy Farm',
                body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to inquire about:',
              })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Farm via Gmail"
              className="w-11 h-11 flex items-center justify-center text-[#FAF7F2] hover:bg-white/10 active:scale-90 touch-manipulation rounded-full transition-all duration-150 cursor-pointer"
              title="Compose inquiry in Gmail"
            >
              <Mail className="w-5 h-5 text-[#E58A13]" />
            </a>

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
