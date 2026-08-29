'use client';

import React, { useState } from 'react';
import {
  Leaf,
  Phone,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import { WHATSAPP_TEL, WHATSAPP_DISPLAY, WA_GENERAL_ORDER } from '@/lib/whatsapp';


interface HubHeroProps {
  onSelectSection: (sectionId: string) => void;
}

export default function HubHero({ onSelectSection }: HubHeroProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'about', label: 'Our 9-Yr Story' },
    { id: 'products', label: 'A2 Products' },
    { id: 'process', label: 'Hygiene Process' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Farm Location' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between relative overflow-hidden w-full">
      {/* Top Header / Clean Nav Bar */}
      <header className="relative z-30 bg-[#1B4D2E] text-white border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#E5A93C] flex items-center justify-center text-[#4A3525] shrink-0">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white block leading-none">
                ARANYA
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#D1E8D5] block mt-0.5">
                Organic Dairy Farm
              </span>
            </div>
          </a>

          {/* Simple Desktop Nav Links (Plain Text, No Badges, No Boxes) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#FAF7F2]">
            {NAV_ITEMS.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <span className="text-white/30 text-xs">|</span>}
                <button
                  onClick={() => onSelectSection(item.id)}
                  className="hover:text-[#E5A93C] transition-colors py-2 relative group focus:outline-none"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E5A93C] transition-all group-hover:w-full" />
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Right Action - Direct Phone */}
          <div className="hidden md:flex items-center">
            <a
              href={WHATSAPP_TEL}
              className="text-xs font-semibold text-[#D1E8D5] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-10 h-10 rounded-lg text-white hover:bg-white/10 flex items-center justify-center touch-manipulation"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Links */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#163E25] border-t border-white/10 py-4 px-4 space-y-1 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileNavOpen(false);
                  onSelectSection(item.id);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-[#E5A93C] rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero Visual Section */}
      <section className="relative bg-[#1B4D2E] text-white py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Visual Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D2E]/95 via-[#1B4D2E]/90 to-[#25663E]/85 z-10" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E5A93C]/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#E8F5E9]/10 blur-3xl pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto relative z-20 text-center space-y-5 animate-fade-in-up">
          {/* Tagline */}
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#E5A93C] uppercase block">
            Established 2017 • Shoolagiri, Hosur
          </span>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#FAF7F2] leading-tight">
            9 Years of Pure, Organic Dairy in Shoolagiri
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-lg text-[#D1E8D5] max-w-2xl mx-auto leading-relaxed px-2">
            Experience the unadulterated taste of 100% natural, grass-fed A2 milk and Vedic Bilona Ghee straight from our chemical-free pastures.
          </p>

          {/* Minimal Inline Top Nav (Alternative In-Hero Placement) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-[#FAF7F2]">
            {NAV_ITEMS.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <span className="text-white/30 hidden sm:inline">|</span>}
                <button
                  onClick={() => onSelectSection(item.id)}
                  className="hover:text-[#E5A93C] transition-colors py-1 relative group focus:outline-none underline sm:no-underline"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E5A93C] transition-all group-hover:w-full" />
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Hero CTAs (Kept Unchanged) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <a
              href={WA_GENERAL_ORDER}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>Quick Order on WhatsApp</span>
            </a>
            <a
              href={WHATSAPP_TEL}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 border border-white/20 transition-all w-full sm:w-auto min-h-[48px]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Call Farm</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer minimal info */}
      <footer className="py-4 text-center text-xs text-[#64748B] border-t border-[#1B4D2E]/10 bg-white">
        © {new Date().getFullYear()} Aranya Organic Dairy Farm, Shoolagiri, Hosur, Tamil Nadu.
      </footer>
    </div>
  );
}
