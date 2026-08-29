'use client';

import React from 'react';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[85vh] lg:min-h-[88vh] flex items-center justify-start overflow-hidden bg-[#1B4D2E]">
      
      {/* Full Bleed Nature Background Image generated for Aranya Dairy Farm */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nature_hero_pasture.jpg"
        alt="Aranya Organic Dairy Pasture in Shoolagiri"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gentle Dark Overlay Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full py-20">
        <div className="max-w-2xl space-y-8">
          
          {/* Dominant Headline matching Image 1: "Fresh flowers for any budget." */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#FCFAF7] leading-[1.1] tracking-tight drop-shadow-md">
            Pure A2 milk, <br />
            <span className="italic font-light">nurtured in nature.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#EAE6DF] font-sans font-normal leading-relaxed max-w-lg">
            Unprocessed A2 whole milk & traditional Bilona ghee from free-roaming, grass-fed cows in Shoolagiri. Delivered fresh every morning.
          </p>

          {/* Off-White Rectangular CTA Button matching Image 1 ("Shop Flowers") */}
          <div>
            <a
              href="#products"
              onClick={onShopClick}
              className="inline-block bg-[#FCFAF7] hover:bg-[#F2ECE7] text-[#1C241E] font-sans text-xs uppercase font-semibold tracking-widest px-8 py-4 shadow-lg transition-all duration-200"
            >
              Shop Fresh Milk
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
