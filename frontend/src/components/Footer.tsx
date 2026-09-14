'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { WHATSAPP_TEL, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

interface FooterProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Footer({ onOpenStory: _onOpenStory, onOpenContact: _onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#122E1B] text-[#FAF7F2] pt-16 pb-12 w-full border-t border-[#E58A13]/25 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-12 border-b border-white/10">
          
          {/* Column 1: Logo + Short Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#E58A13]/40 shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/aranya-logo.png"
                  alt="Aranya Organic Dairy Farm Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF7F2] leading-none">
                  ARANYA
                </span>
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#E58A13] font-semibold mt-1">
                  Organic Dairy
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#D1DDD3] leading-relaxed max-w-sm">
              Aranya Organic Dairy Farm — 9+ years of providing unadulterated A2 Raw Whole Milk, traditional Bilona Ghee, and farm-fresh provisions from grass-fed cows in Shoolagiri, Tamil Nadu.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#E58A13]">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D1DDD3]">
              <li>
                <Link href="/products" className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors">
                  Shop All Provisions
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors">
                  Featured Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/story"
                  className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors text-left cursor-pointer"
                >
                  Our 9-Year Heritage Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors text-left cursor-pointer"
                >
                  Location &amp; Farm Visit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories & Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#E58A13]">
              Farm &amp; Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#D1DDD3]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                <span>Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu 635117</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E58A13] shrink-0" />
                <a href={WHATSAPP_TEL} className="hover:text-[#E58A13] hover:underline underline-offset-4">
                  {WHATSAPP_DISPLAY} (WhatsApp / Phone)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E58A13] shrink-0" />
                <a href="mailto:info@aranyadairyfarm.com" className="hover:text-[#E58A13] hover:underline underline-offset-4">
                  info@aranyadairyfarm.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#A8B7AA]">
                <Clock className="w-3.5 h-3.5 text-[#E58A13] shrink-0" />
                <span>Morning Delivery: 5:30 AM – 7:30 AM</span>
              </div>
              <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E58A13] shrink-0" />
                <a
                  href="https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E58A13] hover:underline underline-offset-4 flex items-center gap-1 text-[#D1DDD3] transition-colors"
                >
                  <span>Verified Business · Justdial (3.6★)</span>
                  <ExternalLink className="w-3 h-3 text-[#A8B7AA]" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9B8D] gap-4">
          <div>
            © {new Date().getFullYear()} Aranya Organic Dairy Farm. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Pure A2 • Grass-Fed Pastures • Shoolagiri, Tamil Nadu
          </div>
        </div>

      </div>
    </footer>
  );
}
