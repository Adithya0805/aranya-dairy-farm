'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  tag?: string;
  caption?: string;
}

export default function PhotoLightboxModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  tag,
  caption,
}: PhotoLightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt || 'Expanded farm photograph'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center bg-[#122E1B] border border-[#D48B16]/30 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close photo preview"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Frame */}
        <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto max-h-[70vh] object-contain select-none"
          />
        </div>

        {/* Caption Bar */}
        {(tag || caption) && (
          <div className="w-full p-4 sm:p-6 bg-[#122E1B] text-[#FAF7F2] border-t border-white/10 space-y-1 text-left">
            {tag && (
              <span className="text-xs uppercase font-sans tracking-widest text-[#D48B16] font-bold block">
                {tag}
              </span>
            )}
            {caption && (
              <p className="font-serif text-base sm:text-lg font-bold text-[#FAF7F2]">
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
