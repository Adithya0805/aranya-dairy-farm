'use client';

import React from 'react';
import { ShieldCheck, Award, MapPin, ArrowRight, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-[#FAF7F2] via-[#E8F5E9]/40 to-[#FCFAF7] w-full px-0">
      {/* Decorative organic background shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#1B4D2E]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left w-full">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full badge-organic text-[11px] sm:text-sm font-semibold tracking-normal shadow-xs max-w-full text-center sm:text-left leading-snug">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5A93C] shrink-0" />
              <span className="break-words">9+ Years of Trusted Organic Dairy Farming in Shoolagiri</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1B4D2E] leading-snug sm:leading-none tracking-tight break-words px-1">
              Pure, Fresh{' '}
              <span className="text-[#7A5230] relative inline-block">
                A2 Raw Milk
                <svg className="absolute -bottom-1 left-0 w-full h-2 sm:h-3 text-[#E5A93C]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>{' '}
              From Farm To Doorstep
            </h1>

            {/* Subheadline */}
            <p className="text-xs sm:text-xl text-[#64748B] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed break-words px-1">
              Experience the unadulterated taste of 100% natural, grass-fed A2 milk and Vedic Bilona Ghee straight from our chemical-free pastures in Shoolagiri, Hosur.
            </p>

            {/* Trust Badges Bar */}
            <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-[#1E293B] w-full">
              <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg border border-[#1B4D2E]/10 shadow-xs w-full sm:w-auto justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                <span>Zero Hormones / Antibiotics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg border border-[#1B4D2E]/10 shadow-xs w-full sm:w-auto justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                <span>Chilled & Delivered in Glass</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg border border-[#1B4D2E]/10 shadow-xs w-full sm:w-auto justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                <span>Free-Roaming Grazing</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 w-full max-w-full">
              <a
                href="https://wa.me/919876543210?text=Hello!%20I%20want%20to%20order%20pure%20A2%20milk%20from%20Aranya%20Dairy%20Farm."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl min-h-[48px] text-center"
              >
                <MessageSquare className="w-5 h-5 text-[#4A3525] shrink-0" />
                <span>Quick Order on WhatsApp</span>
              </a>

              <a
                href="#products"
                className="btn-outline w-full sm:w-auto px-4 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-base font-semibold flex items-center justify-center gap-2 min-h-[48px] text-center"
              >
                <span>View Product Catalog</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

            {/* Location & Justdial Rating summary */}
            <div className="pt-3 border-t border-[#1B4D2E]/10 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#7A5230] shrink-0" />
                <span>Shoolagiri, Hosur, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span className="font-semibold text-[#1E293B]">3.6★ Rating</span> on Justdial (15+ Reviews)
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Graphic */}
              <div className="glass-card rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden border border-white/60">
                <div className="bg-gradient-to-br from-[#1B4D2E] to-[#25663E] rounded-2xl p-4 sm:p-6 text-white text-center relative">
                  <div className="absolute top-3 right-3 bg-[#E5A93C] text-[#4A3525] font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Fresh Daily
                  </div>
                  
                  <div className="text-5xl sm:text-8xl my-3 sm:my-4 animate-pulse-subtle">
                    🥛
                  </div>

                  <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-wide">
                    Pure A2 Raw Whole Milk
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#D1E8D5] mt-1">
                    Delivered in sterilized eco-friendly glass bottles within hours of milking.
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-left">
                    <div>
                      <span className="text-[10px] text-white/80 uppercase tracking-widest block">Price</span>
                      <span className="text-lg sm:text-2xl font-bold text-[#E5A93C]">₹75 <span className="text-xs font-normal text-white">/ Litre</span></span>
                    </div>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20Aranya%20Farm,%20I'd%20like%20to%20order%20A2%20Milk!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#E5A93C] hover:bg-[#D49626] text-[#4A3525] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm min-h-[44px] flex items-center justify-center shrink-0"
                    >
                      Subscribe / Order
                    </a>
                  </div>
                </div>

                {/* Floating Highlight Badges */}
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-xl border border-[#1B4D2E]/10 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B4D2E] shrink-0" />
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#1E293B]">100% Organic</div>
                      <div className="text-[9px] sm:text-[10px] text-[#64748B]">No Chemicals</div>
                    </div>
                  </div>
                  
                  <div className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-xl border border-[#1B4D2E]/10 flex items-center gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#7A5230] shrink-0" />
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#1E293B]">Est. 2017</div>
                      <div className="text-[9px] sm:text-[10px] text-[#64748B]">9-Year Legacy</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
