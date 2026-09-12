'use client';

import React from 'react';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[85vh] lg:min-h-[88vh] flex items-center justify-start overflow-hidden bg-[#1B4D2E]">

      {/* Full-bleed nature background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nature_hero_pasture.jpg"
        alt="Aranya Organic Dairy Pasture in Shoolagiri"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Overlay gradient — stronger on mobile so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/10 sm:from-black/60 sm:via-black/40 sm:to-transparent" />

      {/* Content — animate-fade-in plays on load */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10 w-full py-16 sm:py-20">
        <div className="max-w-xl sm:max-w-2xl space-y-6 sm:space-y-8 animate-fade-in">

          {/* Hero headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#FCFAF7] leading-[1.1] tracking-tight drop-shadow-md">
            Pure A2 milk, <br />
            <span className="italic font-light">nurtured in nature.</span>
          </h1>

          {/* Sub-copy — slightly smaller on 320px screens */}
          <p className="text-sm sm:text-base lg:text-lg text-[#EAE6DF] font-sans font-normal leading-relaxed max-w-sm sm:max-w-lg">
            Unprocessed A2 whole milk &amp; traditional Bilona ghee from free-roaming, grass-fed cows in Shoolagiri. Delivered fresh every morning.
          </p>

          {/* CTA — full width on smallest phones, auto width from sm */}
          <div>
            <a
              href="#products"
              onClick={onShopClick}
              className="
                block sm:inline-block text-center
                bg-[#FCFAF7] hover:bg-[#F2ECE7]
                text-[#1C241E] font-sans text-xs uppercase font-semibold tracking-widest
                px-8 py-4 min-h-[48px] flex items-center justify-center sm:flex-none
                shadow-lg transition-all duration-200 touch-manipulation
                active:scale-95
              "
            >
              Shop Fresh Milk
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
