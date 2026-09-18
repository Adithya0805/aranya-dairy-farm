'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { WA_GENERAL_ORDER, WHATSAPP_DISPLAY, buildWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

export default function WhatsAppCTA() {
  const pathname = usePathname();
  const { items, buildWhatsAppMessage } = useCart();

  // Hide on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (items.length > 0) {
      e.preventDefault();
      const cartMsg = buildWhatsAppMessage();
      const url = buildWhatsAppUrl(cartMsg);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
      <a
        href={WA_GENERAL_ORDER}
        onClick={handleWhatsAppClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order on WhatsApp — ${WHATSAPP_DISPLAY}`}
        className="animate-whatsapp-pulse flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 group border-2 border-white min-h-[48px] min-w-[48px] touch-manipulation cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current shrink-0" />
        <span className="font-bold text-xs sm:text-sm hidden sm:inline-block font-sans tracking-wide">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
}
