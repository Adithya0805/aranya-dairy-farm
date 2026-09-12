'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function TestimonialsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const SPOTLIGHT_QUOTES = [
    {
      name: 'Ramesh Sundaram',
      location: 'Hosur Town',
      quote: 'Switched to Aranya A2 milk 8 months ago for my children. The thick cream layer and sweet natural aroma remind me of village dairy.',
    },
    {
      name: 'Priya Krishnan',
      location: 'Shoolagiri',
      quote: 'Their Bilona Cow Ghee is unmatched! You can see the golden granular texture. Knowing the cows are raised ethically right here in Shoolagiri gives total peace of mind.',
    },
  ];

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="reveal-section py-20 sm:py-28 bg-white border-b border-[#1B4D2E]/10 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
            Verified Local Feedback
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E]">
            Trusted by families across Hosur &amp; Shoolagiri.
          </h2>
        </div>

        {/* Full-Width Alternating Spotlight Quote Blocks */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16">
          {SPOTLIGHT_QUOTES.map((item, idx) => (
            <div
              key={idx}
              className="space-y-6 bg-[#FCFAF7] p-6 sm:p-10 rounded-3xl border border-[#1B4D2E]/10 hover:border-[#1B4D2E]/25 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 animate-card-reveal"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="text-4xl text-[#1B4D2E] font-serif font-bold">
                &ldquo;
              </div>
              <p className="text-base sm:text-lg font-serif text-[#1C241E] leading-relaxed italic">
                {item.quote}
              </p>
              <div className="pt-4 border-t border-[#1B4D2E]/10 flex items-center justify-between">
                <div>
                  <div className="font-sans font-bold text-sm text-[#1B4D2E]">{item.name}</div>
                  <div className="text-xs text-[#57655B]">{item.location}</div>
                </div>
                <a href="#contact" className="link-editorial min-h-[44px] inline-flex items-center touch-manipulation">
                  <span>Contact Farm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
