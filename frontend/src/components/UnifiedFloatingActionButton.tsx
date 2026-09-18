'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Bot, Sparkles, Truck, X, ChevronUp } from 'lucide-react';
import { WA_GENERAL_ORDER } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function UnifiedFloatingActionButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, buildWhatsAppMessage } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Close when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleWhatsAppOrder = () => {
    setIsExpanded(false);
    if (items.length > 0) {
      const msg = buildWhatsAppMessage();
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    } else {
      window.open(WA_GENERAL_ORDER, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenFarmAI = () => {
    setIsExpanded(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-farm-ai'));
    }
  };

  const handleTrackOrder = () => {
    setIsExpanded(false);
    router.push('/track-order');
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-40 bottom-20 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end"
      aria-label="Quick Actions & Support Menu"
    >
      {/* Backdrop overlay for mobile to dismiss on tap */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-2xs -z-10 sm:hidden transition-opacity duration-200"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* ── Expanded Options Menu (<200ms transition) ── */}
      <div
        className={`flex flex-col items-end gap-2.5 mb-3 transition-all duration-200 ease-out origin-bottom-right ${
          isExpanded
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* 1. Order on WhatsApp */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="group flex items-center gap-3 bg-white hover:bg-[#F0FAF2] text-[#15321E] px-4 py-2.5 rounded-full shadow-xl border border-emerald-500/30 hover:border-emerald-500 transition-all duration-150 active:scale-95 cursor-pointer"
          aria-label="Order on WhatsApp"
        >
          <span className="text-xs font-sans font-bold tracking-wide">
            Order on WhatsApp
          </span>
          <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-4 h-4 fill-current" />
          </div>
        </button>

        {/* 2. Ask Farm AI */}
        <button
          type="button"
          onClick={handleOpenFarmAI}
          className="group flex items-center gap-3 bg-[#15321E] hover:bg-[#1C3E25] text-white px-4 py-2.5 rounded-full shadow-xl border border-[#E58A13]/50 hover:border-[#E58A13] transition-all duration-150 active:scale-95 cursor-pointer"
          aria-label="Ask Farm AI Assistant"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans font-bold tracking-wide text-[#FAF7F2]">
              Ask Farm AI
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-bold bg-[#E58A13] text-[#15321E] uppercase">
              FAQ
            </span>
          </div>
          <div className="relative w-8 h-8 rounded-full bg-[#1C3E25] text-[#E58A13] border border-[#E58A13]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4" />
            <Sparkles className="w-2.5 h-2.5 text-[#E58A13] absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
        </button>

        {/* 3. Track Order */}
        <button
          type="button"
          onClick={handleTrackOrder}
          className="group flex items-center gap-3 bg-white hover:bg-[#FAF7F2] text-[#15321E] px-4 py-2.5 rounded-full shadow-xl border border-[#122E1B]/15 hover:border-[#D48B16]/60 transition-all duration-150 active:scale-95 cursor-pointer"
          aria-label="Track Order Status"
        >
          <span className="text-xs font-sans font-bold tracking-wide">
            Track Order
          </span>
          <div className="w-8 h-8 rounded-full bg-[#D48B16]/15 text-[#D48B16] border border-[#D48B16]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ── Main Expandable FAB Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Close quick actions menu' : 'Open quick actions menu (WhatsApp, Farm AI, Track Order)'}
        className={`relative flex items-center justify-center gap-2 rounded-full shadow-2xl transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 ${
          isExpanded
            ? 'bg-[#15321E] text-white p-3.5 sm:p-4 border-2 border-white/40 rotate-90'
            : 'bg-[#15321E] hover:bg-[#1C3E25] text-white p-3 sm:px-4 sm:py-3.5 border-2 border-[#E58A13]/80 animate-floating-pulse'
        } min-h-[48px] min-w-[48px]`}
      >
        {isExpanded ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF7F2]" />
        ) : (
          <>
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#E58A13]/20 flex items-center justify-center">
                <ChevronUp className="w-4 h-4 text-[#E58A13] animate-bounce" />
              </div>
            </div>
            <span className="font-bold text-xs sm:text-sm font-sans tracking-wide hidden sm:inline-block text-[#FAF7F2]">
              Quick Actions
            </span>
          </>
        )}
      </button>
    </div>
  );
}
