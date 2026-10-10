'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Truck,
  ShieldCheck,
  Heart,
  Droplets,
  Calendar,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Product, formatPrice, getProductPriceLabel } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER, buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem?.quantity ?? 0;
  const hasPrice = product.price !== null;

  const handleAddToCart = () => {
    if (!hasPrice) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppInquire = () => {
    const text = encodeURIComponent(
      `Hello Aranya Dairy Farm, I would like to inquire about ordering ${product.name} (${product.nameTamil}) - ${product.unit}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ── Breadcrumb Bar ── */}
        <nav aria-label="Breadcrumbs" className="mb-6 sm:mb-8">
          <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-sans">
            <li>
              <Link
                href="/"
                className="text-[#5F6E62] hover:text-[#E58A13] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-[#8A7B6E] select-none">/</li>
            <li>
              <Link
                href="/products"
                className="text-[#5F6E62] hover:text-[#E58A13] transition-colors"
              >
                All Products
              </Link>
            </li>
            <li className="text-[#8A7B6E] select-none">/</li>
            <li>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-[#5F6E62] hover:text-[#E58A13] transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-[#8A7B6E] select-none">/</li>
            <li className="font-semibold text-[#15321E] truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── Product Main Showcase Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#122E1B]/10 shadow-sm">
          
          {/* Left Column: Image View */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full aspect-square bg-[#F4EFEA] rounded-2xl overflow-hidden relative border border-[#122E1B]/10 flex items-center justify-center p-6 shadow-xs group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={`${product.name} — Pure Vedic Farm Harvest, Shoolagiri, Aranya Organic Dairy Farm`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/placeholder-product.svg')) {
                    target.src = '/images/placeholder-product.svg';
                  }
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-[#122E1B] text-[#FAF7F2] shadow-sm">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#E58A13] text-white shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Farm Favorite</span>
                  </span>
                )}
              </div>

              {inCartQty > 0 && (
                <div className="absolute top-4 right-4 bg-[#E58A13] text-white text-xs font-bold font-sans px-3 py-1 rounded-full shadow-sm">
                  {inCartQty} currently in cart
                </div>
              )}
            </div>

            {/* Quick Guarantees under photo */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-sans pt-2">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#122E1B]/5">
                <ShieldCheck className="w-4 h-4 text-[#D48B16] mx-auto mb-1" />
                <span className="text-[#15321E] font-medium block">100% Pure</span>
                <span className="text-[#8A7B6E] text-[10px]">Zero Chemicals</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#122E1B]/5">
                <Truck className="w-4 h-4 text-[#D48B16] mx-auto mb-1" />
                <span className="text-[#15321E] font-medium block">4°C Cold-Chain</span>
                <span className="text-[#8A7B6E] text-[10px]">Delivered Fresh</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#122E1B]/5">
                <Heart className="w-4 h-4 text-[#D48B16] mx-auto mb-1" />
                <span className="text-[#15321E] font-medium block">Ahimsa Milking</span>
                <span className="text-[#8A7B6E] text-[10px]">Calf-First Ethos</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
                  Direct From Shoolagiri Farm
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#15321E] leading-tight">
                  {product.name}
                </h1>
                <p className="text-base sm:text-lg font-sans text-[#122E1B]/80 font-medium">
                  <span lang="ta">{product.nameTamil}</span>
                </p>
              </div>

              {/* Price & Unit */}
              <div className="flex items-baseline gap-3 pt-2 pb-4 border-b border-[#122E1B]/10">
                {hasPrice ? (
                  <span className="text-3xl sm:text-4xl font-sans font-bold text-[#15321E]">
                    {formatPrice(product.price!)}
                  </span>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-sm font-sans font-semibold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#E58A13] animate-pulse" />
                    <span>Price updating soon</span>
                  </div>
                )}
                <span className="text-sm sm:text-base text-[#8A7B6E] font-sans">
                  / {product.unit}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3 text-sm sm:text-base text-[#5F6E62] leading-relaxed">
                <p>
                  {product.description ||
                    `${product.name} is produced adhering to natural Vedic dairy and chemical-free sustainable farming principles in Shoolagiri, Tamil Nadu.`}
                </p>
                <p className="text-xs sm:text-sm text-[#8A7B6E]">
                  Free from synthetic hormones, oxytocin, adulterants, or chemical preservatives. Packed in sanitized, food-safe containers for doorstep morning delivery.
                </p>
              </div>

              {/* Key Highlights List */}
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#122E1B]/10 space-y-2 text-xs sm:text-sm">
                <div className="font-serif font-bold text-[#15321E] text-sm sm:text-base mb-1">
                  Farm Purity Standards:
                </div>
                <div className="flex items-center gap-2 text-[#3E4B41]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                  <span>Harvested directly from free-grazing native Gir &amp; Sahiwal cows</span>
                </div>
                <div className="flex items-center gap-2 text-[#3E4B41]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                  <span>Morning delivery coverage across Hosur (5:30 AM – 7:30 AM)</span>
                </div>
                <div className="flex items-center gap-2 text-[#3E4B41]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4D2E] shrink-0" />
                  <span>Strict zero-plastic contact milk bottling protocol</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-3.5 pt-4 border-t border-[#122E1B]/10">
              {hasPrice ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between sm:justify-start border border-[#122E1B]/20 rounded-full bg-[#FAF7F2] p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 disabled:opacity-25 transition-all cursor-pointer rounded-full"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm font-sans text-[#15321E]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-[#15321E] hover:bg-[#E58A13]/15 active:scale-90 transition-all cursor-pointer rounded-full"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs sm:text-sm uppercase font-bold tracking-wider py-4 px-6 rounded-full shadow-lg shadow-[#E58A13]/25 transition-all cursor-pointer min-h-[50px]"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>
                      {addedAnimation ? 'Added to Cart ✓' : 'Add to Delivery Cart'}
                    </span>
                  </button>
                </div>
              ) : null}

              {/* Secondary WhatsApp Direct Inquiry */}
              <button
                type="button"
                onClick={handleWhatsAppInquire}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#122E1B] hover:bg-[#1C3E25] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full transition-all cursor-pointer border border-[#E58A13]/40 min-h-[46px]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Inquire / Order via WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-[#8A7B6E] pt-1">
                <span>Need help? Call: +91 99443 38612</span>
                <span>•</span>
                <Link href="/contact#visit" className="hover:text-[#E58A13] underline">
                  Book a Farm Visit
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* ── Related Harvest Section ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#122E1B]/10 pb-4">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
                  From The Same Category
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#15321E] mt-1">
                  More {product.category} Provisions
                </h2>
              </div>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs uppercase font-bold tracking-wider text-[#E58A13] hover:underline"
              >
                View all in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group bg-white rounded-2xl border border-[#122E1B]/10 p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#E58A13]/40 transition-all"
                >
                  <div>
                    <div className="w-full aspect-square bg-[#F4EFEA] rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.image}
                        alt={`${rel.name} — Aranya Dairy Farm`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#B84A28]">
                      {rel.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#15321E] group-hover:text-[#E58A13] transition-colors mt-0.5">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#8A7B6E] font-sans">
                      <span lang="ta">{rel.nameTamil}</span> • {rel.unit}
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-[#122E1B]/5 flex items-center justify-between">
                    <span className="font-bold text-[#15321E] text-sm">
                      {getProductPriceLabel(rel)}
                    </span>
                    <span className="text-xs uppercase font-bold text-[#E58A13] group-hover:translate-x-1 transition-transform">
                      View Product →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
