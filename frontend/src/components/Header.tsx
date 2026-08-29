'use client';

import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Header({ onOpenStory, onOpenContact }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#1B4D2E]/10 transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Text Navigation Links matching Image 1 layout */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-sans font-medium text-[#1C241E] uppercase tracking-wider">
            <a href="#products" className="hover:text-[#1B4D2E] transition-colors py-2">
              Shop
            </a>
            <button
              onClick={onOpenStory}
              className="hover:text-[#1B4D2E] transition-colors py-2 text-left cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[#1B4D2E] transition-colors py-2 text-left cursor-pointer"
            >
              Get in Touch
            </button>
            <a href="#gallery" className="hover:text-[#1B4D2E] transition-colors py-2">
              Gallery
            </a>
          </nav>

          {/* Center Brand Title matching Image 1 serif title ("Your Site Title" -> "ARANYA") */}
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

          {/* Right Action Links matching Image 1 layout (Login / Cart 0) */}
          <div className="hidden md:flex items-center gap-6 text-xs uppercase font-sans tracking-wider font-semibold text-[#1C241E]">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1B4D2E] transition-colors"
            >
              Login
            </a>
            <a
              href="#products"
              className="flex items-center gap-1.5 hover:text-[#1B4D2E] transition-colors bg-[#F2ECE7] py-2 px-3.5 rounded-full"
            >
              <ShoppingBag className="w-4 h-4 text-[#1C241E]" />
              <span>0</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCFAF7] border-b border-[#1B4D2E]/15 px-6 py-6 space-y-4 shadow-xl text-center">
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Shop Offerings
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenStory) onOpenStory();
            }}
            className="block w-full text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Our Story
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenContact) onOpenContact();
            }}
            className="block w-full text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Get in Touch
          </button>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm uppercase font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Gallery
          </a>
        </div>
      )}
    </header>
  );
}
