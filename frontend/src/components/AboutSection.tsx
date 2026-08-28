'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FCFAF7] border-b border-[#1B4D2E]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        
        {/* Block 1: Our 9-Year Legacy (Photo Left, Text Right) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Editorial Visual Container */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#1B4D2E] aspect-[4/3] flex items-center justify-center p-8 text-center text-white shadow-sm">
              <div className="space-y-3 relative z-10">
                <div className="text-6xl sm:text-7xl">🐄</div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#FCFAF7]">
                  Free-Roaming Pastures
                </div>
                <p className="text-xs text-[#D1E8D5] max-w-xs mx-auto">
                  Shoolagiri, Hosur, Tamil Nadu
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
              Established 2017 in Shoolagiri
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E] leading-tight">
              Nine years of uncompromised organic pureness.
            </h2>

            <p className="text-sm sm:text-base text-[#57655B] leading-relaxed">
              At Aranya Organic Dairy Farm, true health begins with how cows are nurtured. For nearly a decade, we have stayed committed to traditional farming — zero synthetic hormones, zero antibiotics, and zero dilution.
            </p>

            <div>
              <a href="#contact" className="link-editorial">
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Block 2: Cold-Chain Hygiene Process (Text Left, Photo Right) */}
        <div id="process" className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Editorial Text Block */}
          <div className="lg:col-span-6 lg:order-1 space-y-6">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
              4-Step Cold-Chain Guarantee
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E] leading-tight">
              Chilled to 4°C within 30 minutes of milking.
            </h2>

            <p className="text-sm sm:text-base text-[#57655B] leading-relaxed">
              Our milk is never stored in plastic. From hands-free sanitized milking to instant chilling and eco glass bottle packaging, every step protects raw enzymes and natural vitamins.
            </p>

            <div>
              <a href="#contact" className="link-editorial">
                <span>Discover Cold-Chain Process</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Editorial Visual Container */}
          <div className="lg:col-span-6 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden bg-[#3A271C] aspect-[4/3] flex items-center justify-center p-8 text-center text-white shadow-sm">
              <div className="space-y-3 relative z-10">
                <div className="text-6xl sm:text-7xl">🥛</div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#FCFAF7]">
                  Eco Glass Bottling
                </div>
                <p className="text-xs text-[#E8ECE9]/80 max-w-xs mx-auto">
                  Zero Plastic • Daily Morning Delivery
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
