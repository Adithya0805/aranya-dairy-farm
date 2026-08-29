'use client';

import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Header({ onOpenCart, onOpenStory, onOpenContact }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#1B4D2E]/10 transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Left Editorial Nav Links ── */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-medium text-[#1C241E] uppercase tracking-wider">
            <a href="#products" className="hover:text-[#1B4D2E] transition-colors py-2">
              Shop
            </a>
            <button
              onClick={onOpenStory}
              className="hover:text-[#1B4D2E] transition-colors py-2 cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[#1B4D2E] transition-colors py-2 cursor-pointer"
            >
              Get in Touch
            </button>
            <a href="#gallery" className="hover:text-[#1B4D2E] transition-colors py-2">
              Gallery
            </a>
          </nav>

          {/* ── Center Brand Title ── */}
          <div className="flex-1 md:flex-none text-center">
            <a href="#" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1C241E] group-hover:text-[#1B4D2E] transition-colors">
                ARANYA
              </span>
              <span className="block text-[9px] uppercase font-sans tracking-[0.25em] text-[#6B472B] -mt-1 font-medium">
                Organic Dairy
              </span>
            </a>
          </div>

          {/* ── Right Actions ── */}
          <div className="hidden md:flex items-center gap-4">
            {/*
              LOGIN BUTTON — intentionally hidden for Phase 1.
              Authentication/account system is planned for a future phase.
              Uncomment and wire up once auth is implemented.

              <button
                disabled
                className="text-xs uppercase font-sans tracking-wider font-semibold text-[#1C241E]/40 cursor-not-allowed"
                title="Login coming soon"
              >
                Login
              </button>
            */}

            {/* Cart Icon with Live Badge */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center gap-1.5 bg-[#F2ECE7] hover:bg-[#E8E1DA] py-2 px-4 rounded-full transition-colors touch-manipulation"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-4 h-4 text-[#1C241E]" />
              <span className="text-xs font-semibold text-[#1C241E] font-sans">{totalItems}</span>
              {/* Animated badge for when items are added */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1B4D2E] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white leading-none">{totalItems > 9 ? '9+' : totalItems}</span>
                </span>
              )}
            </button>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 flex items-center justify-center text-[#1C241E] touch-manipulation"
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#1B4D2E] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white leading-none">{totalItems > 9 ? '9+' : totalItems}</span>
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 text-[#1C241E] hover:bg-[#1B4D2E]/10 flex items-center justify-center rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCFAF7] border-b border-[#1B4D2E]/15 px-6 py-5 space-y-4 shadow-xl text-center">
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E] py-1"
          >
            Shop Offerings
          </a>
          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenStory) onOpenStory(); }}
            className="block w-full text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E] py-1"
          >
            Our Story
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); if (onOpenContact) onOpenContact(); }}
            className="block w-full text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E] py-1"
          >
            Get in Touch
          </button>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E] py-1"
          >
            Gallery
          </a>
        </div>
      )}
    </header>
  );
}
