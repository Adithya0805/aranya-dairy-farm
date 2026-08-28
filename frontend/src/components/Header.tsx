'use client';

import React, { useState } from 'react';
import { Leaf, Phone, Menu, X, ShoppingBag } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[#1B4D2E]/10 transition-all duration-300 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5A93C]" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1B4D2E] block leading-none">
                ARANYA
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#7A5230] block mt-0.5 sm:mt-1">
                Organic Dairy Farm • Shoolagiri
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-[#1E293B]">
            <a href="#about" className="hover:text-[#1B4D2E] transition-colors py-2 relative group min-h-[44px] flex items-center">
              Our 9-Yr Story
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#products" className="hover:text-[#1B4D2E] transition-colors py-2 relative group min-h-[44px] flex items-center">
              A2 Products
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#process" className="hover:text-[#1B4D2E] transition-colors py-2 relative group min-h-[44px] flex items-center">
              Hygiene Process
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#reviews" className="hover:text-[#1B4D2E] transition-colors py-2 relative group min-h-[44px] flex items-center">
              Reviews
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-[#1B4D2E] transition-colors py-2 relative group min-h-[44px] flex items-center">
              Farm Location
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-3.5">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#7A5230] bg-[#FAF7F2] px-4 py-2.5 rounded-full border border-[#7A5230]/20 hover:bg-[#1B4D2E] hover:text-white hover:border-[#1B4D2E] transition-all min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-[#1B4D2E] group-hover:text-white" />
              <span>Call Farm</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I%20would%20like%20to%20order%20fresh%20A2%20milk!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4 text-[#E5A93C]" />
              <span>Order Fresh Milk</span>
            </a>
          </div>

          {/* Mobile Menu Button - 48x48px Touch Target */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-12 h-12 rounded-xl text-[#1B4D2E] hover:bg-[#E8F5E9] transition-colors flex items-center justify-center touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#1B4D2E]/20 px-4 py-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#1B4D2E]/10 hover:text-[#1B4D2E] transition-colors"
          >
            Our 9-Year Story
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#1B4D2E]/10 hover:text-[#1B4D2E] transition-colors"
          >
            A2 Milk & Products
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#1B4D2E]/10 hover:text-[#1B4D2E] transition-colors"
          >
            Hygiene & Care Process
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#1B4D2E]/10 hover:text-[#1B4D2E] transition-colors"
          >
            Justdial & Customer Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#1B4D2E]/10 hover:text-[#1B4D2E] transition-colors"
          >
            Contact & Farm Map
          </a>
          <div className="pt-4 border-t border-[#1B4D2E]/10 flex flex-col gap-3">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 min-h-[44px] py-3 rounded-xl font-semibold text-sm text-[#7A5230] bg-white border border-[#7A5230]/20"
            >
              <Phone className="w-4 h-4 text-[#1B4D2E]" />
              <span>Call Farm Directly</span>
            </a>
            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I%20would%20like%20to%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full min-h-[48px] py-3 rounded-xl font-bold text-center justify-center flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-[#4A3525]" />
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
