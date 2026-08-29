'use client';

import React from 'react';
import { Milk, Sparkles, HeartHandshake } from 'lucide-react';
import { ModalContent } from './DetailModal';

interface CategoryGridSectionProps {
  onOpenStory?: (content: ModalContent) => void;
}

export default function CategoryGridSection({ onOpenStory }: CategoryGridSectionProps) {
  const handleStoryClick = () => {
    if (!onOpenStory) return;
    onOpenStory({
      title: 'Nine Years of Uncompromised Farming',
      subtitle: 'Shoolagiri, Hosur, Tamil Nadu',
      category: 'Our Heritage Story',
      image: '/images/nature_hero_pasture.jpg',
      bodyParagraphs: [
        'Aranya Organic Dairy Farm was founded in 2017 with a simple vision: to bring pure, unadulterated, original A2 milk back to Indian homes.',
        'Our native Gir and Sahiwal cows graze freely on pesticide-free lush green pastures in Shoolagiri. They are fed natural fodder including napier grass, herbs, and organic mineral mixtures.',
        'We never use synthetic growth hormones (rBST) or preventative antibiotics. Every drop of milk reflects our deep respect for nature and ancient Vedic farming practices.'
      ],
      bulletPoints: [
        '100% native breed cows (Gir & Sahiwal)',
        'Free-roaming pasture grazing & organic feeding',
        'Ethical calf-first milking practices',
        'Zero synthetic hormones or routine antibiotics'
      ],
      ctaLabel: 'Connect With Our Farm Team',
      whatsappMessage: 'Hello Aranya Dairy Farm, I would like to schedule a farm visit or learn more about your cows.'
    });
  };

  const categories = [
    {
      id: 'milk',
      title: 'A2 Whole Milk',
      image: '/images/a2_milk_bottle.jpg',
      icon: Milk,
      subtitle: 'Raw & Unpasteurized'
    },
    {
      id: 'ghee',
      title: 'Bilona Cow Ghee',
      image: '/images/bilona_ghee_jar.jpg',
      icon: Sparkles,
      subtitle: 'Vedic Woodfired Ghee'
    },
    {
      id: 'butter',
      title: 'Artisanal Vedic Butter',
      image: '/images/vedic_butter.jpg',
      icon: HeartHandshake,
      subtitle: 'Cultured Hand-Churned'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FCFAF7] border-b border-[#1B4D2E]/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Block matching Image 4 ("What we do") */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-6xl font-serif text-[#1C241E] tracking-tight">
            What we do
          </h2>
          <p className="text-sm sm:text-base text-[#57655B] font-sans leading-relaxed">
            It all begins with pure intent. From ethical grass-fed pastures in Shoolagiri to daily morning cold-chain doorstep deliveries.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStoryClick}
              className="inline-block bg-[#1C241E] hover:bg-[#1B4D2E] text-white font-sans text-xs uppercase font-semibold tracking-widest px-8 py-4 transition-all cursor-pointer"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* 3 Grid Images with Line Art Icons underneath matching Image 5 */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div key={cat.id} className="text-center group space-y-5">
                
                {/* Visual Container */}
                <div className="w-full aspect-[4/5] bg-[#EAE6DF] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Line Art Icon & Title underneath matching Image 5 */}
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#F2ECE7] flex items-center justify-center text-[#1C241E] group-hover:bg-[#1B4D2E] group-hover:text-white transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C241E]">
                    {cat.title}
                  </h3>
                  <p className="text-xs uppercase font-sans tracking-widest text-[#6B472B]">
                    {cat.subtitle}
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
