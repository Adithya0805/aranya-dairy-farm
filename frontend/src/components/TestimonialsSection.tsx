'use client';

import React from 'react';
import { Star, Award, CheckCircle2, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const REVIEWS = [
    {
      name: 'Ramesh Sundaram',
      location: 'Hosur Town',
      rating: 5,
      review: 'Switched to Aranya A2 milk 8 months ago for my children. The thick cream layer and sweet natural aroma remind me of village dairy. Excellent delivery service!',
      product: 'A2 Whole Milk',
    },
    {
      name: 'Priya Krishnan',
      location: 'Shoolagiri',
      rating: 5,
      review: 'Their Bilona Cow Ghee is unmatched! You can see the golden granular texture. Knowing the cows are raised ethically right here in Shoolagiri gives total peace of mind.',
      product: 'Bilona Cow Ghee',
    },
    {
      name: 'Karthik Raja',
      location: 'Attibele / Hosur border',
      rating: 4,
      review: 'Super soft paneer and fresh set curd. Glass bottle delivery is eco-friendly. Very prompt customer response on WhatsApp whenever I adjust my morning milk quantity.',
      product: 'Set Curd & Paneer',
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-[#FCFAF7] border-t border-[#1B4D2E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Justdial Proof Banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#1B4D2E]/10 shadow-sm">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4D2E] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#E5A93C]" />
              <span>Verified Customer Trust</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B4D2E]">
              Trusted By 500+ Families In Hosur & Shoolagiri
            </h2>

            <p className="text-sm text-[#64748B] max-w-xl">
              Real feedback from local residents who trust Aranya Organic Dairy Farm for their daily nutrition.
            </p>
          </div>

          {/* Justdial Proof Card */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5A93C]/40 text-center shrink-0 min-w-[280px] shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#E5A93C] mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'fill-current opacity-40'}`} />
              ))}
            </div>
            <div className="text-3xl font-serif font-bold text-[#1E293B]">
              3.6 / 5.0
            </div>
            <div className="text-xs font-semibold text-[#7A5230] mt-1">
              Verified on Justdial (15+ Customer Reviews)
            </div>
            <div className="mt-3 pt-3 border-t border-[#7A5230]/15 flex items-center justify-center gap-1.5 text-[11px] text-[#1B4D2E] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#1B4D2E]" />
              <span>9+ Years Active Farm Record</span>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-[#1B4D2E]/10 shadow-xs flex flex-col justify-between relative group hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#1B4D2E]/15 mb-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#E5A93C]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#1B4D2E]">{rev.name}</div>
                  <div className="text-[11px] text-[#64748B]">{rev.location}</div>
                </div>
                <span className="text-[10px] font-semibold text-[#7A5230] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#7A5230]/20">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
