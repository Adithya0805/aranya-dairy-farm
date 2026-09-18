'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import SlimTrustLine from '@/components/SlimTrustLine';
import Footer from '@/components/Footer';
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
  Users,
  Compass,
  FileText,
} from 'lucide-react';
import {
  WHATSAPP_TEL,
  WHATSAPP_DISPLAY,
  WA_FARM_INQUIRY,
  buildWhatsAppUrl,
} from '@/lib/whatsapp';
import {
  PRIMARY_FARM_EMAIL,
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildInquiryEmailBody,
  GMAIL_GENERAL_INQUIRY,
} from '@/lib/contact';
import { submitVisitRequestAction } from '@/app/actions/visits';

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'visit' | 'inquiry'>('visit');

  // Visit Booking Form State
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);
  const [visitData, setVisitData] = useState({
    name: '',
    phone: '',
    preferred_date: '',
    time_slot: 'Morning (8-10 AM)',
    num_visitors: 2,
    notes: '',
  });

  // General Inquiry Form State
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    purpose: 'Daily Milk Subscription',
    area: '',
    notes: '',
  });

  // Calculate min date for visit (tomorrow)
  const minVisitDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Handle Farm Visit Booking Submission
  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitError(null);
    setVisitSubmitting(true);

    try {
      // 1. Submit to Supabase via Server Action
      const res = await submitVisitRequestAction({
        name: visitData.name,
        phone: visitData.phone,
        preferred_date: visitData.preferred_date,
        time_slot: visitData.time_slot,
        num_visitors: Number(visitData.num_visitors) || 1,
        notes: visitData.notes,
      });

      if (!res.success) {
        setVisitError(res.error || 'Could not save visit request. Opening WhatsApp to connect directly.');
      }

      // 2. Format WhatsApp notification message to the farm
      const msg = `🌿 *Farm Visit Booking Request*
─────────────────────
• *Name:* ${visitData.name}
• *Phone:* ${visitData.phone}
• *Preferred Date:* ${visitData.preferred_date}
• *Time Slot:* ${visitData.time_slot}
• *Visitors:* ${visitData.num_visitors} ${Number(visitData.num_visitors) === 1 ? 'Person' : 'People'}
${visitData.notes ? `• *Notes:* ${visitData.notes}\n` : ''}─────────────────────
Hello Aranya Farm, please confirm our visit slot.`;

      // 3. Open WhatsApp in new tab
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');

      // 4. Update UI to success state
      setVisitSubmitted(true);
    } catch {
      setVisitError('Network error. Opening WhatsApp directly.');
      const msg = `🌿 *Farm Visit Booking Request*
• *Name:* ${visitData.name}
• *Phone:* ${visitData.phone}
• *Date:* ${visitData.preferred_date} (${visitData.time_slot})
• *Visitors:* ${visitData.num_visitors}`;
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
      setVisitSubmitted(true);
    } finally {
      setVisitSubmitting(false);
    }
  };

  // Handle General Delivery Inquiry Submission
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  const handleInquiryWhatsAppDirect = () => {
    const msg = `Hello Aranya Dairy Farm,
My Name: ${inquiryData.name || 'A Customer'}
Phone: ${inquiryData.phone || 'N/A'}
Inquiry Type: ${inquiryData.purpose}
Delivery Area: ${inquiryData.area || 'Shoolagiri / Hosur'}
Message: ${inquiryData.notes || 'Please provide details on daily deliveries and farm products.'}`;
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const handleInquiryGmailDirect = () => {
    const body = buildInquiryEmailBody({
      name: inquiryData.name,
      phone: inquiryData.phone,
      purpose: inquiryData.purpose,
      area: inquiryData.area,
      notes: inquiryData.notes,
    });
    window.open(
      buildGmailComposeUrl({
        to: PRIMARY_FARM_EMAIL,
        subject: `Farm Inquiry: ${inquiryData.purpose} — ${inquiryData.name || 'Customer'}`,
        body,
      }),
      '_blank',
      'noopener,noreferrer'
    );
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
      icon: Mail,
      title: 'Email & Gmail',
      titleTamil: 'மின்னஞ்சல் முகவரி',
      primaryText: PRIMARY_FARM_EMAIL,
      secondaryText: 'Instant Gmail web compose for subscriptions, bulk ghee & corporate queries',
      actionLabel: 'Compose in Gmail',
      actionUrl: GMAIL_GENERAL_INQUIRY,
      isExternal: true,
    },
    {
      icon: Calendar,
      title: 'Patron Farm Visits',
      titleTamil: 'பண்ணை பார்வை நேரம்',
      primaryText: 'Open Daily by Appointment',
      secondaryText: 'Bring your family to feed our cows and witness traditional Bilona churning',
      actionLabel: 'Book Visit Slot',
      actionUrl: '#book-visit',
      isExternal: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#3E4B41] flex flex-col selection:bg-[#E58A13] selection:text-white pb-16 md:pb-0">
      {/* 1. Header Bar */}
      <Header onOpenCart={() => setCartOpen(true)} />

      {/* ── Breadcrumb Bar ── */}
      <section className="bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#122E1B]/10 py-4 sm:py-5 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
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
                  Visit &amp; Contact
                </span>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#122E1B]/5 text-[#15321E] border border-[#122E1B]/10">
                  Shoolagiri, TN
                </span>
              </div>
            </nav>

            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#5F6E62]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#122E1B]/10 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#1B4D2E] animate-pulse" />
                <span className="font-medium text-[#15321E]">Direct Farm Hotline • {WHATSAPP_DISPLAY}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Hero Banner */}
      <section className="bg-[#122E1B] text-[#FAF7F2] py-12 sm:py-18 border-b border-[#E58A13]/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#122E1B]/80 to-black/55 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Farm Contact &amp; Visitor Booking • Shoolagiri, Tamil Nadu</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Experience Real Organic Farming
            </h1>
            <p className="text-sm sm:text-base text-[#D1DDD3] font-sans leading-relaxed pt-1">
              Have questions about daily raw A2 milk delivery, hand-churned Vedic Bilona ghee, or want to bring your family to visit our free-grazing cows in Shoolagiri? Book a visit slot or reach out below.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Slim Trust Line */}
      <SlimTrustLine />

      {/* 4. Direct Reachability Cards Grid */}
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
              Located conveniently off the Bangalore-Chennai National Highway at Shoolagiri (near Hosur).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                      <h3 className="font-serif text-lg font-bold text-[#15321E]">
                        {card.title}
                      </h3>
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

      {/* 5. Split Section: Farm Location Details & Interactive Booking / Inquiry Form */}
      <section id="book-visit" className="py-16 sm:py-24 bg-white border-b border-[#122E1B]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Farm Visit Invitation & Direction Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#E58A13]">
                  Open Farm Invitation
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#15321E] leading-snug">
                  See How Your Food Is Made
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6E62] leading-relaxed">
                  Come see our cows, our milking process, and how we make Bilona ghee the traditional way. Book a visit slot below — we&apos;ll confirm on WhatsApp.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#15321E]">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#E58A13]" />
                    <span>What You Will Experience</span>
                  </div>
                  <ul className="text-xs text-[#5F6E62] leading-relaxed space-y-1 pl-4 list-disc">
                    <li>Feed and interact with native Gir &amp; Sahiwal cows grazing in chemical-free pastures</li>
                    <li>Witness calf-first, cruelty-free morning and evening milking</li>
                    <li>See authentic wooden Bilona curd-churning and earthen pot ghee preparation</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E58A13]" />
                    <span>How to Reach from Hosur &amp; Bengaluru</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    Head south on NH 44 towards Krishnagiri. Shoolagiri is located 25 km from Hosur (approx. 25-30 minutes drive) and 60 km from Electronic City, Bengaluru. The farm is 2 km from the Shoolagiri highway junction.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E58A13]" />
                    <span>Daily Milk Delivery Coverage</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    We deliver fresh chilled A2 milk daily to Hosur Town, SIPCOT, Bagalur Road, Rayakottai Road, and Shoolagiri central between 5:30 AM and 7:30 AM.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#122E1B]/10 space-y-2">
                  <div className="font-serif font-bold text-base text-[#15321E] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#E58A13]" />
                    <span>Corporate &amp; Bulk Inquiries</span>
                  </div>
                  <p className="text-xs text-[#5F6E62] leading-relaxed">
                    For bulk ghee orders, corporate gifting, or educational school visits, email{' '}
                    <a href={buildMailtoUrl({ to: PRIMARY_FARM_EMAIL })} className="font-bold text-[#E58A13] hover:underline">
                      {PRIMARY_FARM_EMAIL}
                    </a>
                  </p>
                </div>
              </div>

              {/* Justdial Verified Badge */}
              <div className="p-4 rounded-2xl bg-[#122E1B] text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#E58A13] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block text-[#FAF7F2]">Verified Local Organic Farm</span>
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

            {/* Right Column: Tabbed Booking & Inquiry Form */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-[#122E1B]/10 shadow-xs">
              
              {/* Form Mode Tabs */}
              <div className="flex items-center gap-2 p-1 bg-white border border-[#122E1B]/10 rounded-2xl mb-6 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('visit')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFormTab === 'visit'
                      ? 'bg-[#1B4D2E] text-white shadow-xs'
                      : 'text-[#5F6E62] hover:text-[#15321E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Farm Visit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('inquiry')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFormTab === 'inquiry'
                      ? 'bg-[#1B4D2E] text-white shadow-xs'
                      : 'text-[#5F6E62] hover:text-[#15321E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Delivery Inquiry</span>
                </button>
              </div>

              {/* ── TAB 1: FARM VISIT BOOKING FORM ── */}
              {activeFormTab === 'visit' && (
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#15321E] mb-1">
                    Book a Farm Visit Slot
                  </h3>
                  <p className="text-xs text-[#5F6E62] mb-6">
                    Pick your preferred date and time slot. Our farm coordinator will review and confirm on WhatsApp.
                  </p>

                  {visitSubmitted ? (
                    <div className="bg-white p-8 rounded-2xl border border-[#1B4D2E]/20 text-center space-y-4 shadow-xs">
                      <CheckCircle2 className="w-12 h-12 text-[#1B4D2E] mx-auto" />
                      <h4 className="text-xl font-serif font-bold text-[#15321E]">
                        Visit Request Sent!
                      </h4>
                      <div className="text-xs sm:text-sm text-[#5F6E62] max-w-md mx-auto leading-relaxed space-y-2">
                        <p>
                          Thank you, <span className="font-bold text-[#15321E]">{visitData.name}</span>! We have received your booking request for{' '}
                          <span className="font-semibold text-[#15321E]">{visitData.preferred_date}</span> during the{' '}
                          <span className="font-semibold text-[#15321E]">{visitData.time_slot}</span> slot ({visitData.num_visitors} {Number(visitData.num_visitors) === 1 ? 'visitor' : 'visitors'}).
                        </p>
                        <p className="font-semibold text-[#1B4D2E] bg-[#E8F5EE] p-3 rounded-xl border border-[#1B4D2E]/15">
                          We&apos;ll confirm your visit slot on WhatsApp shortly.
                        </p>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={buildWhatsAppUrl(
                            `Hello Aranya Farm, following up on my visit request for ${visitData.name} on ${visitData.preferred_date} (${visitData.time_slot}).`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sans text-xs uppercase font-bold tracking-wider py-3 px-5 rounded-full transition-colors cursor-pointer min-h-[44px]"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Chat on WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setVisitSubmitted(false);
                            setVisitData({
                              name: '',
                              phone: '',
                              preferred_date: '',
                              time_slot: 'Morning (8-10 AM)',
                              num_visitors: 2,
                              notes: '',
                            });
                          }}
                          className="w-full sm:w-auto text-xs font-sans font-semibold text-[#15321E] hover:text-[#E58A13] py-2 px-3 underline cursor-pointer"
                        >
                          Book Another Visit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVisitSubmit} className="space-y-4">
                      {visitError && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                          {visitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={visitData.name}
                            onChange={(e) => setVisitData({ ...visitData, name: e.target.value })}
                            placeholder="e.g. Priya Sundaram"
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                            Phone / WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={visitData.phone}
                            onChange={(e) => setVisitData({ ...visitData, phone: e.target.value })}
                            placeholder="e.g. 9944338612"
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                            Preferred Visit Date *
                          </label>
                          <input
                            type="date"
                            required
                            min={minVisitDate}
                            value={visitData.preferred_date}
                            onChange={(e) => setVisitData({ ...visitData, preferred_date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                          />
                          <p className="text-[11px] text-[#8A7B6E] mt-0.5">Please choose a future date.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                            Time Slot *
                          </label>
                          <select
                            value={visitData.time_slot}
                            onChange={(e) => setVisitData({ ...visitData, time_slot: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                          >
                            <option value="Morning (8-10 AM)">Morning (8-10 AM) — Cow Feeding &amp; Pasture</option>
                            <option value="Afternoon (2-4 PM)">Afternoon (2-4 PM) — Bilona Churning &amp; Farm Walk</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                          Number of Visitors
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            required
                            value={visitData.num_visitors}
                            onChange={(e) => setVisitData({ ...visitData, num_visitors: Math.max(1, Number(e.target.value)) })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                          />
                          <Users className="w-4 h-4 text-[#8A7B6E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-[#8A7B6E] mt-0.5">Including adults and children.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                          Notes / Special Requests (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={visitData.notes}
                          onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
                          placeholder="e.g. Bringing two kids, interested in seeing ghee making..."
                          className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E]"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={visitSubmitting}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4D2E] hover:bg-[#15321E] disabled:bg-[#1B4D2E]/60 active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-4 px-6 rounded-full shadow-md transition-all cursor-pointer min-h-[48px]"
                        >
                          {visitSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 text-[#E58A13]" />
                              <span>Request Visit Slot &amp; Connect on WhatsApp</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-[11px] text-[#8A7B6E] mt-2">
                          ⚡ Free of charge. Our farm coordinator confirms slots based on pasture schedule.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ── TAB 2: GENERAL DELIVERY & PRODUCT INQUIRY FORM ── */}
              {activeFormTab === 'inquiry' && (
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#15321E] mb-1">
                    Direct Delivery &amp; Product Inquiry
                  </h3>
                  <p className="text-xs text-[#5F6E62] mb-6">
                    Tell us your requirement and our farm team will reach out with pricing and delivery routes.
                  </p>

                  {inquirySubmitted ? (
                    <div className="bg-white p-8 rounded-2xl border border-[#122E1B]/15 text-center space-y-4 shadow-xs">
                      <CheckCircle2 className="w-12 h-12 text-[#E58A13] mx-auto" />
                      <h4 className="text-xl font-serif font-bold text-[#15321E]">Inquiry Received!</h4>
                      <p className="text-xs sm:text-sm text-[#5F6E62] max-w-md mx-auto leading-relaxed">
                        Thank you, <span className="font-bold text-[#15321E]">{inquiryData.name || 'Valued Patron'}</span>. We have recorded your request for{' '}
                        <span className="font-semibold text-[#15321E]">{inquiryData.purpose}</span> in{' '}
                        <span className="font-semibold text-[#15321E]">{inquiryData.area || 'Hosur / Shoolagiri'}</span>. Our coordinator will contact{' '}
                        <span className="font-bold text-[#15321E]">{inquiryData.phone}</span> shortly.
                      </p>
                      <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={handleInquiryWhatsAppDirect}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] text-white font-sans text-xs uppercase font-bold tracking-wider py-3 px-5 rounded-full transition-colors cursor-pointer min-h-[44px]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Forward to WhatsApp</span>
                        </button>
                        <button
                          onClick={handleInquiryGmailDirect}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3 px-5 rounded-full border border-[#E58A13]/30 transition-colors cursor-pointer min-h-[44px]"
                        >
                          <Mail className="w-4 h-4 text-[#E58A13]" />
                          <span>Gmail</span>
                        </button>
                        <button
                          onClick={() => setInquirySubmitted(false)}
                          className="w-full sm:w-auto text-xs font-sans font-semibold text-[#15321E] hover:text-[#E58A13] py-2 px-3 underline cursor-pointer"
                        >
                          Submit Another
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={inquiryData.name}
                            onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
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
                            value={inquiryData.phone}
                            onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
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
                            value={inquiryData.purpose}
                            onChange={(e) => setInquiryData({ ...inquiryData, purpose: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                          >
                            <option value="Daily Milk Subscription">Daily Milk Subscription</option>
                            <option value="Vedic Bilona Ghee Order">Vedic Bilona Ghee Order</option>
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
                            value={inquiryData.area}
                            onChange={(e) => setInquiryData({ ...inquiryData, area: e.target.value })}
                            placeholder="e.g. Hosur SIPCOT / Shoolagiri"
                            className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                          Notes or Delivery Requirements
                        </label>
                        <textarea
                          rows={3}
                          value={inquiryData.notes}
                          onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                          placeholder="Specify your preferred daily quantity (e.g. 1L raw milk bottle)..."
                          className="w-full px-4 py-3 rounded-xl border border-[#D1DDD3] bg-white text-base sm:text-sm focus:outline-none focus:border-[#E58A13]"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                          type="submit"
                          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full shadow-md transition-all cursor-pointer min-h-[48px]"
                        >
                          <span>Submit Inquiry</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={handleInquiryGmailDirect}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] active:scale-95 text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full border border-[#E58A13]/30 transition-all cursor-pointer min-h-[48px]"
                          title="Open inquiry details in Gmail Web Compose"
                        >
                          <Mail className="w-4 h-4 text-[#E58A13]" />
                          <span>Gmail</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleInquiryWhatsAppDirect}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] active:scale-95 text-[#15321E] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full border border-[#122E1B]/15 transition-all cursor-pointer min-h-[48px]"
                        >
                          <MessageCircle className="w-4 h-4 text-[#1B4D2E]" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
        onOpenContact={() => {}}
      />

      {/* 9. Shopping Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}
