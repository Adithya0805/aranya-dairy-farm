'use client';

import React from 'react';
import { ArrowLeft, MessageSquare, Leaf } from 'lucide-react';

interface DetailViewWrapperProps {
  title: string;
  onBackToHub: () => void;
  children: React.ReactNode;
}

export default function DetailViewWrapper({
  title,
  onBackToHub,
  children,
}: DetailViewWrapperProps) {
  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col justify-between animate-fade-in w-full">
      {/* Sticky Detail Top Navigation Bar */}
      <header className="sticky top-0 z-50 glass-header border-b border-[#1B4D2E]/10 transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back Button */}
            <button
              onClick={onBackToHub}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B4D2E] bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#1B4D2E]/20 hover:bg-[#1B4D2E] hover:text-white transition-all shadow-xs min-h-[44px] touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Main Hub</span>
            </button>

            {/* Title / Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#7A5230]">
              <div className="w-6 h-6 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white shrink-0">
                <Leaf className="w-3.5 h-3.5 text-[#E5A93C]" />
              </div>
              <span className="text-[#64748B]">Hub</span>
              <span>/</span>
              <span className="text-[#1B4D2E] font-bold">{title}</span>
            </div>

            {/* Quick Order CTA */}
            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20fresh%20A2%20milk!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xs min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-[#4A3525] fill-current shrink-0" />
              <span className="hidden xs:inline">WhatsApp Order</span>
              <span className="xs:hidden">Order</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Bottom Hub Return Banner */}
      <div className="bg-[#FAF7F2] py-8 px-4 border-t border-[#1B4D2E]/10 text-center">
        <button
          onClick={onBackToHub}
          className="btn-outline px-6 py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Return to Main Hub Directory</span>
        </button>
      </div>
    </div>
  );
}
