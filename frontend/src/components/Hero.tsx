'use client';

import React from 'react';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[82vh] sm:min-h-[86vh] lg:min-h-[90vh] flex items-center justify-start overflow-hidden bg-[#122E1B]">

      {/* Full-bleed nature background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nature_hero_pasture.jpg"
        alt="Aranya Organic Dairy Pasture in Shoolagiri"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Overlay gradient — rich dark green vignette ensuring pristine text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25 sm:from-[#122E1B]/85 sm:via-[#122E1B]/60 sm:to-black/30" />

      {/* Content — animate-fade-in plays on load */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10 w-full py-20 sm:py-24">
        <div className="max-w-xl sm:max-w-2xl space-y-6 sm:space-y-8 animate-fade-in">

          {/* Hero headline */}
          <div className="space-y-2">
            <span className="inline-block text-xs uppercase font-sans tracking-[0.25em] text-[#E58A13] font-bold">
              Shoolagiri, Tamil Nadu • Estd. 2017
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#FAF7F2] leading-[1.1] tracking-tight drop-shadow-md">
              Aranya Organic <br />
              <span className="italic font-light text-[#FAF7F2]">Dairy Farm</span>
            </h1>
          </div>

          {/* Sub-copy — readable and balanced */}
          <p className="text-sm sm:text-base lg:text-lg text-[#F4EFEB] font-sans font-normal leading-relaxed max-w-sm sm:max-w-xl">
            Pure A2 milk, traditional Bilona ghee, and natural farm provisions from free-roaming, grass-fed cows. Delivered fresh every morning.
          </p>

          {/* Single amber/gold pill CTA button */}
          <div className="pt-2">
            <a
              href="#shop"
              onClick={onShopClick}
              className="
                inline-flex items-center justify-center text-center
                bg-[#E58A13] hover:bg-[#CA7508] active:scale-95
                text-white font-sans text-xs uppercase font-bold tracking-widest
                px-9 py-4 min-h-[50px] rounded-full
                shadow-xl shadow-[#E58A13]/25 transition-all duration-200 touch-manipulation cursor-pointer
              "
            >
              Shop Our Products
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
