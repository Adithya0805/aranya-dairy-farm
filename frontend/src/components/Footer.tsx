'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { WHATSAPP_TEL, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

interface FooterProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Footer({ onOpenStory, onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#122E1B] text-[#FAF7F2] pt-16 pb-12 w-full border-t border-[#E58A13]/25 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-12 border-b border-white/10">
          
          {/* Column 1: Logo + Short Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-3xl font-normal tracking-tight text-[#FAF7F2]">
                ARANYA
              </span>
              <span className="h-4 w-px bg-[#E58A13]/40" />
              <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#E58A13] font-semibold">
                Organic Dairy
              </span>
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
                <a href="#shop" className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors">
                  Shop All Provisions
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors">
                  Featured Categories
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenStory}
                  className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors text-left cursor-pointer"
                >
                  Our 9-Year Heritage Story
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#E58A13] hover:underline underline-offset-4 transition-colors text-left cursor-pointer"
                >
                  Location &amp; Farm Visit
                </button>
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
