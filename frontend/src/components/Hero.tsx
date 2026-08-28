'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-[#1B4D2E] text-white pt-20 pb-28 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden w-full">
      {/* Editorial High-Resolution Background Imagery Simulation with Soft Tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#25663E] via-[#1B4D2E] to-[#11331E] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 animate-fade-in">
        
        {/* Dominant Large Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#FCFAF7] leading-tight sm:leading-none tracking-tight">
          Pure A2 Milk, <br className="hidden sm:block" />
          Nurtured in Shoolagiri.
        </h1>

        {/* Short Subline */}
        <p className="text-base sm:text-xl text-[#D1E8D5] max-w-2xl mx-auto font-sans font-normal leading-relaxed">
          Unprocessed A2 whole milk and traditional Bilona ghee from free-roaming, grass-fed cows. Delivered fresh to your doorstep every morning.
        </p>

        {/* ONE Single Primary Action Button */}
        <div className="pt-6 flex justify-center">
          <a
            href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20fresh%20A2%20milk!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-single shadow-xl"
          >
            <span>Order Fresh A2 Milk</span>
            <ArrowRight className="w-4 h-4 text-[#D99B26]" />
          </a>
        </div>

      </div>
    </section>
  );
}
