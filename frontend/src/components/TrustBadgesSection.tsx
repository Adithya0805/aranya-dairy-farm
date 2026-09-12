'use client';

import React from 'react';
import { Award, Leaf, Clock } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function TrustBadgesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const badges = [
    {
      icon: Award,
      title: '9 Years Trusted',
      description: 'Pioneering unadulterated Vedic organic dairy and farm ethics in Shoolagiri since 2017.',
    },
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'Native grass-fed Gir & Sahiwal cows with zero synthetic hormones or chemical fertilizers.',
    },
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Direct farm-to-table morning deliveries chilled to 4°C in sterilized eco glass bottles.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="reveal-section bg-[#FAF7F2] border-b border-[#122E1B]/10 py-10 sm:py-14 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/60 transition-colors duration-200"
              >
                {/* Line icon in warm turmeric-amber */}
                <div className="w-12 h-12 rounded-full bg-[#E58A13]/10 border border-[#E58A13]/25 flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6 text-[#E58A13]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#15321E]">
                    {badge.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6E62] leading-relaxed font-sans">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
