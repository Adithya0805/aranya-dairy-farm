'use client';

import React from 'react';
import { PRODUCTS, Product } from '@/data/products';
import { ModalContent } from './DetailModal';

interface ProductsSectionProps {
  onSelectProduct?: (modalContent: ModalContent) => void;
}

export default function ProductsSection({ onSelectProduct }: ProductsSectionProps) {
  const handleProductClick = (product: Product) => {
    if (!onSelectProduct) return;
    onSelectProduct({
      title: product.name,
      subtitle: product.category + ' • ' + product.unit + ' • ' + product.price,
      category: 'Product Details',
      image: product.image,
      bodyParagraphs: [
        product.description,
        'Processed with zero chemical additives, preservatives, or artificial colors at our Shoolagiri farm.',
        'Orders placed before 8:00 PM are delivered fresh to your doorstep by 7:00 AM the next morning.'
      ],
      bulletPoints: product.details,
      ctaLabel: `Order ${product.name} on WhatsApp`,
      whatsappMessage: `Hello Aranya Dairy Farm, I would like to order ${product.name} (${product.price} / ${product.unit}).`
    });
  };

  return (
    <section id="products" className="py-20 sm:py-28 bg-[#FCFAF7] border-b border-[#1B4D2E]/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Image 2 ("Best sellers") */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-serif text-[#1C241E] tracking-tight">
              Best sellers
            </h2>
            <p className="text-sm sm:text-base text-[#57655B] max-w-lg font-sans leading-relaxed">
              Transform your daily family nutrition with our best selling A2 whole milk and hand-churned Bilona ghee.
            </p>
          </div>
          
          <div className="lg:col-span-5 lg:text-right">
            <a
              href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20view%20your%20full%20A2%20catalog."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1C241E] hover:bg-[#1B4D2E] text-white font-sans text-xs uppercase font-semibold tracking-widest px-8 py-4 transition-all"
            >
              Shop Best Sellers
            </a>
          </div>
        </div>

        {/* Product Cards Grid matching Image 2 vertical card layout */}
        <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
          {PRODUCTS.map((product: Product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              {/* Product Visual Container */}
              <div className="w-full aspect-[3/4] bg-[#EAE6DF] overflow-hidden mb-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Product Details matching Image 2 */}
              <div className="space-y-1">
                <h3 className="font-serif text-lg sm:text-xl text-[#1C241E] group-hover:text-[#1B4D2E] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-sans font-medium text-[#57655B]">
                  {product.price}
                </p>
                <p className="text-xs text-[#8A7B6E] line-clamp-1 pt-1 font-sans">
                  {product.unit} • {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
