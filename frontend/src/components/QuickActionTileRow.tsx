'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, CalendarDays, Bot, Sparkles, ArrowUpRight } from 'lucide-react';

interface QuickActionTileRowProps {
  onOpenFarmAI?: () => void;
}

export default function QuickActionTileRow({ onOpenFarmAI }: QuickActionTileRowProps) {
  const handleFarmAIClick = () => {
    if (onOpenFarmAI) {
      onOpenFarmAI();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-farm-ai'));
    }
  };

  return (
    <section
      aria-label="Quick Action Navigation"
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-8 sm:mb-12"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

        {/* 1. Shop Products */}
        <Link
          href="/products"
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#122E1B]/15 hover:border-[#D48B16]/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.98] min-h-[96px] sm:min-h-[110px] cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#D48B16]/10 border border-[#D48B16]/25 flex items-center justify-center text-[#D48B16] group-hover:scale-105 group-hover:bg-[#D48B16] group-hover:text-white transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8A7B6E] group-hover:text-[#D48B16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="mt-3">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#15321E] group-hover:text-[#D48B16] transition-colors leading-tight">
              Shop Products
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5F6E62] font-sans mt-0.5">
              Fresh A2 Milk &amp; Ghee
            </p>
          </div>
        </Link>

        {/* 2. Track My Order */}
        <Link
          href="/track-order"
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#122E1B]/15 hover:border-[#D48B16]/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.98] min-h-[96px] sm:min-h-[110px] cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#15321E]/10 border border-[#15321E]/20 flex items-center justify-center text-[#15321E] group-hover:scale-105 group-hover:bg-[#15321E] group-hover:text-[#FAF7F2] transition-all">
              <Truck className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8A7B6E] group-hover:text-[#15321E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="mt-3">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#15321E] group-hover:text-[#D48B16] transition-colors leading-tight">
              Track My Order
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5F6E62] font-sans mt-0.5">
              Live status by Order Code
            </p>
          </div>
        </Link>

        {/* 3. Book a Farm Visit */}
        <Link
          href="/contact#visit"
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#122E1B]/15 hover:border-[#D48B16]/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.98] min-h-[96px] sm:min-h-[110px] cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1B4D2E]/10 border border-[#1B4D2E]/25 flex items-center justify-center text-[#1B4D2E] group-hover:scale-105 group-hover:bg-[#1B4D2E] group-hover:text-white transition-all">
              <CalendarDays className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8A7B6E] group-hover:text-[#1B4D2E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="mt-3">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#15321E] group-hover:text-[#D48B16] transition-colors leading-tight">
              Book a Farm Visit
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5F6E62] font-sans mt-0.5">
              Experience Shoolagiri
            </p>
          </div>
        </Link>

        {/* 4. Ask Farm AI */}
        <button
          type="button"
          onClick={handleFarmAIClick}
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#15321E] text-white border border-[#E58A13]/40 hover:border-[#E58A13] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.98] min-h-[96px] sm:min-h-[110px] text-left cursor-pointer"
          aria-label="Open Ask Farm AI Chat Assistant"
        >
          <div className="flex items-start justify-between w-full">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1C3E25] border border-[#E58A13]/50 flex items-center justify-center text-[#E58A13] group-hover:scale-105 transition-all">
              <Bot className="w-5 h-5" />
              <Sparkles className="w-2.5 h-2.5 text-[#E58A13] absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-[#E58A13] text-[#15321E]">
              AI FAQ
            </span>
          </div>

          <div className="mt-3">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF7F2] group-hover:text-[#E58A13] transition-colors leading-tight">
              Ask Farm AI
            </h3>
            <p className="text-[11px] sm:text-xs text-[#A8B7AA] font-sans mt-0.5">
              Instant answers on delivery &amp; A2
            </p>
          </div>
        </button>

      </div>
    </section>
  );
}
