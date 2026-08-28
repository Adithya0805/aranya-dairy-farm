'use client';

import React from 'react';
import { PRODUCTS, Product } from '@/data/products';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function ProductsSection() {
  const hasProducts = PRODUCTS && PRODUCTS.length > 0;

  return (
    <section id="products" className="py-20 sm:py-28 bg-white border-b border-[#1B4D2E]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
            Our Farm Catalog
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E] leading-tight">
            Pure A2 Offerings
          </h2>

          <p className="text-sm sm:text-base text-[#57655B] leading-relaxed">
            Freshly processed daily at our Shoolagiri farm without artificial colors, thickeners, or chemical preservatives.
          </p>
        </div>

        {/* Dynamic Data Content / Coming Soon Layout */}
        <div className="mt-12">
          {hasProducts ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PRODUCTS.map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-[#FCFAF7] rounded-2xl p-8 border border-[#1B4D2E]/10 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase text-[#6B472B]">{product.category}</span>
                    <h3 className="text-2xl font-serif font-bold text-[#1C241E] mt-2">{product.name}</h3>
                    <p className="text-xs text-[#57655B] mt-2">{product.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#1B4D2E]/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1B4D2E]">{product.unit}</span>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-editorial"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Editorial Coming Soon Placeholder State */
            <div className="bg-[#FCFAF7] rounded-3xl p-8 sm:p-14 border border-[#1B4D2E]/10 text-center max-w-3xl mx-auto space-y-6 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#1B4D2E] text-white flex items-center justify-center text-3xl mx-auto">
                🏺
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
                  Online Catalog Launching Soon
                </h3>
                <p className="text-xs sm:text-sm text-[#57655B] max-w-lg mx-auto leading-relaxed">
                  We are currently onboarding our full range of Raw A2 Whole Milk, Traditional Bilona Cow Ghee, Paneer, and Set Curd onto our digital catalog.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20inquire%20about%20your%20A2%20milk%20and%20ghee."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-single"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>Inquire Product Availability on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
