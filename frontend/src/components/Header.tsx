'use client';

import React, { useState } from 'react';
import { Leaf, Phone, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#1B4D2E]/10 transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-[#D99B26]" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1B4D2E] block leading-none">
                ARANYA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-sans font-medium text-[#6B472B] block mt-1">
                Organic Dairy • Shoolagiri
              </span>
            </div>
          </a>

          {/* Editorial Text Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1C241E]">
            <a href="#about" className="hover:text-[#1B4D2E] transition-colors py-2 relative group">
              <span>Our Story</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full" />
            </a>
            <a href="#products" className="hover:text-[#1B4D2E] transition-colors py-2 relative group">
              <span>Products</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full" />
            </a>
            <a href="#process" className="hover:text-[#1B4D2E] transition-colors py-2 relative group">
              <span>Hygiene Process</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full" />
            </a>
            <a href="#reviews" className="hover:text-[#1B4D2E] transition-colors py-2 relative group">
              <span>Reviews</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full" />
            </a>
            <a href="#contact" className="hover:text-[#1B4D2E] transition-colors py-2 relative group">
              <span>Location</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full" />
            </a>
          </nav>

          {/* Right Direct Call Link */}
          <div className="hidden lg:flex items-center">
            <a
              href="tel:+919876543210"
              className="text-xs font-semibold text-[#1B4D2E] hover:underline flex items-center gap-1.5 py-2 px-3"
            >
              <Phone className="w-4 h-4 text-[#1B4D2E]" />
              <span>+91 98765 43210</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 rounded-lg text-[#1B4D2E] hover:bg-[#1B4D2E]/10 flex items-center justify-center touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Links */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCFAF7] border-b border-[#1B4D2E]/15 px-6 py-6 space-y-4 shadow-xl">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Our Story
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Products (Coming Soon)
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Hygiene & Cold-Chain
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Customer Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1C241E] hover:text-[#1B4D2E]"
          >
            Farm Location & Contact
          </a>
          <div className="pt-4 border-t border-[#1B4D2E]/10">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm font-semibold text-[#1B4D2E]"
            >
              <Phone className="w-4 h-4" />
              <span>Call Farm: +91 98765 43210</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
