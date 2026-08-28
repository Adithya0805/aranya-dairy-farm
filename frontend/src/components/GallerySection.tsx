'use client';

import React from 'react';
import { Camera, Sun, Leaf, Shield, Award } from 'lucide-react';

export default function GallerySection() {
  const GALLERY_ITEMS = [
    {
      title: 'Chemical-Free Green Pastures',
      tag: 'Shoolagiri Farm',
      desc: 'Cows grazing under natural sunlight on organic herbal grasses.',
      bg: 'bg-emerald-800',
      emoji: '🌿',
    },
    {
      title: 'Free-Roaming Native Cows',
      tag: 'Ethical Care',
      desc: 'Zero tethering or stress — promoting high natural A2 protein content.',
      bg: 'bg-amber-900',
      emoji: '🐄',
    },
    {
      title: 'Sanitized Cold Chilling Unit',
      tag: '4°C Hygiene',
      desc: 'Rapid chilling within 30 minutes to lock in raw freshness.',
      bg: 'bg-[#1B4D2E]',
      emoji: '❄️',
    },
    {
      title: 'Sterilized Glass Bottling',
      tag: 'Zero Plastic',
      desc: 'Eco-friendly glass packaging delivered fresh every morning.',
      bg: 'bg-teal-900',
      emoji: '🥛',
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-organic text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-[#1B4D2E] shrink-0" />
            <span>Farm Life & Hygiene</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1B4D2E] tracking-tight">
            Inside Aranya Dairy Farm
          </h2>

          <p className="text-sm sm:text-base text-[#64748B]">
            Take a visual tour of our 9-year established organic farm in Shoolagiri, Hosur.
          </p>
        </div>

        {/* Gallery Grid - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#1B4D2E]/10 flex flex-col justify-between p-5 sm:p-6 bg-[#FAF7F2] min-h-[200px] sm:min-h-[260px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#1B4D2E]/20">
                  {item.tag}
                </span>
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
              </div>

              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1E293B] group-hover:text-[#1B4D2E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-12 sm:mt-16 bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#1B4D2E]/10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Sun className="w-6 h-6 text-[#E5A93C] mx-auto shrink-0" />
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1B4D2E]">100% Sunlight</div>
            <div className="text-xs text-[#64748B]">Pasture Raised</div>
          </div>
          <div className="space-y-1">
            <Leaf className="w-6 h-6 text-[#1B4D2E] mx-auto shrink-0" />
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1B4D2E]">Organic Fodder</div>
            <div className="text-xs text-[#64748B]">Zero Chemicals</div>
          </div>
          <div className="space-y-1">
            <Shield className="w-6 h-6 text-[#7A5230] mx-auto shrink-0" />
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1B4D2E]">A2 Certified</div>
            <div className="text-xs text-[#64748B]">Desi Cows</div>
          </div>
          <div className="space-y-1">
            <Award className="w-6 h-6 text-[#E5A93C] mx-auto shrink-0" />
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1B4D2E]">9+ Years</div>
            <div className="text-xs text-[#64748B]">Trusted in Hosur</div>
          </div>
        </div>

      </div>
    </section>
  );
}
