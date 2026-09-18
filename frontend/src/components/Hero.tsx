'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick: _onShopClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[76vh] lg:min-h-[82vh] flex items-center justify-start overflow-hidden bg-[#122E1B]">

      {/* Full-bleed nature background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nature_hero_pasture.jpg"
        alt="Aranya Organic Dairy Pasture in Shoolagiri"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Overlay gradient — rich dark green vignette ensuring pristine text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30 sm:from-[#122E1B]/90 sm:via-[#122E1B]/70 sm:to-black/35" />

      {/* Content — Sequenced Entrance Animation */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10 w-full py-16 sm:py-24 pb-20 sm:pb-28">
        <div className="max-w-xl sm:max-w-2xl space-y-5 sm:space-y-6">

          {/* Hero headline */}
          <div className="space-y-2 animate-hero-headline">
            <span className="inline-block text-xs uppercase font-sans tracking-[0.25em] text-[#D48B16] font-bold">
              Shoolagiri, Tamil Nadu • Estd. 2017
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              <span className="block text-white font-serif font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                Aranya Organic
              </span>
              <span className="block italic font-light text-[#FAF7F2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Dairy Farm
              </span>
            </h1>
          </div>

          {/* One-line Sub-copy */}
          <p className="text-sm sm:text-base lg:text-lg text-[#F4EFEB] font-sans font-normal leading-relaxed max-w-sm sm:max-w-xl animate-hero-subtext">
            Pure A2 milk, traditional Bilona ghee, and natural farm provisions from free-roaming, grass-fed cows. Delivered fresh every morning.
          </p>

          {/* ONE primary CTA button: Shop Now */}
          <div className="pt-2 flex items-center animate-hero-cta">
            <Link
              href="/products"
              className="
                inline-flex items-center justify-center gap-2.5 text-center
                bg-[#D48B16] hover:bg-[#B8740D] active:scale-95
                text-white font-sans text-xs sm:text-sm uppercase font-bold tracking-widest
                px-8 sm:px-10 py-4 min-h-[52px] rounded-full
                shadow-2xl shadow-[#D48B16]/35 transition-all duration-200 touch-manipulation cursor-pointer group
              "
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
