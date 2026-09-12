'use client';

import React from 'react';
import { Award, Leaf, Clock, Star, ExternalLink } from 'lucide-react';
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
    {
      icon: Star,
      title: '3.6★ · 15 Reviews',
      description: 'Verified on Justdial • Genuine local reviews for our Shoolagiri farm & fresh dairy products.',
      href: 'https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET',
      isExternal: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="reveal-section bg-[#FAF7F2] border-b border-[#122E1B]/10 py-8 sm:py-12 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            const content = (
              <div
                className={`flex items-start gap-3.5 p-4 rounded-xl border border-transparent transition-all duration-200 h-full ${
                  badge.href
                    ? 'hover:bg-white hover:border-[#E58A13]/30 hover:shadow-md active:scale-[0.99] cursor-pointer group'
                    : 'hover:bg-white/60'
                }`}
              >
                {/* Line icon in warm turmeric-amber */}
                <div className="w-11 h-11 rounded-full bg-[#E58A13]/10 border border-[#E58A13]/25 flex items-center justify-center shrink-0">
                  <IconComponent
                    className={`w-5 h-5 text-[#E58A13] ${
                      badge.icon === Star ? 'fill-[#E58A13]/25' : ''
                    }`}
                  />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#15321E] flex items-center gap-1.5">
                    <span>{badge.title}</span>
                    {badge.isExternal && (
                      <ExternalLink className="w-3.5 h-3.5 text-[#8A7B6E] group-hover:text-[#E58A13] transition-colors shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6E62] leading-relaxed font-sans">
                    {badge.description}
                  </p>
                </div>
              </div>
            );

            if (badge.href) {
              return (
                <a
                  key={badge.title}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-hidden focus:ring-2 focus:ring-[#E58A13] rounded-xl"
                  aria-label="View Aranya Organic Dairy Farm reviews on Justdial"
                >
                  {content}
                </a>
              );
            }

            return <div key={badge.title}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
