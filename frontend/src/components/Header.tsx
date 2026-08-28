'use client';

import React, { useState } from 'react';
import { Leaf, Phone, Menu, X, ShoppingBag } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[#1B4D2E]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-[#E5A93C]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1B4D2E] block leading-none">
                ARANYA
              </span>
              <span className="text-[11px] tracking-widest uppercase font-semibold text-[#7A5230] block mt-1">
                Organic Dairy Farm • Shoolagiri
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-[#1E293B]">
            <a href="#about" className="hover:text-[#1B4D2E] transition-colors py-1 relative group">
              Our 9-Yr Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#products" className="hover:text-[#1B4D2E] transition-colors py-1 relative group">
              A2 Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#process" className="hover:text-[#1B4D2E] transition-colors py-1 relative group">
              Hygiene Process
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#reviews" className="hover:text-[#1B4D2E] transition-colors py-1 relative group">
              Reviews
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-[#1B4D2E] transition-colors py-1 relative group">
              Farm Location
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1B4D2E] transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm font-semibold text-[#7A5230] bg-[#FAF7F2] px-3.5 py-2 rounded-full border border-[#7A5230]/20 hover:bg-[#1B4D2E] hover:text-white hover:border-[#1B4D2E] transition-all"
            >
              <Phone className="w-4 h-4 text-[#1B4D2E] group-hover:text-white" />
              <span>Call Farm</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I%20would%20like%20to%20order%20fresh%20A2%20milk!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#E5A93C]" />
              <span>Order Fresh Milk</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1B4D2E] hover:bg-[#E8F5E9] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#1B4D2E]/20 px-6 py-6 space-y-4 shadow-xl">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1E293B] hover:text-[#1B4D2E]"
          >
            Our 9-Year Story
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1E293B] hover:text-[#1B4D2E]"
          >
            A2 Milk & Products
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1E293B] hover:text-[#1B4D2E]"
          >
            Hygiene & Care Process
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1E293B] hover:text-[#1B4D2E]"
          >
            Justdial & Customer Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#1E293B] hover:text-[#1B4D2E]"
          >
            Contact & Farm Map
          </a>
          <div className="pt-4 border-t border-[#1B4D2E]/10 flex flex-col gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I%20would%20like%20to%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full py-3 rounded-xl font-bold text-center justify-center flex items-center gap-2"
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
