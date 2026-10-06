'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ShoppingBag,
  Truck,
  ArrowLeft,
  MessageSquare,
  Clock,
  Sparkles,
  Calendar,
  Home,
} from 'lucide-react';
import { WHATSAPP_DISPLAY, WA_FARM_INQUIRY } from '@/lib/whatsapp';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'inquiry';
  const name = searchParams.get('name') || '';

  const isVisit = type === 'visit';

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#1C241E] flex flex-col justify-between selection:bg-[#E58A13] selection:text-white">
      {/* ── Top Header Brand Bar ── */}
      <header className="bg-[#122E1B] border-b border-[#122E1B]/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-[#1B4D2E]/20 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aranya-logo.png"
                alt="Aranya Organic Dairy Farm Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#FAF7F2] tracking-wide block leading-none">
                ARANYA
              </span>
              <span className="text-[10px] text-[#E58A13] uppercase font-sans tracking-widest font-semibold block mt-0.5">
                Organic Dairy Farm
              </span>
            </div>
          </Link>
          <Link
            href="/products"
            className="text-xs uppercase font-sans font-bold tracking-wider text-[#FAF7F2] hover:text-[#E58A13] transition-colors"
          >
            Explore Shop →
          </Link>
        </div>
      </header>

      {/* ── Main Thank You Card ── */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 sm:py-20 text-center flex flex-col items-center justify-center space-y-8 w-full">
        {/* Glow check icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#1B4D2E]/10 flex items-center justify-center text-[#1B4D2E] mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="absolute -inset-1 rounded-full bg-[#1B4D2E]/20 blur-md -z-10 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4D2E]/10 text-[#1B4D2E] text-xs font-sans font-bold uppercase tracking-wider">
            {isVisit ? <Calendar className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isVisit ? 'Farm Visit Request Received' : 'Inquiry Successfully Sent'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#15321E] tracking-tight leading-tight">
            {name ? `Thank You, ${name}!` : 'Thank You!'}
          </h1>
          <p className="text-sm sm:text-base text-[#5F6E62] leading-relaxed max-w-md mx-auto">
            {isVisit
              ? 'Your booking request has been logged. Our farm coordinator is checking the pasture calendar.'
              : 'Your inquiry has been received. Our team in Shoolagiri will review your requirement right away.'}
          </p>
        </div>

        {/* ── What Happens Next Box ── */}
        <div className="w-full bg-white rounded-3xl border border-[#122E1B]/10 p-6 sm:p-8 text-left shadow-sm space-y-5">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#15321E] border-b border-[#122E1B]/10 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E58A13]" />
            <span>What happens next?</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A574E]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#1B4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-[#15321E]">We verify your details</p>
                <p className="text-[#5F6E62] text-xs mt-0.5">
                  Our coordinator reviews your requested schedule and delivery area in Hosur or Shoolagiri.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#1B4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-[#15321E]">We&apos;ll confirm on WhatsApp shortly</p>
                <p className="text-[#5F6E62] text-xs mt-0.5">
                  You will receive a personal WhatsApp message from our farm number ({WHATSAPP_DISPLAY}) with exact confirmation and directions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#1B4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-[#15321E]">Zero-plastic pasture harvest</p>
                <p className="text-[#5F6E62] text-xs mt-0.5">
                  Pure A2 raw milk bottled in sterilized glass, chilled at 4°C, and Vedic Bilona ghee prepared with authentic care.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#122E1B]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6E62]">
            <span>Need an instant reply?</span>
            <a
              href={WA_FARM_INQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#1B4D2E] hover:text-[#E58A13] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Connect on WhatsApp Now &rarr;</span>
            </a>
          </div>
        </div>

        {/* ── Navigation Actions ── */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider px-7 py-3.5 min-h-[48px] rounded-full transition-all touch-manipulation shadow-lg shadow-[#E58A13]/25"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Products</span>
          </Link>

          <Link
            href="/track-order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] active:scale-95 text-[#15321E] font-sans text-xs uppercase font-bold tracking-wider px-7 py-3.5 min-h-[48px] rounded-full border border-[#122E1B]/20 transition-all touch-manipulation shadow-xs"
          >
            <Truck className="w-4 h-4 text-[#D48B16]" />
            <span>Track An Order</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-sans font-semibold text-[#5F6E62] hover:text-[#15321E] py-2 px-4 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 border-t border-[#122E1B]/10 text-center text-xs text-[#8A7B6E]">
        © {new Date().getFullYear()} Aranya Organic Dairy Farm, Shoolagiri, Hosur, Tamil Nadu.
      </footer>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1B4D2E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
