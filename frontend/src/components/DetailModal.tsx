'use client';

import React from 'react';
import { X, CheckCircle, MessageSquare } from 'lucide-react';

export interface ModalContent {
  title: string;
  subtitle?: string;
  category?: string;
  image?: string;
  bodyParagraphs: string[];
  bulletPoints?: string[];
  ctaLabel?: string;
  whatsappMessage?: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ModalContent | null;
}

export default function DetailModal({ isOpen, onClose, content }: DetailModalProps) {
  if (!isOpen || !content) return null;

  const defaultWhatsappMsg = encodeURIComponent(
    `Hello Aranya Dairy Farm, I'd like to learn more about ${content.title}.`
  );
  const finalWhatsappMsg = content.whatsappMessage
    ? encodeURIComponent(content.whatsappMessage)
    : defaultWhatsappMsg;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#FCFAF7] h-full shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#1B4D2E]/10 animate-in slide-in-from-right duration-300">
        
        <div>
          {/* Drawer Header */}
          <div className="sticky top-0 bg-[#FCFAF7]/95 backdrop-blur-md px-6 py-5 border-b border-[#1B4D2E]/10 flex items-center justify-between z-10">
            {content.category && (
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#6B472B]">
                {content.category}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#1C241E] hover:text-[#1B4D2E] rounded-full hover:bg-[#1B4D2E]/5 transition-colors ml-auto"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optional Header Image */}
          {content.image && (
            <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1B4D2E]/5 border-b border-[#1B4D2E]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Drawer Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
                {content.title}
              </h2>
              {content.subtitle && (
                <p className="text-sm text-[#6B472B] font-medium mt-1">
                  {content.subtitle}
                </p>
              )}
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm text-[#4A574E] leading-relaxed font-sans">
              {content.bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bullet Highlights */}
            {content.bulletPoints && content.bulletPoints.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#1B4D2E]/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C241E]">
                  Key Standards & Details
                </h4>
                <ul className="space-y-2.5">
                  {content.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2C3E2A]">
                      <CheckCircle className="w-4 h-4 text-[#1B4D2E] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-[#1B4D2E]/10 bg-[#F4EFEC]/50 space-y-3">
          <a
            href={`https://wa.me/919876543210?text=${finalWhatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#1C241E] hover:bg-[#1B4D2E] text-white font-sans text-xs uppercase font-semibold tracking-wider py-4 px-6 rounded-none flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#D99B26]" />
            <span>{content.ctaLabel || 'Inquire on WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="w-full text-center text-xs text-[#6B472B] hover:underline font-medium py-1"
          >
            Back to Nature View
          </button>
        </div>

      </div>
    </div>
  );
}
