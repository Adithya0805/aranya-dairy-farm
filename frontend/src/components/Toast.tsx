'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number; // ms, default 2500
}

export default function Toast({ message, show, onHide, duration = 2500 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 300); // allow fade-out before clearing
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[80]
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <div className="flex items-center gap-3 bg-[#1C2A1C] text-white px-5 py-3.5 rounded-full shadow-2xl min-w-[240px] max-w-[90vw]">
        <CheckCircle className="w-4 h-4 text-[#4ADE80] shrink-0" />
        <span className="text-sm font-sans font-medium flex-1">{message}</span>
        <button
          onClick={() => { setVisible(false); setTimeout(onHide, 300); }}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
