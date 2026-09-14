'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  WHATSAPP_TEL,
  WHATSAPP_DISPLAY,
  WA_FARM_INQUIRY,
  buildWhatsAppUrl,
} from '@/lib/whatsapp';

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'Daily Milk Subscription',
    area: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const msg = `Hello Aranya Dairy Farm,
My Name: ${formData.name || 'A Customer'}
Phone: ${formData.phone || 'N/A'}
Inquiry Type: ${formData.purpose}
Delivery Area: ${formData.area || 'Shoolagiri / Hosur'}
Message: ${formData.notes || 'Please provide details on daily deliveries and farm products.'}`;
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  const contactCards = [
    {
      icon: MapPin,
      title: 'Farm Location',
      titleTamil: 'பண்ணை முகவரி',
      primaryText: 'Shoolagiri, Hosur Krishnagiri Highway',
      secondaryText: 'Krishnagiri District, Tamil Nadu — 635117',
      actionLabel: 'Open Google Maps',
      actionUrl: 'https://maps.google.com/?q=Shoolagiri+Tamil+Nadu',
      isExternal: true,
    },
    {
      icon: Phone,
      title: 'Phone & WhatsApp',
      titleTamil: 'தொலைபேசி மற்றும் வாட்ஸ்அப்',
      primaryText: WHATSAPP_DISPLAY,
      secondaryText: 'Instant replies daily from 6:00 AM to 8:30 PM',
      actionLabel: 'Call Farm Direct',
      actionUrl: WHATSAPP_TEL,
      isExternal: false,
    },
    {
      icon: Clock,
      title: 'Morning Delivery Hours',
      titleTamil: 'காலை விநியோக நேரம்',
      primaryText: '5:30 AM – 7:30 AM Daily',
      secondaryText: 'Chilled at 4°C in sterilized eco glass bottles across Hosur & Shoolagiri',
      actionLabel: 'Inquire About Route',
      actionUrl: WA_FARM_INQUIRY,
      isExternal: true,
    },
    {
      icon: Calendar,
      title: 'Patron Farm Visits',
      titleTamil: 'பண்ணை பார்வை நேரம்',
      primaryText: 'Weekends by Appointment',
      secondaryText: 'Bring your family to feed our Gir cows and witness traditional Bilona churning',
      actionLabel: 'Schedule a Visit',
      actionUrl: buildWhatsAppUrl('Hello Aranya Dairy Farm, I would like to schedule a weekend farm visit with my family.'),
      isExternal: true,
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
                  Contact &amp; Location
                </span>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#122E1B]/5 text-[#15321E] border border-[#122E1B]/10">
                  Shoolagiri, TN
                </span>
              </div>
            </nav>

            {/* Status Pill on Right */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#5F6E62]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#122E1B]/10 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#1B4D2E] animate-pulse" />
                <span className="font-medium text-[#15321E]">Direct Farm Hotline • +91 88257 14576</span>
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
              <span>Direct Farm Contact • Shoolagiri, Tamil Nadu</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Get in Touch with Our Shoolagiri Farm
            </h1>
            <p className="text-sm sm:text-base text-[#D1DDD3] font-sans leading-relaxed pt-1">
              Have questions about starting your daily morning raw A2 milk delivery, ordering hand-churned Vedic Bilona ghee, or visiting our pasture with your family? Reach out to us directly.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Trust Badges Row */}
      <TrustBadgesSection />

      {/* 4. 4 Direct Contact Cards Grid */}
      <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#122E1B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
              Direct Reachability
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E]">
              How to Reach Aranya Dairy Farm
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6E62]">
              Located conveniently off the Bangalore-Chennai National Highway at Shoolagiri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-[#122E1B]/10 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#E58A13]/50 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E58A13]/10 border border-[#E58A13]/25 flex items-center justify-center text-[#E58A13] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-[#15321E]">
                          {card.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-sans font-semibold text-[#E58A13]">
                        {card.titleTamil}
                      </span>
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="text-sm font-semibold text-[#15321E]">
                        {card.primaryText}
                      </div>
                      <div className="text-xs text-[#5F6E62] leading-relaxed">
                        {card.secondaryText}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#122E1B]/5">
                    <a
                      href={card.actionUrl}
                      target={card.isExternal ? '_blank' : undefined}
                      rel={card.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#15321E] hover:text-[#E58A13] transition-colors py-1 cursor-pointer"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E58A13]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Split Section: Farm Location Details & Quick Inquiry Form */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#122E1B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Farm Visit & Delivery Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
                  Farm Guidelines &amp; Locations
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E] leading-snug">
                  Experience Real Pastures in Shoolagiri
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6E62] leading-relaxed">
                  We believe in 100% transparency. Our farm gates are open for existing subscribers and curious families who want to understand where their milk originates.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#15321E]">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E58A13]" />
                    <span>How to Reach from Hosur</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    Head south on NH 44 towards Krishnagiri. Shoolagiri is located 25 km from Hosur (approx. 25-30 minutes drive). The farm is located 2 km from the Shoolagiri junction.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E58A13]" />
                    <span>Daily Delivery Coverage</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    We deliver every morning to Hosur Town, SIPCOT, Bagalur Road, Rayakottai Road, and Shoolagiri central routes between 5:30 AM and 7:30 AM.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#E58A13]" />
                    <span>Email &amp; Business Inquiries</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    For corporate gifting, bulk Bilona ghee orders, or school visits, write to{' '}
                    <a href="mailto:info@aranyadairyfarm.com" className="font-bold text-[#E58A13] hover:underline">
                      info@aranyadairyfarm.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Justdial Verified Badge */}
              <div className="p-4 rounded-2xl bg-[#122E1B] text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#E58A13] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block text-[#FAF7F2]">Verified Local Business</span>
                    <span className="text-[#A8B7AA]">Rated 3.6★ on Justdial Hosur</span>
                  </div>
                </div>
                <a
                  href="https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#E58A13] hover:underline"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Column: Clean Editorial Form */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-[#122E1B]/10 shadow-xs">
              <h3 className="text-2xl font-serif font-bold text-[#15321E] mb-1">
                Direct Inquiry Form
              </h3>
              <p className="text-xs text-[#5F6E62] mb-6">
                Tell us your requirement and our farm manager will call or message you promptly.
              </p>

              {submitted ? (
                <div className="bg-white p-8 rounded-2xl border border-[#122E1B]/15 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#E58A13] mx-auto" />
                  <h4 className="text-xl font-serif font-bold text-[#15321E]">Inquiry Received!</h4>
                  <p className="text-xs sm:text-sm text-[#5F6E62] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-[#15321E]">{formData.name || 'Valued Patron'}</span>. We have recorded your request for{' '}
                    <span className="font-semibold text-[#15321E]">{formData.purpose}</span> in{' '}
                    <span className="font-semibold text-[#15321E]">{formData.area || 'Hosur / Shoolagiri'}</span>. Our coordinator will contact{' '}
                    <span className="font-bold text-[#15321E]">{formData.phone}</span> shortly.
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] text-white font-sans text-xs uppercase font-bold tracking-wider py-3 px-6 rounded-full hover:bg-[#CA7508] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Forward to WhatsApp Now</span>
                    </button>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto text-xs font-sans font-semibold text-[#15321E] hover:text-[#E58A13] py-2 px-4 underline"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                        Inquiry Purpose
                      </label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                      >
                        <option value="Daily Milk Subscription">Daily Milk Subscription</option>
                        <option value="Vedic Bilona Ghee Order">Vedic Bilona Ghee Order</option>
                        <option value="Weekend Farm Visit">Weekend Farm Visit</option>
                        <option value="Millets & Organic Pulses">Millets &amp; Organic Pulses</option>
                        <option value="Other Inquiries">Other Inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                        Delivery Area / City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. Hosur SIPCOT / Shoolagiri"
                        className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                      Notes or Special Delivery Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Specify your preferred quantity (e.g. 1L daily glass bottle) or preferred visit date..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full shadow-md transition-all cursor-pointer min-h-[48px]"
                    >
                      <span>Submit Inquiry</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] active:scale-95 text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full border border-[#E58A13]/30 transition-all cursor-pointer min-h-[48px]"
                    >
                      <MessageCircle className="w-4 h-4 text-[#E58A13]" />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Floating WhatsApp CTA */}
      <WhatsAppCTA />

      {/* 8. Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
        onOpenContact={() => {}}
      />

      {/* 9. Shopping Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}
