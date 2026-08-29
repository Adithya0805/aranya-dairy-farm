'use client';

import React from 'react';
import { Leaf } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AnnouncementBannerProps {
  onLearnMore?: () => void;
}

export default function AnnouncementBanner({ onLearnMore }: AnnouncementBannerProps) {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="reveal-section bg-[#2C3E2B] text-[#FCFAF7] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-t border-b border-[#1B4D2E]/20"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        
        {/* Botanical Line Art Icon */}
        <div className="w-12 h-12 rounded-full bg-[#1C2A1C] border border-[#D99B26]/30 flex items-center justify-center shrink-0">
          <Leaf className="w-6 h-6 text-[#D99B26]" />
        </div>

        {/* Banner Text Statement matching Image 2 style */}
        <div className="space-y-1">
          <p className="font-serif text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-[#E9F0EA] tracking-wide">
            Here at Aranya, we nurture native grass-fed cows in Shoolagiri, source 100% raw A2 whole milk, and hand-churn traditional Bilona ghee.
          </p>
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-xs uppercase font-sans tracking-widest text-[#D99B26] hover:underline font-semibold pt-1 min-h-[44px] inline-flex items-center touch-manipulation"
            >
              Learn about our farm standards →
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
