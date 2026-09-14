'use client';

import React from 'react';
import { Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const JUSTDIAL_URL =
  'https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET';

export default function TestimonialsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="reveal-section py-16 sm:py-24 bg-[#FCFAF7] border-b border-[#122E1B]/10 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3 reveal-child" style={{ transitionDelay: '0ms' }}>
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
              Verified Feedback • Justdial Listed
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#15321E]">
              Trusted by families across Hosur &amp; Shoolagiri.
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
              We stand by transparent, unadulterated farm ethics. Explore real customer feedback and ratings on Justdial.
            </p>
          </div>

          {/* Justdial Verified Rating Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#122E1B]/15 shadow-sm space-y-3 shrink-0 max-w-sm reveal-child" style={{ transitionDelay: '100ms' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-md bg-[#122E1B] text-white font-sans font-bold text-sm flex items-center gap-1">
                  <span>3.6</span>
                  <Star className="w-3.5 h-3.5 fill-[#E58A13] text-[#E58A13]" />
                </div>
                <div className="text-xs font-sans font-bold text-[#15321E]">
                  15 Reviews
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-sans text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Business</span>
              </div>
            </div>

            <p className="text-xs text-[#5F6E62] font-sans leading-snug">
              Aranya Organic Dairy Farm, Shoolagiri listed on Justdial since June 2020.
            </p>

            <a
              href={JUSTDIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full text-center bg-[#FAF7F2] hover:bg-[#E58A13] hover:text-white border border-[#122E1B]/15 hover:border-[#E58A13] text-[#15321E] font-sans text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-full transition-all active:scale-[0.98] shadow-2xs"
            >
              <span>Read Reviews on Justdial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2 Core Verifiable Standards Spotlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#122E1B]/10 reveal-child hover:border-[#E58A13]/30 transition-all duration-200" style={{ transitionDelay: '180ms' }}>
            <div className="w-10 h-10 rounded-full bg-[#E58A13]/10 flex items-center justify-center text-[#E58A13] font-serif font-bold text-lg">
              A2
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#15321E]">
              Pure Raw Milk Delivery Since 2017
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
              Customers across Shoolagiri and Hosur depend on our uninterrupted morning doorstep delivery of unpasteurized, grass-fed A2 cow milk in eco glass bottles chilled to 4°C.
            </p>
          </div>

          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#122E1B]/10 reveal-child hover:border-[#E58A13]/30 transition-all duration-200" style={{ transitionDelay: '260ms' }}>
            <div className="w-10 h-10 rounded-full bg-[#E58A13]/10 flex items-center justify-center text-[#E58A13] font-serif font-bold text-lg">
              ★
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#15321E]">
              Vedic Bilona Curd-Churned Ghee
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
              Handcrafted in small batches from whole curd cream. Highly valued by local patrons for its rich golden granular texture, traditional nutty aroma, and strict absence of adulterants.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
