'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { WHATSAPP_TEL, WHATSAPP_DISPLAY } from '@/lib/whatsapp';


interface FooterProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export default function Footer({ onOpenStory, onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#1C2A1C] text-[#FCFAF7] pt-16 pb-12 w-full border-t border-[#D99B26]/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Header */}
          <div className="space-y-3">
            <h3 className="font-serif text-2xl font-normal tracking-tight text-white">
              ARANYA
            </h3>
            <p className="text-xs text-[#A8B7AA] leading-relaxed">
              Aranya Organic Dairy Farm — 9+ years of providing unadulterated A2 Raw Whole Milk and Vedic Bilona Ghee from grass-fed cows in Shoolagiri.
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D99B26]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#D1DDD3]">
              <li><a href="#products" className="hover:text-white transition-colors">Shop Offerings</a></li>
              <li><button onClick={onOpenStory} className="hover:text-white transition-colors text-left">Our Heritage Story</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors text-left">Location & Contact</button></li>
            </ul>
          </div>

          {/* Offerings */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D99B26]">
              Crafted Products
            </h4>
            <ul className="space-y-2 text-xs text-[#D1DDD3]">
              <li>Raw A2 Whole Cow Milk</li>
              <li>Traditional Bilona Cow Ghee</li>
              <li>Vedic Artisanal White Butter</li>
            </ul>
          </div>

          {/* Farm Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#D99B26]">
              Shoolagiri Farm
            </h4>
            <div className="space-y-2 text-xs text-[#D1DDD3]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0 mt-0.5" />
                <span>Shoolagiri, Hosur Highway, Tamil Nadu 635117</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                <a href={WHATSAPP_TEL} className="hover:underline">{WHATSAPP_DISPLAY}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D99B26] shrink-0" />
                <a href="mailto:info@aranyadairyfarm.com" className="hover:underline">info@aranyadairyfarm.com</a>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9B8D] gap-4">
          <div>
            © {new Date().getFullYear()} Aranya Organic Dairy Farm. All rights reserved.
          </div>
          <div>
            Pure A2 • Grass-Fed Pastures • Shoolagiri
          </div>
        </div>

      </div>
    </footer>
  );
}
