'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, ExternalLink } from 'lucide-react';
import { WHATSAPP_TEL, WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  PRIMARY_FARM_EMAIL,
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildInquiryEmailBody,
} from '@/lib/contact';

export default function ContactSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="reveal-section py-20 sm:py-28 bg-[#FAF7F2] w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Farm Address & Contact Info */}
          <div className="lg:col-span-5 space-y-8 reveal-child" style={{ transitionDelay: '0ms' }}>
            <div className="space-y-4">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
                Visit Or Contact
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#15321E] leading-tight">
                Our farm in Shoolagiri.
              </h2>
              <p className="text-sm text-[#5F6E62] leading-relaxed">
                Located conveniently off the Hosur Highway. Open for weekend farm visits by prior appointment.
              </p>
            </div>

            <div className="space-y-6 text-sm text-[#15321E] border-t border-[#122E1B]/10 pt-6">
              <div>
                <strong className="block font-serif text-lg font-bold text-[#15321E]">Farm Address</strong>
                <span className="text-[#5F6E62] text-xs leading-relaxed block mt-1">
                  Shoolagiri, Hosur Krishnagiri Highway, <br />
                  Krishnagiri District, Tamil Nadu — 635117
                </span>
              </div>

              <div>
                <strong className="block font-serif text-lg font-bold text-[#15321E]">Direct Contact</strong>
                <a href={WHATSAPP_TEL} className="text-[#B84A28] text-xs font-semibold hover:underline block mt-1 py-1 min-h-[44px] inline-flex items-center touch-manipulation">
                  Phone / WhatsApp: {WHATSAPP_DISPLAY}
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <a
                    href={buildMailtoUrl({ to: PRIMARY_FARM_EMAIL })}
                    className="text-[#5F6E62] text-xs hover:underline py-1 min-h-[44px] inline-flex items-center touch-manipulation"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E58A13] mr-1.5 shrink-0" />
                    <span>{PRIMARY_FARM_EMAIL}</span>
                  </a>
                  <a
                    href={buildGmailComposeUrl({
                      to: PRIMARY_FARM_EMAIL,
                      subject: 'Inquiry — Aranya Organic Dairy Farm',
                      body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to inquire about:',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#E58A13] hover:text-white bg-[#E58A13]/10 hover:bg-[#E58A13] px-2.5 py-1 rounded-full transition-all duration-150 touch-manipulation"
                    title="Compose directly in Gmail web"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <a
                  href="https://maps.google.com/?q=Shoolagiri+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial min-h-[44px] inline-flex items-center touch-manipulation"
                >
                  <span>Open Location in Google Maps</span>
                  <ArrowRight className="w-4 h-4 text-[#E58A13]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-12 rounded-3xl border border-[#122E1B]/10 shadow-xs reveal-child" style={{ transitionDelay: '100ms' }}>
            <h3 className="text-2xl font-serif font-bold text-[#15321E] mb-2">
              Send a Delivery Inquiry
            </h3>
            <p className="text-xs text-[#5F6E62] mb-6">
              Fill in your details below and our farm coordinator will get in touch with you.
            </p>

            {submitted ? (
              <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#122E1B]/20 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#E58A13] mx-auto" />
                <h4 className="text-xl font-serif font-bold text-[#15321E]">Inquiry Received</h4>
                <p className="text-xs text-[#5F6E62] leading-relaxed">
                  Thank you, <span className="font-bold text-[#15321E]">{formData.name || 'Valued Patron'}</span>! We will reach out to <span className="font-bold text-[#15321E]">{formData.phone}</span> shortly regarding deliveries in <span className="font-semibold text-[#15321E]">{formData.location || 'Hosur / Shoolagiri'}</span>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={buildGmailComposeUrl({
                      to: PRIMARY_FARM_EMAIL,
                      subject: `Delivery Inquiry — ${formData.name || 'Customer'} (${formData.location || 'Hosur'})`,
                      body: buildInquiryEmailBody({
                        name: formData.name,
                        phone: formData.phone,
                        purpose: 'Daily Delivery Inquiry',
                        area: formData.location,
                        notes: formData.notes,
                      }),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full border border-[#E58A13]/30 transition-all min-h-[46px] shadow-sm"
                    title="Open this inquiry directly in Gmail"
                  >
                    <Mail className="w-4 h-4 text-[#E58A13]" />
                    <span>Send via Gmail Now</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto link-editorial min-h-[44px] inline-flex items-center justify-center touch-manipulation text-xs"
                  >
                    <span>Submit Another Inquiry →</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Adithya Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FAF7F2] text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FAF7F2] text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                      Delivery Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Hosur Town / Shoolagiri"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FAF7F2] text-base sm:text-sm focus:outline-none focus:border-[#E58A13] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#15321E] mb-1">
                    Notes or Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us if you want morning delivery or weekend farm visit..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FAF7F2] text-base sm:text-sm focus:outline-none focus:border-[#E58A13] focus:ring-2 focus:ring-[#E58A13]/15 transition-all duration-150"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-6 rounded-full shadow-lg shadow-[#E58A13]/25 transition-all duration-150 cursor-pointer min-h-[48px] touch-manipulation"
                  >
                    <span>Submit Order Inquiry</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <a
                    href={buildGmailComposeUrl({
                      to: PRIMARY_FARM_EMAIL,
                      subject: `Delivery Inquiry — ${formData.name || 'Customer'} (${formData.location || 'Hosur'})`,
                      body: buildInquiryEmailBody({
                        name: formData.name,
                        phone: formData.phone,
                        purpose: 'Delivery Inquiry',
                        area: formData.location,
                        notes: formData.notes,
                      }),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C3E25] hover:bg-[#244F30] active:scale-95 text-[#FAF7F2] font-sans text-xs uppercase font-bold tracking-wider py-3.5 px-5 rounded-full border border-[#E58A13]/30 transition-all cursor-pointer min-h-[48px] touch-manipulation shadow-xs"
                    title="Send this delivery inquiry directly using Gmail web"
                  >
                    <Mail className="w-4 h-4 text-[#E58A13]" />
                    <span>Send via Gmail</span>
                  </a>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
