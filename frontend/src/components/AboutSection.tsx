'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ModalContent } from './DetailModal';

interface AboutSectionProps {
  onOpenColdChain?: (content: ModalContent) => void;
}

export default function AboutSection({ onOpenColdChain }: AboutSectionProps) {
  const handleColdChainClick = () => {
    if (!onOpenColdChain) return;
    onOpenColdChain({
      title: 'Our 4-Step Cold-Chain Standard',
      subtitle: 'From Shoolagiri Pastures to Eco Glass Bottle',
      category: 'Hygiene & Quality',
      image: '/images/nature_hero_pasture.jpg',
      bodyParagraphs: [
        'At Aranya Dairy Farm, temperature control is paramount. Raw milk is vulnerable to microbial growth if left at room temperature.',
        'Within 30 minutes of hands-free mechanical milking, our milk passes into an automated stainless-steel rapid chiller that cools it down to precisely 4°C.',
        'It is packaged immediately into sterilized glass bottles and transported inside refrigerated vehicles directly to customer doorsteps in Chennai and Hosur every morning before 7:00 AM.'
      ],
      bulletPoints: [
        'Instant 4°C chilling within 30 minutes of milking',
        'Zero plastic contact; 100% eco-friendly glass bottles',
        'Strict daily batch laboratory testing for purity & bacterial count',
        'Zero pasteurization warmth to preserve raw natural digestive enzymes'
      ],
      ctaLabel: 'Inquire About Subscription Delivery',
      whatsappMessage: 'Hello Aranya Dairy Farm, I would like to subscribe to daily 4°C cold-chain A2 milk delivery.'
    });
  };

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#EBF0ED] border-b border-[#1B4D2E]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Feature Layout matching Image 3 screenshot */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Side Visual matching Image 3 tall visual */}
          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/5] sm:aspect-[1/1] overflow-hidden bg-[#D8E3DB] relative shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/a2_milk_bottle.jpg"
                alt="Aranya Pure Organic A2 Milk Bottle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side Big Typography matching Image 3 ("Shop Holidays & Occasions") */}
          <div className="lg:col-span-6 space-y-6 sm:pl-6">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
              Natural Purity • 4°C Chilled
            </span>

            <h2 className="text-4xl sm:text-6xl font-serif text-[#1C241E] leading-[1.15] tracking-tight">
              Pure Heritage & Cold-Chain
            </h2>

            <p className="text-base text-[#4A574E] font-sans leading-relaxed max-w-md">
              Chilled to 4°C within 30 minutes of hands-free milking. Zero plastic, zero chemical additives, and zero pasteurization heat.
            </p>

            <div className="pt-2">
              <button
                onClick={handleColdChainClick}
                className="group text-sm font-sans font-semibold text-[#1C241E] hover:text-[#1B4D2E] underline underline-offset-8 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Discover cold-chain standards</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
