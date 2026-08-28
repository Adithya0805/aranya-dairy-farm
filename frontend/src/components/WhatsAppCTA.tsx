'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppCTA() {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 animate-bounce">
      <a
        href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20fresh%20A2%20milk!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white min-h-[48px] min-w-[48px] touch-manipulation"
      >
        <MessageSquare className="w-6 h-6 text-white fill-current shrink-0" />
        <span className="font-bold text-xs sm:text-sm hidden sm:inline-block">Order on WhatsApp</span>
      </a>
    </div>
  );
}
