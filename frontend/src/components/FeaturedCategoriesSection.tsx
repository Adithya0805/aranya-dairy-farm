'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Product } from '@/lib/products';
import { resolveCategoryCoverImage } from '@/lib/catalog';

interface FeaturedCategoriesSectionProps {
  products?: Product[];
  onSelectCategory?: (category: string) => void;
}

export default function FeaturedCategoriesSection({
  products,
  onSelectCategory: _onSelectCategory,
}: FeaturedCategoriesSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>();

  const dairyImg = resolveCategoryCoverImage(products, 'Dairy', '/images/a2_milk_bottle.jpg');
  const riceImg = resolveCategoryCoverImage(products, 'Rice & Millets', '/images/placeholder-product.svg');
  const pulsesImg = resolveCategoryCoverImage(products, 'Pulses & Lentils', '/images/placeholder-product.svg');

  const featured = [
    {
      category: 'Dairy',
      title: 'Pure A2 Dairy',
      tamilTitle: 'பால் & நெய் வகைகள்',
      description:
        'Raw unpasteurized A2 cow milk, traditional hand-churned Bilona ghee, and cultured white butter directly from Shoolagiri.',
      image: dairyImg,
      cta: 'Explore Dairy',
    },
    {
      category: 'Rice & Millets',
      title: 'Heritage Rice & Millets',
      tamilTitle: 'அரிசி & சிறுதானியங்கள்',
      description:
        'Naturally cultivated traditional rice varieties, unpolished barnyard, kodo, and indigenous nutrition-dense millets.',
      image: riceImg,
      cta: 'Explore Grains',
    },
    {
      category: 'Pulses & Lentils',
      title: 'Organic Pulses & Lentils',
      tamilTitle: 'பருப்பு வகைகள்',
      description:
        'Unpolished protein-rich toor dal, urad dal, and indigenous native legumes cultivated without synthetic chemicals.',
      image: pulsesImg,
      cta: 'Explore Pulses',
    },
  ];

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="reveal-section py-20 sm:py-28 bg-[#FCFAF7] border-b border-[#122E1B]/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D48B16]/10 text-[#D48B16] text-xs font-semibold uppercase tracking-wider">
            <span>Explore Farm Harvest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#15321E] font-bold tracking-tight">
            Nourishment By Category
          </h2>
          <p className="text-sm sm:text-base text-[#5F6E62] max-w-2xl mx-auto font-sans leading-relaxed">
            From morning milking to heirloom harvest — select a category to discover pure, chemical-free provisions.
          </p>
        </div>

        {/* 3 Large Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((item) => (
            <div
              key={item.category}
              className="group reveal-child flex flex-col bg-white rounded-2xl border border-[#122E1B]/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#D48B16]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {/* Category Image Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#122E1B]/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#122E1B]/80 text-[#FAF7F2] backdrop-blur-xs border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Tamil Subtitle Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-sans font-semibold text-white/90 drop-shadow-sm">
                    {item.tamilTitle}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-[#15321E] font-bold group-hover:text-[#D48B16] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6E62] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Pill Button */}
                <div className="pt-2">
                  <Link
                    href={`/products?category=${encodeURIComponent(item.category)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#D48B16] hover:bg-[#B8740D] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full shadow-md shadow-[#D48B16]/20 transition-all duration-150 cursor-pointer min-h-[46px] touch-manipulation group/btn"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-150" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Big Important Button to view all products */}
        <div className="text-center pt-6">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-3 bg-[#122E1B] hover:bg-[#1C3E25] active:scale-95 text-[#FAF7F2] hover:text-white font-sans text-xs sm:text-sm uppercase font-bold tracking-widest py-4 px-8 sm:px-10 rounded-full shadow-xl shadow-[#122E1B]/25 transition-all duration-200 border border-[#D48B16]/35 min-h-[52px] touch-manipulation cursor-pointer group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 text-[#D48B16] group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
