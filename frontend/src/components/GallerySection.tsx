'use client';

import React from 'react';

export default function GallerySection() {
  const ESSAY_ITEMS = [
    {
      title: 'Free Pasture Grazing',
      subtitle: 'Native cows grazing on chemical-free green pastures under open Tamil Nadu sunshine.',
      emoji: '🌿',
      bg: 'bg-[#1B4D2E]',
    },
    {
      title: 'Ethical Care & Heritage',
      subtitle: 'Zero stress, zero synthetic growth hormones, and calf first-milking priority.',
      emoji: '🐄',
      bg: 'bg-[#3A271C]',
    },
    {
      title: 'Vedic Bilona Churning',
      subtitle: 'Handcrafted using traditional wooden churners and clay pot slow boiling.',
      emoji: '🏺',
      bg: 'bg-[#6B472B]',
    },
  ];

  return (
    <section className="py-20 bg-[#FCFAF7] border-b border-[#1B4D2E]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
            Life at Shoolagiri
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E]">
            A glimpse into our pastures.
          </h2>
        </div>

        {/* Editorial Photo Essay Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {ESSAY_ITEMS.map((item, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className={`rounded-2xl ${item.bg} text-white aspect-[4/3] flex flex-col items-center justify-center p-6 text-center shadow-xs overflow-hidden`}>
                <div className="text-6xl group-hover:scale-105 transition-transform duration-300">
                  {item.emoji}
                </div>
                <div className="font-serif font-bold text-lg text-[#FCFAF7] mt-3">
                  {item.title}
                </div>
              </div>
              <p className="text-xs text-[#57655B] leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
