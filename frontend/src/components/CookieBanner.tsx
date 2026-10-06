'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'aranya_cookie_consent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setShowBanner(true);
      }
    } catch {
      // In case localStorage is blocked by user privacy settings
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // Ignore storage write errors
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      role="region"
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      <div className="bg-[#122E1B] text-[#FAF7F2] p-3.5 sm:px-4 sm:py-3.5 rounded-2xl shadow-xl border border-[#FAF7F2]/10 backdrop-blur-md flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-[#E58A13] shrink-0" aria-hidden="true" />
          <p className="text-xs text-[#FAF7F2]/90 leading-snug">
            We use basic analytics to improve this site.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#E58A13] hover:bg-[#CA7508] active:scale-95 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs min-h-[36px]"
        >
          Accept
        </button>
      </div>
    </aside>
  );
}
