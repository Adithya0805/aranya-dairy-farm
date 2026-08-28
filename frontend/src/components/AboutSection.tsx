'use client';

import React from 'react';
import { Heart, Sun, Thermometer, Truck, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const PROCESS_STEPS = [
    {
      step: '01',
      title: 'Ethical Pasture Grazing',
      desc: 'Cows roam freely on chemical-free green pastures in Shoolagiri, consuming natural herbal fodder.',
      icon: Sun,
    },
    {
      step: '02',
      title: 'Hygienic Hands-Free Milking',
      desc: 'Milking is performed in sanitized environments using touchless equipment under strict veterinary supervision.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Instant Chilling (4°C)',
      desc: 'Milk is immediately chilled within 30 minutes of milking to preserve raw enzymes & natural vitamins.',
      icon: Thermometer,
    },
    {
      step: '04',
      title: 'Eco Glass Bottle Delivery',
      desc: 'Packed in reusable sterilized glass bottles and delivered straight to homes across Hosur & surrounding areas.',
      icon: Truck,
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-organic text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-[#1B4D2E]" />
            <span>Established 2017 in Shoolagiri, Hosur</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1B4D2E] tracking-tight">
            9 Years of Uncompromised Organic Pureness
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            At Aranya Organic Dairy Farm, we believe true health begins with how cows are nurtured. For nearly a decade, we have stayed committed to traditional farming — zero synthetic hormones, zero antibiotics, and zero dilution.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          <div className="bg-[#FAF7F2] rounded-2xl p-8 border border-[#1B4D2E]/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-[#1B4D2E] text-[#E5A93C] flex items-center justify-center text-2xl font-bold mb-6">
              🐄
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1E293B] mb-3">
              Happy, Free-Roaming Cows
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Our native breed cows are never tied in cramped stalls. They graze under open sunshine on organic pastures fed with fresh sorghum, green grass, and natural mineral supplements.
            </p>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-[#1B4D2E]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1B4D2E]" />
                <span>100% Native A2 Breed Lineage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1B4D2E]" />
                <span>Calf Gets First Right to Mother&apos;s Milk</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-8 border border-[#1B4D2E]/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-[#7A5230] text-[#FAF7F2] flex items-center justify-center text-2xl font-bold mb-6">
              🌱
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1E293B] mb-3">
              Zero Chemical & Antibiotic Policy
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We strictly forbid Oxytocin hormone injections, chemical preservatives, or synthetic feed additives. Our milk is tested daily to ensure 100% purity and natural fat richness.
            </p>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-[#7A5230]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7A5230]" />
                <span>No Oxytocin or Growth Hormones</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7A5230]" />
                <span>Zero Adulteration Guarantee</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-8 border border-[#1B4D2E]/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-[#E5A93C] text-[#4A3525] flex items-center justify-center text-2xl font-bold mb-6">
              🍯
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1E293B] mb-3">
              Traditional Bilona Craftsmanship
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Our Ghee is crafted using the ancient two-way wooden churn (Bilona) method — fermenting whole A2 milk into curd first, churning butter, and slow-cooking over earthen clay fires.
            </p>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-[#4A3525]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#E5A93C]" />
                <span>Hand-churned from A2 Curd Butter</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#E5A93C]" />
                <span>Aromatic Golden Granular Texture</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Process Section Header */}
        <div id="process" className="mt-24 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            Our Farm-to-Table Guarantee
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B4D2E]">
            The 4-Step Cold-Chain Hygiene Process
          </h3>
          <p className="text-sm text-[#64748B]">
            How we protect every drop of goodness from milking to your breakfast table.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#FCFAF7] rounded-xl p-6 border border-[#1B4D2E]/10 relative overflow-hidden group hover:border-[#1B4D2E]/40 transition-colors"
              >
                <div className="text-3xl font-serif font-black text-[#1B4D2E]/15 group-hover:text-[#1B4D2E]/30 transition-colors mb-4">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#1B4D2E] flex items-center justify-center mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-[#1E293B] text-lg mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
