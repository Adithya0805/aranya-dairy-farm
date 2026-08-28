'use client';

import React from 'react';
import {
  Leaf,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface HubHeroProps {
  onSelectSection: (sectionId: string) => void;
}

export default function HubHero({ onSelectSection }: HubHeroProps) {
  const HUB_CARDS = [
    {
      id: 'about',
      title: 'Our 9-Yr Story',
      subtitle: 'See how our organic journey began in 2017',
      icon: Heart,
      iconBg: 'bg-[#E8F5E9] text-[#1B4D2E]',
      badge: 'Est. 2017',
    },
    {
      id: 'products',
      title: 'A2 Products',
      subtitle: 'Explore raw A2 milk, Vedic Bilona ghee & fresh paneer',
      icon: ShoppingBag,
      iconBg: 'bg-[#FEF3C7] text-[#7A5230]',
      badge: 'Fresh Daily',
    },
    {
      id: 'process',
      title: 'Hygiene Process',
      subtitle: '4-step cold-chain purity & 4°C instant chilling',
      icon: ShieldCheck,
      iconBg: 'bg-[#E0F2FE] text-[#0369A1]',
      badge: 'Zero Adulteration',
    },
    {
      id: 'reviews',
      title: 'Customer Reviews',
      subtitle: 'Justdial 3.6★ rating & verified family reviews',
      icon: Star,
      iconBg: 'bg-[#FEF9C3] text-[#A16207]',
      badge: '3.6★ Justdial',
    },
    {
      id: 'contact',
      title: 'Farm Location & Order',
      subtitle: 'Visit us in Shoolagiri, Hosur or send an inquiry',
      icon: MapPin,
      iconBg: 'bg-[#F3E8FF] text-[#6B21A8]',
      badge: 'Shoolagiri, Hosur',
    },
  ];

  return (
    <div className="min-h-[85vh] lg:min-h-screen bg-[#FAF7F2] flex flex-col justify-between relative overflow-hidden w-full">
      {/* Hero Visual Banner with Dark Forest Overlay */}
      <section className="relative bg-[#1B4D2E] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-lg">
        {/* Background Visual Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D2E]/95 via-[#1B4D2E]/90 to-[#25663E]/85 z-10" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E5A93C]/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#E8F5E9]/10 blur-3xl pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto relative z-20 text-center space-y-4 animate-fade-in-up">
          {/* Logo & Brand Name */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#E5A93C] flex items-center justify-center text-[#4A3525] shrink-0">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
              ARANYA ORGANIC DAIRY FARM
            </span>
          </div>

          {/* 1-Line Tagline Specification */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#FAF7F2] leading-snug">
            9 Years of Pure, Organic Dairy in Shoolagiri
          </h1>

          <p className="text-xs sm:text-base text-[#D1E8D5] max-w-xl mx-auto leading-relaxed">
            100% natural, grass-fed A2 milk & Vedic Bilona Ghee from free-roaming native cows. Select a topic below to explore details.
          </p>

          {/* Direct Actions */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20fresh%20A2%20milk!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E5A93C] hover:bg-[#D49626] text-[#4A3525] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>Quick WhatsApp Order</span>
            </a>
            <a
              href="tel:+919876543210"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-white/20 transition-all min-h-[44px]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Call Farm</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5 Clean Entry Cards Hub Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A5230]">
            Hub Directory • Select a Section
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
          {HUB_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectSection(card.id)}
                className={`group bg-white rounded-2xl p-5 border border-[#1B4D2E]/10 shadow-xs hover:shadow-lg hover:border-[#1B4D2E]/40 transition-all duration-300 text-left flex flex-col justify-between min-h-[140px] touch-manipulation relative overflow-hidden ${
                  idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5230] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#7A5230]/15">
                    {card.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1E293B] group-hover:text-[#1B4D2E] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] group-hover:bg-[#1B4D2E] group-hover:text-white text-[#1B4D2E] flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer minimal info */}
      <footer className="py-4 text-center text-xs text-[#64748B] border-t border-[#1B4D2E]/10 bg-white">
        © {new Date().getFullYear()} Aranya Organic Dairy Farm, Shoolagiri, Hosur, Tamil Nadu.
      </footer>
    </div>
  );
}
