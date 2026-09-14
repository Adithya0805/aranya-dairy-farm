'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { ArrowLeft, ArrowRight, Heart, Sparkles, Droplets, ShieldCheck, Sun, MessageCircle } from 'lucide-react';
import { WA_STORY_INQUIRY } from '@/lib/whatsapp';

export default function StoryPage() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  const pillars = [
    {
      icon: Heart,
      title: 'Ethical Calf-First Milking',
      titleTamil: 'கன்றுக்கு முதலிடம்',
      description:
        'Every morning and evening, the young calves feed first to their complete satisfaction. Only the surplus unadulterated milk is gathered by our farm caretakers. We strictly reject hormonal stimulants, synthetic oxytocin, and routine antibiotics.',
    },
    {
      icon: Sun,
      title: '100% Free Pasture Grazing',
      titleTamil: 'இயற்கை மேய்ச்சல் முறை',
      description:
        'Our native Gir and Sahiwal cows are never tethered in cramped industrial stalls. They roam freely under the Shoolagiri sun across pesticide-free open green fields, grazing on napier grass, moringa foliage, and native wild herbs.',
    },
    {
      icon: Sparkles,
      title: 'Handcrafted Vedic Bilona Ghee',
      titleTamil: 'பழமையான பிலோனா நெய்',
      description:
        'We follow the authentic Vedic 5-step process: whole A2 milk is cultured into curd, slowly churned bidirectionally with a wooden bilona, and the extracted makkhan is gently clarified in earthen pots over a low flame into granular golden ghee.',
    },
    {
      icon: Droplets,
      title: 'Zero Plastic & 4°C Cold-Chain',
      titleTamil: 'தூய கண்ணாடி பாட்டில்',
      description:
        'Milk is chilled immediately down to 4°C within minutes of milking to preserve beneficial enzymes and natural nutrients. Packaged exclusively in sanitized, reusable eco glass bottles and delivered before 7:30 AM every morning.',
    },
  ];

  const milestones = [
    {
      year: '2017',
      title: 'The Shoolagiri Sanctuary Founded',
      description:
        'Started with a humble herd of indigenous Gir cows on ancestral family land in Shoolagiri, united by one vision: bringing real, clean, unpasteurized milk to local households.',
    },
    {
      year: '2019',
      title: 'Vedic Bilona Ghee Kitchen Established',
      description:
        'Revived traditional Indian butter-churning using wood-fired clay pots and wooden rods, producing lab-tested golden granular A2 ghee with no industrial processing.',
    },
    {
      year: '2022',
      title: 'Expansion to Heritage Grains & Millets',
      description:
        'Partnered with traditional dryland farmers around Krishnagiri to cultivate indigenous unpolished rice varieties, native millets, and chemical-free pulses.',
    },
    {
      year: 'Present',
      title: '9+ Years of Unwavering Trust',
      description:
        'Serving hundreds of families across Hosur and Shoolagiri with daily morning doorstep delivery at 4°C, verified by over 9 years of direct customer relationships.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">
      {/* 1. Header Bar */}
      <Header
        onOpenCart={() => setCartOpen(true)}
      />

      {/* ── Prominent Larger Breadcrumb Bar with Glassmorphic Effect ── */}
      <section className="bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#122E1B]/10 py-4 sm:py-5 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Breadcrumb Navigation - Quite Larger with Rich Interaction */}
            <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-2.5 sm:gap-3.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#15321E] hover:text-[#E58A13] font-sans text-sm sm:text-base font-semibold border border-[#122E1B]/10 shadow-xs transition-all duration-200 group active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#E58A13] group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
              </Link>

              <span className="text-[#E58A13] font-bold text-base sm:text-xl">/</span>

              <div className="inline-flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#15321E] tracking-tight">
                  Our Story
                </span>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#122E1B]/5 text-[#15321E] border border-[#122E1B]/10">
                  Estd. 2017
                </span>
              </div>
            </nav>

            {/* Status Pill on Right */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#5F6E62]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#122E1B]/10 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#1B4D2E] animate-pulse" />
                <span className="font-medium text-[#15321E]">9 Years of Organic Heritage</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Subpage Hero Banner */}
      <section className="bg-[#122E1B] text-[#FAF7F2] py-12 sm:py-18 border-b border-[#E58A13]/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#122E1B]/80 to-black/55 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our 9-Year Heritage Story • Estd. 2017</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Rooted in Nature, Vedic Tradition &amp; Ethical Dairy
            </h1>
            <p className="text-sm sm:text-base text-[#D1DDD3] font-sans leading-relaxed pt-1">
              For over 9 years in Shoolagiri, Tamil Nadu, Aranya Organic Dairy Farm has stood for one unchanging promise: honest, unadulterated provisions straight from free-grazing native cows to your family table.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Trust Badges Row */}
      <TrustBadgesSection />

      {/* 4. Story Editorial Section */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#122E1B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
          
          {/* Block 1: The Problem & Our Beginning */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E58A13]/10 text-[#E58A13] text-xs font-bold uppercase tracking-wider">
                <span>The Aranya Genesis</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E] leading-snug">
                Why We Started Aranya Dairy Farm in 2017
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#5F6E62] leading-relaxed">
                <p>
                  Nearly a decade ago, commercial urban milk had become a product of industrial efficiency rather than nature’s nourishment. High-yield crossbred cows were confined in tight concrete stalls, subjected to artificial hormone injections, and their milk stripped, recombined, and homogenized with synthetic additives.
                </p>
                <p>
                  We knew that Indian families deserved better. We returned to our ancestral soil in Shoolagiri—a region blessed with rolling green hills, clean unpolluted air, and mineral-rich groundwater—to establish a peaceful sanctuary for pure indigenous Indian cattle.
                </p>
                <p>
                  At Aranya, we do not view cows as production units. They are sacred, gentle creatures who deserve dignity, abundant sunlight, green pastures, and loving care.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#122E1B]/15 shadow-xl relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/nature_hero_pasture.jpg"
                  alt="Aranya Dairy Farm Green Pastures in Shoolagiri"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-sans tracking-widest text-[#E58A13] font-bold">
                    Shoolagiri Foothills
                  </span>
                  <p className="font-serif text-lg font-bold text-[#FAF7F2] mt-0.5">
                    Pesticide-free pastures under the Tamil Nadu sun
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: The 4 Sacred Pillars Grid */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
                Our Unbreakable Standards
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E]">
                The Four Pillars of Aranya Purity
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6E62]">
                Every drop of milk and spoonful of ghee follows these timeless non-negotiable principles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-[#122E1B]/10 shadow-xs space-y-4 hover:border-[#E58A13]/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#E58A13]/10 border border-[#E58A13]/25 flex items-center justify-center text-[#E58A13]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#15321E]">
                          {pillar.title}
                        </h3>
                        <span className="text-xs font-sans font-bold text-[#E58A13]">
                          {pillar.titleTamil}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#5F6E62] leading-relaxed pt-1">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Block 3: The Vedic Bilona Craft Details */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#122E1B]/15 shadow-xl relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/a2_milk_bottle.jpg"
                  alt="Pure A2 Farm Fresh Glass Milk Bottle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-sans tracking-widest text-[#E58A13] font-bold">
                    Zero Plastic Contact
                  </span>
                  <p className="font-serif text-lg font-bold text-[#FAF7F2] mt-0.5">
                    Bottled fresh at 4°C in sterilized glass bottles
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#122E1B]/10 text-[#122E1B] text-xs font-bold uppercase tracking-wider">
                <span>Traditional Indian Alchemy</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E] leading-snug">
                Why Vedic Bilona Ghee is Different from Commercial Ghee
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#5F6E62] leading-relaxed">
                <p>
                  Industrial ghee is made by skimming raw cream with chemical separators and boiling it at extreme heat. This damages natural enzymes, produces high cholesterol oxidized fats, and destroys aroma.
                </p>
                <p>
                  At Aranya, we follow the authentic <strong>Bilona</strong> method prescribed in Charaka Samhita:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#15321E] font-medium">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                    <span>Whole raw A2 milk is cultured naturally with mother curd cultures.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                    <span>The curd is churned in both directions with a wooden churning staff (Bilona).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                    <span>The separated fresh butter (Makkhan) is slow-simmered over a gentle wood fire in clay pots.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                    <span>The result is pure, golden, granular, aromatic ghee packed with bioavailable fat-soluble vitamins A, D, E, and K.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Block 4: Timeline / Milestones */}
          <div className="space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#122E1B]/10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#15321E]">
                9 Years of Organic Stewardship
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {milestones.map((m) => (
                <div key={m.year} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/5 space-y-2.5">
                  <span className="inline-block font-serif text-2xl font-bold text-[#E58A13]">
                    {m.year}
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#15321E]">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Block 5: Call to Action Row */}
          <div className="bg-[#122E1B] text-white p-8 sm:p-12 rounded-3xl border border-[#E58A13]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                Experience Fresh A2 Farm Purity
              </h3>
              <p className="text-xs sm:text-sm text-[#D1DDD3] leading-relaxed">
                Explore our full showcase of unadulterated milk, Bilona ghee, native millets, and unpolished pulses delivered to your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
              <a
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full transition-all shadow-md min-h-[44px]"
              >
                <span>Browse Farm Products</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={WA_STORY_INQUIRY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] border border-[#E58A13]/40 active:scale-95 text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full transition-all min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-[#E58A13]" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Floating WhatsApp CTA */}
      <WhatsAppCTA />

      {/* 7. Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
        onOpenContact={() => {
          router.push('/contact');
        }}
      />

      {/* 8. Shopping Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}
