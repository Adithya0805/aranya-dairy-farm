'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: 'A2 Raw Milk (1L)',
    location: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-organic text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#1B4D2E]" />
            <span>Visit Or Contact Our Farm</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1B4D2E] tracking-tight">
            Get Fresh Dairy Delivered
          </h2>

          <p className="text-base text-[#64748B]">
            Have questions about daily delivery, farm visits, or bulk orders? Connect with us directly!
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Farm Address & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#1B4D2E]/10 space-y-6 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#1B4D2E]">
                Aranya Organic Dairy Farm
              </h3>

              <div className="space-y-4 text-sm text-[#1E293B]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#1B4D2E] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B4D2E] font-serif text-base">Farm Address</strong>
                    <span className="text-[#64748B] leading-relaxed block mt-0.5">
                      Shoolagiri, Hosur Krishnagiri Highway, <br />
                      Krishnagiri District, Tamil Nadu — 635117
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#1B4D2E] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B4D2E] font-serif text-base">Direct Phone / WhatsApp</strong>
                    <a href="tel:+919876543210" className="text-[#7A5230] font-semibold hover:underline block mt-0.5">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#1B4D2E] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B4D2E] font-serif text-base">Email Inquiries</strong>
                    <a href="mailto:info@aranyadairyfarm.com" className="text-[#64748B] hover:underline block mt-0.5">
                      info@aranyadairyfarm.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#1B4D2E] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B4D2E] font-serif text-base">Delivery Timings</strong>
                    <span className="text-[#64748B] block mt-0.5">
                      Morning: 6:00 AM – 8:30 AM <br />
                      Evening: 5:00 PM – 7:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-[#1B4D2E]/10">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Aranya%20Dairy%20Farm,%20I'd%20like%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-5 h-5 text-[#4A3525]" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Location Map Placeholder Card */}
            <div className="bg-[#FCFAF7] rounded-3xl p-6 border border-[#1B4D2E]/10 text-center space-y-3">
              <div className="text-3xl">📍</div>
              <h4 className="font-serif font-bold text-[#1B4D2E]">Shoolagiri Farm Location</h4>
              <p className="text-xs text-[#64748B]">
                Conveniently located off the Hosur Highway. Open for weekend visitor tours by prior appointment.
              </p>
              <a
                href="https://maps.google.com/?q=Shoolagiri+Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#7A5230] hover:text-[#1B4D2E] underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Order / Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#1B4D2E]/10 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-[#1B4D2E] mb-2">
              Request Delivery / Sample Pack
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Fill out your details and our team will get in touch with you within 2 hours to confirm your delivery schedule.
            </p>

            {submitted ? (
              <div className="bg-[#E8F5E9] p-8 rounded-2xl border border-[#1B4D2E]/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#1B4D2E] mx-auto" />
                <h4 className="text-xl font-serif font-bold text-[#1B4D2E]">Thank You!</h4>
                <p className="text-xs text-[#1E293B]">
                  Your request has been received. Our farm coordinator will contact you shortly at <span className="font-bold text-[#7A5230]">{formData.phone}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline px-6 py-2 rounded-lg text-xs font-bold mt-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Adithya Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4D2E] transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4D2E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1">
                      Delivery Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Hosur Town / Shoolagiri"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4D2E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1">
                    Interested Product *
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4D2E] transition-colors"
                  >
                    <option value="A2 Raw Milk (1L)">Raw A2 Whole Cow Milk (1L)</option>
                    <option value="Traditional Bilona Ghee (500ml)">Traditional Bilona Cow Ghee (500ml)</option>
                    <option value="Fresh Farm Paneer (200g)">Fresh Farm Cottage Cheese / Paneer (200g)</option>
                    <option value="Set Curd (500g)">Organic Set Thick Curd (500g)</option>
                    <option value="Pure Desi White Butter (250g)">Pure Desi White Butter (250g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1">
                    Special Notes / Delivery Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us if you want morning delivery or weekend sample pack..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4D2E] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2"
                >
                  <Send className="w-4 h-4 text-[#E5A93C]" />
                  <span>Send Order Request</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
