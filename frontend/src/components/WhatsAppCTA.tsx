'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <a
        href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20fresh%20A2%20milk!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white"
      >
        <MessageSquare className="w-6 h-6 text-white fill-current" />
        <span className="font-bold text-sm hidden sm:inline-block">Order on WhatsApp</span>
      </a>
    </div>
  );
}
