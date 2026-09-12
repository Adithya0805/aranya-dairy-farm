'use client';

import React from 'react';
import { X, CheckCircle, MessageSquare } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';


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
      <div className="relative w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-[#122E1B]/10 animate-in slide-in-from-right duration-300">
        
        <div>
          {/* Drawer Header */}
          <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md px-6 py-5 border-b border-[#122E1B]/10 flex items-center justify-between z-10">
            {content.category && (
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#B84A28]">
                {content.category}
              </span>
            )}
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#15321E] hover:text-[#E58A13] rounded-full hover:bg-[#122E1B]/5 active:scale-95 transition-all ml-auto cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optional Header Image */}
          {content.image && (
            <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#122E1B]/5 border-b border-[#122E1B]/10">
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
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#15321E]">
                {content.title}
              </h2>
              {content.subtitle && (
                <p className="text-sm text-[#B84A28] font-medium mt-1">
                  {content.subtitle}
                </p>
              )}
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm text-[#5F6E62] leading-relaxed font-sans">
              {content.bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bullet Highlights */}
            {content.bulletPoints && content.bulletPoints.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#122E1B]/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#15321E]">
                  Key Standards & Details
                </h4>
                <ul className="space-y-2.5">
                  {content.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#15321E]">
                      <CheckCircle className="w-4 h-4 text-[#E58A13] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-[#122E1B]/10 bg-[#FAF7F2] space-y-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${finalWhatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] bg-[#E58A13] hover:bg-[#CA7508] active:scale-[0.98] text-white font-sans text-xs uppercase font-bold tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E58A13]/20"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{content.ctaLabel || 'Inquire on WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="w-full min-h-[44px] flex items-center justify-center text-center text-xs text-[#B84A28] hover:underline active:scale-95 font-medium py-1 transition-all cursor-pointer"
          >
            Back to Nature View
          </button>
        </div>

      </div>
    </div>
  );
}
