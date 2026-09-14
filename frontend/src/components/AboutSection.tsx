'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Clock } from 'lucide-react';
import { ModalContent } from './DetailModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AboutSectionProps {
  onOpenColdChain?: (content: ModalContent) => void;
  onOpenStory?: () => void;
}

export default function AboutSection({ onOpenColdChain: _onOpenColdChain, onOpenStory: _onOpenStory }: AboutSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>();

  const miniFeatures = [
    {
      icon: Heart,
      title: 'Grass-Fed Cows',
      description: 'Free-roaming Gir & Sahiwal native cows grazing on pesticide-free open pastures.',
    },
    {
      icon: Sparkles,
      title: 'Traditional Methods',
      description: 'Vedic hand-churned Bilona ghee and wood-fired clay pot slow simmering.',
    },
    {
      icon: Clock,
      title: 'Farm Fresh Daily',
      description: 'Delivered fresh to doorsteps every morning at 4°C in sterilized eco glass bottles.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="reveal-section py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#122E1B]/10 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Split Layout: Photo on Left, Story on Right */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Side Visual: Real Farm / Pasture Photography */}
          <div className="lg:col-span-6 reveal-child" style={{ transitionDelay: '0ms' }}>
            <div className="w-full aspect-[4/3] sm:aspect-[1/1] overflow-hidden rounded-3xl relative shadow-lg group border border-[#122E1B]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/a2_milk_bottle.jpg"
                alt="Aranya Pure Organic A2 Milk Bottle in Shoolagiri"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-sans tracking-widest text-[#E58A13] font-bold">
                  Shoolagiri Pastures
                </span>
                <p className="font-serif text-lg text-[#FAF7F2] mt-0.5">
                  Ethical dairy rooted in harmony with nature.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-6 reveal-child" style={{ transitionDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-xs font-bold uppercase tracking-wider">
              <span>Our 9-Year Story • Estd. 2017</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#15321E] font-bold leading-[1.15] tracking-tight">
              Rooted in Nature &amp; Vedic Heritage
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5F6E62] font-sans leading-relaxed">
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
                className="group text-sm font-sans font-bold text-[#15321E] hover:text-[#E58A13] underline underline-offset-8 inline-flex items-center gap-2 transition-all duration-150 cursor-pointer min-h-[44px] touch-manipulation active:scale-95"
              >
                <span>Read our full 9-year story</span>
                <ArrowRight className="w-4 h-4 text-[#E58A13] group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>

        </div>

        {/* 3-Column Mini Feature Row Below */}
        <div className="pt-8 border-t border-[#122E1B]/10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {miniFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="reveal-child flex items-start gap-4 p-4 rounded-xl bg-white/70 border border-[#122E1B]/5 hover:bg-white transition-all duration-200"
                style={{ transitionDelay: `${index * 80 + 150}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-[#E58A13]/10 border border-[#E58A13]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#E58A13]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-[#15321E]">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#5F6E62] leading-relaxed font-sans">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
