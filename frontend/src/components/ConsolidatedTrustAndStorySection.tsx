'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Leaf, Clock, Sparkles, Star, ExternalLink, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const JUSTDIAL_URL =
  'https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET';

export default function ConsolidatedTrustAndStorySection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const coreStandards = [
    {
      icon: Award,
      title: '9+ Years Heritage',
      description: 'Pioneering unadulterated Vedic organic dairy and ethical cattle stewardship in Shoolagiri since 2017.',
    },
    {
      icon: Leaf,
      title: '100% Grass-Fed Organic',
      description: 'Free-roaming native Gir & Sahiwal cows with zero synthetic hormones, oxytocin, or chemical fertilizers.',
    },
    {
      icon: Clock,
      title: '4°C Fresh Daily Delivery',
      description: 'Direct farm-to-doorstep morning delivery before 7:30 AM in sanitized, reusable eco glass bottles.',
    },
    {
      icon: Sparkles,
      title: 'Authentic Vedic Bilona',
      description: 'Whole curd hand-churned with wooden bilona, gently simmered in clay pots into golden granular ghee.',
    },
  ];

  return (
    <section
      id="trust-and-story"
      ref={sectionRef}
      className="reveal-section bg-[#FAF7F2] border-b border-[#122E1B]/10 py-16 sm:py-24 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">

        {/* ── 1. Section Header: Trust Standards ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D48B16]/10 text-[#D48B16] text-xs font-sans font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>9+ Years of Trusted Vedic Farming</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#15321E] tracking-tight">
            Why Families Across Hosur &amp; Shoolagiri Trust Aranya
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed max-w-2xl mx-auto">
            Honest, unadulterated provisions straight from free-grazing native cows to your family table.
          </p>
        </div>

        {/* ── 2. Four Core Standards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {coreStandards.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.title}
                className="reveal-child flex items-start gap-3.5 p-5 rounded-2xl bg-white border border-[#122E1B]/10 hover:border-[#D48B16]/40 hover:shadow-md transition-all duration-200"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#D48B16]/10 border border-[#D48B16]/25 flex items-center justify-center shrink-0 text-[#D48B16]">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-[#15321E]">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-[#5F6E62] leading-relaxed font-sans">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. Verified Proof & Customer Spotlights Subgrid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Justdial Verified Rating Card */}
          <div className="reveal-child bg-white p-6 rounded-2xl border border-[#122E1B]/15 shadow-xs space-y-3.5 flex flex-col justify-between" style={{ transitionDelay: '200ms' }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-md bg-[#122E1B] text-white font-sans font-bold text-sm flex items-center gap-1">
                    <span>3.6</span>
                    <Star className="w-3.5 h-3.5 fill-[#D48B16] text-[#D48B16]" />
                  </div>
                  <span className="text-xs font-sans font-bold text-[#15321E]">
                    15 Reviews
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-sans text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified</span>
                </div>
              </div>
              <h4 className="font-serif text-base font-bold text-[#15321E] pt-1">
                Verified Local Business on Justdial
              </h4>
              <p className="text-xs text-[#5F6E62] font-sans leading-relaxed">
                Listed on Justdial Hosur since June 2020 with verified ratings and direct feedback from local families.
              </p>
            </div>

            <a
              href={JUSTDIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full text-center bg-[#FAF7F2] hover:bg-[#D48B16] hover:text-white border border-[#122E1B]/15 hover:border-[#D48B16] text-[#15321E] font-sans text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-full transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
            >
              <span>View Reviews on Justdial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Customer Spotlight 1: Milk Subscription */}
          <div className="reveal-child bg-white p-6 rounded-2xl border border-[#122E1B]/10 space-y-2.5 flex flex-col justify-between hover:border-[#D48B16]/30 transition-all duration-200" style={{ transitionDelay: '260ms' }}>
            <div className="space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#D48B16] bg-[#D48B16]/10 px-2.5 py-0.5 rounded-full">
                Daily Household Subscription
              </span>
              <h4 className="font-serif text-base font-bold text-[#15321E]">
                &ldquo;Pure milk you can taste in every morning cup.&rdquo;
              </h4>
              <p className="text-xs text-[#5F6E62] font-sans leading-relaxed">
                Chilled immediately to 4°C and delivered in eco glass bottles before 7:30 AM every morning across Hosur and Shoolagiri.
              </p>
            </div>
            <div className="pt-2 border-t border-[#122E1B]/8 flex items-center justify-between text-[11px] text-[#8A7B6E] font-sans">
              <span className="font-semibold text-[#15321E]">Hosur SIPCOT Patron</span>
              <span>Subscribed 3+ Years</span>
            </div>
          </div>

          {/* Customer Spotlight 2: Bilona Ghee */}
          <div className="reveal-child bg-white p-6 rounded-2xl border border-[#122E1B]/10 space-y-2.5 flex flex-col justify-between hover:border-[#D48B16]/30 transition-all duration-200" style={{ transitionDelay: '320ms' }}>
            <div className="space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#D48B16] bg-[#D48B16]/10 px-2.5 py-0.5 rounded-full">
                Authentic Bilona Ghee
              </span>
              <h4 className="font-serif text-base font-bold text-[#15321E]">
                &ldquo;Granular texture with that unforgettable village aroma.&rdquo;
              </h4>
              <p className="text-xs text-[#5F6E62] font-sans leading-relaxed">
                Handcrafted from whole cultured curd over slow wood fire in clay pots. Zero preservatives, chemical clarifying agents, or additives.
              </p>
            </div>
            <div className="pt-2 border-t border-[#122E1B]/8 flex items-center justify-between text-[11px] text-[#8A7B6E] font-sans">
              <span className="font-semibold text-[#15321E]">Bangalore Family</span>
              <span>Regular Ghee Patron</span>
            </div>
          </div>

        </div>

        {/* ── 4. Story Teaser Card (Photo on Left, Story on Right) ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#122E1B]/10 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual: Authentic Bottle / Pasture photo */}
            <div className="lg:col-span-5 reveal-child" style={{ transitionDelay: '100ms' }}>
              <div className="w-full aspect-[4/3] sm:aspect-[1/1] overflow-hidden rounded-2xl relative shadow-md group border border-[#122E1B]/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/a2_milk_bottle.jpg"
                  alt="Aranya Pure Organic A2 Milk Bottle in Shoolagiri"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] sm:text-xs uppercase font-sans tracking-widest text-[#E58A13] font-bold">
                    Shoolagiri Pastures
                  </span>
                  <p className="font-serif text-base sm:text-lg text-[#FAF7F2] mt-0.5">
                    Ethical dairy rooted in harmony with nature.
                  </p>
                </div>
              </div>
            </div>

            {/* Story Teaser Text */}
            <div className="lg:col-span-7 space-y-5 reveal-child" style={{ transitionDelay: '180ms' }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15321E]/5 text-[#15321E] text-xs font-bold uppercase tracking-wider border border-[#122E1B]/10">
                <Heart className="w-3.5 h-3.5 text-[#D48B16]" />
                <span>Our 9-Year Heritage • Estd. 2017</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif text-[#15321E] font-bold leading-[1.2] tracking-tight">
                Rooted in Vedic Ecological Wisdom
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
                <p>
                  Established in 2017, Aranya Organic Dairy Farm was founded with a singular commitment: to restore pure, unadulterated A2 dairy and traditional domestic provisions to Indian homes. Situated amidst the serene hills of Shoolagiri, our farm embraces time-honored Vedic ecological wisdom.
                </p>
                <p>
                  Our native Gir and Sahiwal cows roam open green pastures, grazing freely on pesticide-free grasses and medicinal herbs. We strictly prohibit chemical hormones, synthetic growth stimulants, and routine antibiotics, adhering to a sacred calf-first milking philosophy.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/story"
                  className="group text-xs sm:text-sm font-sans font-bold text-[#15321E] hover:text-[#D48B16] underline underline-offset-8 inline-flex items-center gap-2 transition-all duration-150 cursor-pointer min-h-[44px] touch-manipulation active:scale-95"
                >
                  <span>Read our full 9-year story</span>
                  <ArrowRight className="w-4 h-4 text-[#D48B16] group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
