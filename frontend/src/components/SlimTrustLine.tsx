'use client';

import React from 'react';
import { Award, Leaf, Star, ShieldCheck } from 'lucide-react';

export default function SlimTrustLine() {
  return (
    <aside aria-label="Farm Trust Credentials" className="bg-[#FAF7F2] border-b border-[#122E1B]/10 py-3 sm:py-3.5 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-xs font-sans text-[#5F6E62]">
          <div className="inline-flex items-center gap-1.5 font-medium text-[#15321E]">
            <Award className="w-3.5 h-3.5 text-[#D48B16]" />
            <span>9+ Years Trusted</span>
          </div>
          <span className="text-[#122E1B]/20 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5 font-medium text-[#15321E]">
            <Leaf className="w-3.5 h-3.5 text-[#1B4D2E]" />
            <span>100% Grass-Fed Organic</span>
          </div>
          <span className="text-[#122E1B]/20 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5 font-medium text-[#15321E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D2E]" />
            <span>Pure Vedic Bilona</span>
          </div>
          <span className="text-[#122E1B]/20 hidden sm:inline">•</span>
          <a
            href="https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#D48B16] hover:underline"
          >
            <Star className="w-3.5 h-3.5 fill-[#D48B16]" />
            <span>3.6★ Justdial Verified</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
