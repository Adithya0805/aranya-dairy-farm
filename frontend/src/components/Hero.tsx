'use client';

import React from 'react';
import { Star, ExternalLink, ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[76vh] sm:min-h-[82vh] lg:min-h-[88vh] flex items-center justify-start overflow-hidden bg-[#122E1B]">

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
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10 w-full py-16 sm:py-24">
        <div className="max-w-xl sm:max-w-2xl space-y-5 sm:space-y-7">

          {/* Hero headline (0ms) */}
          <div className="space-y-2 animate-hero-headline">
            <span className="inline-block text-xs uppercase font-sans tracking-[0.25em] text-[#E58A13] font-bold">
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

          {/* Sub-copy (100ms stagger) */}
          <p className="text-sm sm:text-base lg:text-lg text-[#F4EFEB] font-sans font-normal leading-relaxed max-w-sm sm:max-w-xl animate-hero-subtext">
            Pure A2 milk, traditional Bilona ghee, and natural farm provisions from free-roaming, grass-fed cows. Delivered fresh every morning.
          </p>

          {/* Amber pill CTA button & Justdial rating badge (200ms stagger) */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-hero-cta">
            <a
              href="/products"
              className="
                inline-flex items-center justify-center gap-2 text-center
                bg-[#E58A13] hover:bg-[#CA7508] active:scale-95
                text-white font-sans text-xs sm:text-sm uppercase font-bold tracking-widest
                px-8 sm:px-9 py-4 min-h-[52px] rounded-full
                shadow-2xl shadow-[#E58A13]/35 transition-all duration-200 touch-manipulation cursor-pointer group
              "
            >
              <span>Explore All Farm Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Above-the-fold Justdial Social Proof Pill */}
            <a
              href="https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur-md border border-white/20 text-[#FAF7F2] text-xs font-sans transition-all duration-200 active:scale-95 group touch-manipulation shadow-md"
              aria-label="View Aranya Organic Dairy Farm 15 Reviews on Justdial"
            >
              <div className="flex items-center text-[#E58A13]">
                <Star className="w-3.5 h-3.5 fill-[#E58A13]" />
              </div>
              <span className="font-bold text-white">3.6★</span>
              <span className="text-[#FAF7F2]/80">· 15 Reviews on Justdial</span>
              <ExternalLink className="w-3 h-3 text-white/50 group-hover:text-white transition-colors ml-0.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
