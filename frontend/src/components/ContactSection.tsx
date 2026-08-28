'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
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
    <section id="contact" className="py-20 sm:py-28 bg-[#FCFAF7] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Farm Address & Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
                Visit Or Contact
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C241E] leading-tight">
                Our farm in Shoolagiri.
              </h2>
              <p className="text-sm text-[#57655B] leading-relaxed">
                Located conveniently off the Hosur Highway. Open for weekend farm visits by prior appointment.
              </p>
            </div>

            <div className="space-y-6 text-sm text-[#1C241E] border-t border-[#1B4D2E]/10 pt-6">
              <div>
                <strong className="block font-serif text-lg font-bold text-[#1B4D2E]">Farm Address</strong>
                <span className="text-[#57655B] text-xs leading-relaxed block mt-1">
                  Shoolagiri, Hosur Krishnagiri Highway, <br />
                  Krishnagiri District, Tamil Nadu — 635117
                </span>
              </div>

              <div>
                <strong className="block font-serif text-lg font-bold text-[#1B4D2E]">Direct Contact</strong>
                <a href="tel:+919876543210" className="text-[#6B472B] text-xs font-semibold hover:underline block mt-1">
                  Phone / WhatsApp: +91 98765 43210
                </a>
                <a href="mailto:info@aranyadairyfarm.com" className="text-[#57655B] text-xs hover:underline block mt-0.5">
                  info@aranyadairyfarm.com
                </a>
              </div>

              <div>
                <a
                  href="https://maps.google.com/?q=Shoolagiri+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial"
                >
                  <span>Open Location in Google Maps</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-[#1B4D2E]/10 shadow-xs">
            <h3 className="text-2xl font-serif font-bold text-[#1C241E] mb-2">
              Send a Delivery Inquiry
            </h3>
            <p className="text-xs text-[#57655B] mb-6">
              Fill in your details below and our farm coordinator will get in touch with you.
            </p>

            {submitted ? (
              <div className="bg-[#F4F8F5] p-8 rounded-2xl border border-[#1B4D2E]/20 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#1B4D2E] mx-auto" />
                <h4 className="text-xl font-serif font-bold text-[#1C241E]">Inquiry Received</h4>
                <p className="text-xs text-[#57655B]">
                  Thank you! We will reach out to <span className="font-bold text-[#1B4D2E]">{formData.phone}</span> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="link-editorial mt-2"
                >
                  <span>Submit Another Inquiry →</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Adithya Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FCFAF7] text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FCFAF7] text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1">
                      Delivery Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Hosur Town / Shoolagiri"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FCFAF7] text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C241E] mb-1">
                    Notes or Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us if you want morning delivery or weekend farm visit..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E8ECE9] bg-[#FCFAF7] text-base sm:text-sm focus:outline-none focus:border-[#1B4D2E]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-single w-full font-bold text-sm mt-2 min-h-[48px]"
                >
                  <span>Submit Order Inquiry</span>
                  <ArrowRight className="w-4 h-4 text-[#D99B26]" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
