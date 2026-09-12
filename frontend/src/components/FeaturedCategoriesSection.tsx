'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FeaturedCategoriesSectionProps {
  onSelectCategory?: (category: string) => void;
}

export default function FeaturedCategoriesSection({
  onSelectCategory,
}: FeaturedCategoriesSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>();

  const featured = [
    {
      category: 'Dairy',
      title: 'Pure A2 Dairy',
      tamilTitle: 'பால் & நெய் வகைகள்',
      description:
        'Raw unpasteurized A2 cow milk, traditional hand-churned Bilona ghee, and cultured white butter directly from Shoolagiri.',
      image: '/images/a2_milk_bottle.jpg',
      cta: 'Explore Dairy',
    },
    {
      category: 'Rice & Millets',
      title: 'Heritage Rice & Millets',
      tamilTitle: 'அரிசி & சிறுதானியங்கள்',
      description:
        'Naturally cultivated traditional rice varieties, unpolished barnyard, kodo, and indigenous nutrition-dense millets.',
      image: '/images/nature_hero_pasture.jpg',
      cta: 'Explore Grains',
    },
    {
      category: 'Pulses & Lentils',
      title: 'Organic Pulses & Lentils',
      tamilTitle: 'பருப்பு வகைகள்',
      description:
        'Unpolished protein-rich toor dal, urad dal, and indigenous native legumes cultivated without synthetic chemicals.',
      image: '/images/bilona_ghee_jar.jpg',
      cta: 'Explore Pulses',
    },
  ];

  const handleCategoryClick = (category: string) => {
    onSelectCategory?.(category);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopAll = () => {
    onSelectCategory?.('All');
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="reveal-section py-20 sm:py-28 bg-[#FCFAF7] border-b border-[#122E1B]/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Provisions • பண்ணை விளைபொருட்கள்</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#15321E] tracking-tight">
            Featured Categories
          </h2>
          <p className="text-sm sm:text-base text-[#5F6E62] font-sans leading-relaxed">
            Wholesome domestic essentials harvested and prepared in harmony with nature, delivered fresh to your home.
          </p>
        </div>

        {/* 3-Column Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {featured.map((item, index) => (
            <div
              key={item.category}
              className="group flex flex-col bg-white rounded-2xl border border-[#122E1B]/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E58A13]/35 hover:-translate-y-1.5 transition-all duration-300 animate-card-reveal"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] bg-[#F2ECE7] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder-product.svg')) {
                      target.src = '/images/placeholder-product.svg';
                    }
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#B84A28] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#B84A28]/20">
                  {item.tamilTitle}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-[#15321E] font-bold group-hover:text-[#E58A13] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Pill Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleCategoryClick(item.category)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full shadow-md shadow-[#E58A13]/20 transition-all duration-150 cursor-pointer min-h-[44px] touch-manipulation"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link below cards */}
        <div className="text-center pt-4">
          <button
            onClick={handleShopAll}
            className="inline-flex items-center gap-2 text-sm font-sans font-bold text-[#15321E] hover:text-[#E58A13] underline underline-offset-8 transition-colors min-h-[44px] touch-manipulation cursor-pointer"
          >
            <span>→ Shop All Categories</span>
          </button>
        </div>
      </div>
    </section>
  );
}
