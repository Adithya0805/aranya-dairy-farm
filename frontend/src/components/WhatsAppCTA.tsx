'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { WA_GENERAL_ORDER, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export default function WhatsAppCTA() {
  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 animate-bounce">
      <a
        href={WA_GENERAL_ORDER}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order on WhatsApp — ${WHATSAPP_DISPLAY}`}
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white min-h-[48px] min-w-[48px] touch-manipulation"
      >
        <MessageSquare className="w-6 h-6 text-white fill-current shrink-0" />
        <span className="font-bold text-xs sm:text-sm hidden sm:inline-block">Order on WhatsApp</span>
      </a>
    </div>
  );
}
