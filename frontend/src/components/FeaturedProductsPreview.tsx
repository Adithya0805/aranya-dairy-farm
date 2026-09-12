'use client';

import React, { useState } from 'react';
import { ShoppingBag, Bell, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FeaturedProductsPreviewProps {
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

const DEFAULT_FEATURED: Product[] = [
  {
    id: 'a2-desi-cow-milk',
    name: 'A2 Desi Cow Milk',
    nameTamil: 'A2 நாட்டுப் பசும்பால்',
    category: 'Dairy',
    price: null,
    unit: '1 Litre Glass Bottle',
    image: '/images/a2_milk_bottle.jpg',
    available: true,
    description: '100% pure raw A2 milk from free-roaming Gir and Sahiwal cows, naturally rich in A2 beta-casein.',
  },
  {
    id: 'desi-cow-ghee',
    name: 'Traditional Desi Cow Ghee',
    nameTamil: 'தேசி பசும் நெய்',
    category: 'Dairy',
    price: null,
    unit: '500ml Glass Jar',
    image: '/images/bilona_ghee_jar.jpg',
    available: true,
    description: 'Authentic Desi cow ghee crafted following time-tested Vedic Bilona curd-churning methods.',
  },
  {
    id: 'fresh-butter',
    name: 'Fresh Cultured Butter',
    nameTamil: 'வெண்ணெய்',
    category: 'Dairy',
    price: null,
    unit: '250g',
    image: '/images/vedic_butter.jpg',
    available: true,
    description: 'Traditional cultured butter, freshly hand-churned daily from whole farm milk cream.',
  },
];

export default function FeaturedProductsPreview({
  products,
  onSelectProduct,
}: FeaturedProductsPreviewProps) {
  const { addItem, items } = useCart();
  const sectionRef = useScrollReveal<HTMLElement>();

  // Use provided products (if live updated from Supabase) or fallback defaults
  const previewProducts = React.useMemo(() => {
    if (products && products.length >= 3) {
      const matchA2 = products.find((p) => p.id === 'a2-desi-cow-milk') || products[0];
      const matchGhee = products.find((p) => p.id === 'desi-cow-ghee') || products[1];
      const matchButter = products.find((p) => p.id === 'fresh-butter') || products[2];
      return [
        { ...matchA2, image: matchA2.image.includes('placeholder') ? '/images/a2_milk_bottle.jpg' : matchA2.image },
        { ...matchGhee, image: matchGhee.image.includes('placeholder') ? '/images/bilona_ghee_jar.jpg' : matchGhee.image },
        { ...matchButter, image: matchButter.image.includes('placeholder') ? '/images/vedic_butter.jpg' : matchButter.image },
      ];
    }
    return DEFAULT_FEATURED;
  }, [products]);

  const [quantities, setQuantities] = useState<Record<string, number>>(() => ({
    'a2-desi-cow-milk': 1,
    'desi-cow-ghee': 1,
    'fresh-butter': 1,
  }));

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (product.price === null) return;
    const qty = quantities[product.id] ?? 1;
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleNotifyMe = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, please notify me when pricing for ${product.name} (${product.nameTamil}) is available.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="reveal-section py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#122E1B]/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
            Direct From Shoolagiri
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#15321E] tracking-tight">
            Farm Favorites
          </h2>
          <p className="text-sm sm:text-base text-[#5F6E62] font-sans leading-relaxed">
            Our most cherished daily staples — crafted naturally, uncompromised by shortcuts.
          </p>
        </div>

        {/* 3 Product Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {previewProducts.map((product, index) => {
            const hasPrice = product.price !== null;
            const inCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
            const currentQty = quantities[product.id] ?? 1;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-[#122E1B]/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E58A13]/35 hover:-translate-y-1.5 transition-all duration-300 p-5 animate-card-reveal"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Product Image */}
                <div
                  className="w-full aspect-square bg-[#F4EFEA] rounded-xl overflow-hidden mb-4 relative cursor-pointer"
                  onClick={() => onSelectProduct?.(product)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/images/placeholder-product.svg')) {
                        target.src = '/images/placeholder-product.svg';
                      }
                    }}
                  />
                  {inCart > 0 && (
                    <div className="absolute top-3 right-3 bg-[#E58A13] text-white text-[10px] font-bold font-sans px-2.5 py-1 rounded-full shadow-sm">
                      {inCart} in cart
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#B84A28] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                    {product.category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-5 flex-1">
                  <h3
                    className="font-serif text-xl text-[#15321E] group-hover:text-[#E58A13] transition-colors cursor-pointer font-bold leading-snug"
                    onClick={() => onSelectProduct?.(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs font-sans text-[#122E1B]/80 font-medium">
                    {product.nameTamil}
                  </p>
                  <p className="text-xs text-[#8A7B6E] font-sans">
                    Unit: <span className="text-[#15321E] font-medium">{product.unit}</span>
                  </p>

                  <div className="pt-2">
                    {hasPrice ? (
                      <p className="text-lg font-sans font-bold text-[#15321E]">
                        {formatPrice(product.price!)}
                      </p>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-[11px] font-sans font-semibold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E58A13] animate-pulse" />
                        <span>Price updating soon</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA matching pill amber style */}
                <div className="mt-auto pt-3 border-t border-[#122E1B]/8">
                  {hasPrice ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#122E1B]/20 rounded-full overflow-hidden shrink-0 bg-[#FAF7F2]">
                        <button
                          onClick={() => handleQtyChange(product.id, -1)}
                          disabled={currentQty <= 1}
                          className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all touch-manipulation cursor-pointer"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-[#15321E] font-sans select-none">
                          {currentQty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all touch-manipulation cursor-pointer"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white text-xs uppercase font-bold tracking-wider py-3 px-4 min-h-[44px] rounded-full shadow-md shadow-[#E58A13]/20 transition-all duration-150 touch-manipulation cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNotifyMe(product)}
                      className="w-full flex items-center justify-center gap-2 border border-[#E58A13] hover:bg-[#E58A13] text-[#E58A13] hover:text-white text-xs uppercase font-bold tracking-wider py-3 px-4 min-h-[44px] rounded-full transition-all duration-150 touch-manipulation active:scale-95 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 shrink-0" />
                      <span>Notify Me on Price</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to all products */}
        <div className="text-center pt-4">
          <button
            onClick={scrollToShop}
            className="inline-flex items-center gap-2 text-sm font-sans font-bold text-[#15321E] hover:text-[#E58A13] underline underline-offset-8 transition-colors min-h-[44px] touch-manipulation cursor-pointer"
          >
            <span>→ Shop All Products</span>
          </button>
        </div>
      </div>
    </section>
  );
}
