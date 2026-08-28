'use client';

import React, { useState } from 'react';
import { PRODUCTS, Product } from '@/data/products';
import { ShoppingBag, CheckCircle, Sparkles, Star } from 'lucide-react';

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Milk', 'Ghee', 'Dairy Fresh'];

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="products" className="py-12 sm:py-20 bg-[#FAF7F2] relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-organic text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0" />
            <span>100% Farm Fresh & Natural</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1B4D2E] tracking-tight">
            Our Organic Dairy Offerings
          </h2>

          <p className="text-sm sm:text-lg text-[#64748B]">
            Freshly processed daily at our Shoolagiri farm without artificial colors, thickeners, or preservatives.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="mt-8 sm:mt-10 flex justify-center gap-2 sm:gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all touch-manipulation flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-[#1B4D2E] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:bg-[#E8F5E9] hover:text-[#1B4D2E] border border-[#1B4D2E]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-5 sm:p-7 border border-[#1B4D2E]/10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Popular Tag */}
              {product.popular && (
                <div className="absolute top-4 right-4 bg-[#E5A93C] text-[#4A3525] text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-[#4A3525]" />
                  <span>Best Seller</span>
                </div>
              )}

              <div>
                {/* Product Emoji Icon Banner */}
                <div className="w-full h-36 sm:h-40 rounded-2xl bg-[#E8F5E9]/50 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-105 transition-transform duration-300 mb-5 sm:mb-6">
                  {product.image}
                </div>

                {/* Category & Unit */}
                <div className="flex items-center justify-between text-xs font-semibold text-[#7A5230] mb-2">
                  <span className="uppercase tracking-wider">{product.category}</span>
                  <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#7A5230]/20">
                    {product.unit}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E293B] group-hover:text-[#1B4D2E] transition-colors">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Highlights list */}
                <ul className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-xs text-[#1E293B]">
                  {product.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1B4D2E] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Order Action */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Price</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#1B4D2E]">
                    {product.price}{' '}
                    <span className="text-xs font-normal text-[#64748B]">/ {product.unit.split(' ')[0]}</span>
                  </span>
                </div>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20order%20${encodeURIComponent(
                    product.name
                  )}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md min-h-[44px] shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#4A3525] shrink-0" />
                  <span>Order Now</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Order Banner */}
        <div className="mt-12 sm:mt-16 bg-[#1B4D2E] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Looking for Bulk Milk or Daily Subscription?
            </h3>
            <p className="text-xs sm:text-sm text-[#D1E8D5] max-w-xl">
              We deliver daily morning milk subscriptions across Hosur, Shoolagiri, and nearby residential apartments. Get customized delivery schedules!
            </p>
          </div>
          <a
            href="https://wa.me/919876543210?text=Hello!%20I%20want%20to%20inquire%20about%20daily%20milk%20subscription%20or%20bulk%20orders."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shrink-0 flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
          >
            <ShoppingBag className="w-5 h-5 text-[#4A3525] shrink-0" />
            <span>Setup Subscription</span>
          </a>
        </div>

      </div>
    </section>
  );
}
