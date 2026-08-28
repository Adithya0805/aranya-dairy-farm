'use client';

import React from 'react';
import { Leaf, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#4A3525] text-white pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4D2E] flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-[#E5A93C]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ARANYA
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Aranya Organic Dairy Farm — 9+ years of providing unadulterated A2 Raw Whole Milk and Vedic Bilona Ghee from grass-fed cows in Shoolagiri, Hosur.
            </p>
            <div className="text-xs text-[#E5A93C] font-semibold">
              Project Code: ARY-2026 (Phase 1 Frontend)
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E5A93C] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><a href="#about" className="hover:text-[#E5A93C] transition-colors">Our 9-Year Story</a></li>
              <li><a href="#products" className="hover:text-[#E5A93C] transition-colors">A2 Milk & Dairy Products</a></li>
              <li><a href="#process" className="hover:text-[#E5A93C] transition-colors">4-Step Hygiene Process</a></li>
              <li><a href="#reviews" className="hover:text-[#E5A93C] transition-colors">Justdial & Customer Reviews</a></li>
              <li><a href="#contact" className="hover:text-[#E5A93C] transition-colors">Farm Location & Contact</a></li>
            </ul>
          </div>

          {/* Offerings */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E5A93C] uppercase tracking-wider">
              Fresh Products
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>Raw A2 Whole Cow Milk</li>
              <li>Traditional Bilona Cow Ghee</li>
              <li>Fresh Cottage Cheese (Paneer)</li>
              <li>Organic Set Thick Curd</li>
              <li>Pure Desi White Butter</li>
            </ul>
          </div>

          {/* Address & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#E5A93C] uppercase tracking-wider">
              Farm Location
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>Shoolagiri, Hosur Highway, Krishnagiri DT, Tamil Nadu 635117</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>info@aranyadairyfarm.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Aranya Organic Dairy Farm. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>for Organic Dairy Excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
