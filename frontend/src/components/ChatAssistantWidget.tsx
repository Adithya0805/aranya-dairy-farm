'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
} from 'lucide-react';
import { WHATSAPP_DISPLAY, WA_GENERAL_ORDER, buildWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasOrderIntent?: boolean;
}

const QUICK_QUESTIONS = [
  'What are your delivery timings and days?',
  'Which delivery areas do you cover?',
  'What products are currently available?',
  'How much is 1L A2 cow milk?',
  'How is your traditional Bilona ghee made?',
  'Are your cows free-roaming and grass-fed?',
];

export default function ChatAssistantWidget() {
  const pathname = usePathname();
  const { items, buildWhatsAppMessage } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "Vanakkam & Hello! I am the **Aranya Farm Assistant**.\n\nI can answer questions about our **daily morning delivery**, **delivery areas in Hosur & Shoolagiri**, **available products**, and our **ethical A2 organic practices**.\n\n*When you're ready to place an order, tap **Continue on WhatsApp** to connect directly with our farm team!*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadNotification, setUnreadNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Do not render chat widget on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadNotification(false);
      // Focus input field on desktop when opened
      if (window.innerWidth >= 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, messages]);

  const handleWhatsAppHandoff = (customContext?: string) => {
    if (items.length > 0) {
      const cartMsg = buildWhatsAppMessage();
      window.open(buildWhatsAppUrl(cartMsg), '_blank', 'noopener,noreferrer');
      return;
    }

    const handoffText = customContext
      ? `Hello Aranya Dairy Farm, I was chatting with your website assistant regarding: "${customContext}". I would like to inquire directly or place an order.`
      : "Hello Aranya Dairy Farm, I'm reaching out from your website chat assistant to inquire and place an order!";

    window.open(buildWhatsAppUrl(handoffText), '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Too many messages sent. Please wait a moment.');
        }
        throw new Error('Failed to get a response from the farm assistant.');
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I couldn't retrieve that information right now. Please reach out on WhatsApp!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasOrderIntent: Boolean(data.hasOrderIntent),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Network connection error. Please try again.';
      const fallbackMsg: Message = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${errMsg}\n\nYou can always reach our farm team directly on WhatsApp at **${WHATSAPP_DISPLAY}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasOrderIntent: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "Chat restarted! Feel free to ask about our **milking schedule**, **daily delivery in Hosur & Shoolagiri**, or **A2 products**.\n\nTap **Continue on WhatsApp** whenever you are ready to order!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  /**
   * Simple helper to render bold text and line breaks cleanly.
   */
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Parse markdown bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={line.startsWith('•') || line.startsWith('-') ? 'pl-2 my-0.5' : 'my-1'}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-[#15321E]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={partIdx} className="italic text-[#4F5E52]">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── 1. Floating Chat Bubble Launcher ───────────────────────────────── */}
      {/* Mobile: bottom-[8.5rem] right-4 (stacked 16px ABOVE WhatsApp at bottom-20, clear of nav at bottom-0) */}
      {/* Desktop (sm+): sm:bottom-22 sm:right-6 (stacked directly above WhatsApp at sm:bottom-6 sm:right-6) */}
      <div className="fixed bottom-[8.5rem] right-4 sm:bottom-22 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close farm AI chat assistant' : 'Open farm AI chat assistant'}
          className="relative flex items-center justify-center gap-2.5 bg-[#15321E] hover:bg-[#1C3E25] active:scale-95 text-white p-3 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl border-2 border-[#E58A13]/80 transition-all duration-200 cursor-pointer min-h-[48px] min-w-[48px] touch-manipulation group"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF7F2] transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#E58A13]" />
                <Sparkles className="w-3 h-3 text-[#E58A13] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-bold text-xs sm:text-sm font-sans tracking-wide hidden sm:inline-block text-[#FAF7F2]">
                Ask Farm AI
              </span>
            </>
          )}

          {/* Unread dot / badge */}
          {unreadNotification && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E58A13] rounded-full border-2 border-white animate-bounce" />
          )}
        </button>
      </div>

      {/* ── 2. Chat Assistant Window ────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Aranya Farm AI Chat Assistant"
          aria-modal="true"
          className={`
            fixed z-50 flex flex-col bg-[#FAF7F2] shadow-2xl border border-[#122E1B]/20 rounded-2xl overflow-hidden
            /* Mobile layout (e.g. 375px width): inset from edges, comfortably above bottom nav */
            inset-x-3 bottom-20 top-16
            /* Desktop layout: compact bottom-right floating window */
            sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[580px] sm:max-h-[85vh]
            animate-in fade-in zoom-in-95 duration-200
          `}
        >
          {/* Header */}
          <div className="bg-[#15321E] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#E58A13]/30 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1C3E25] border border-[#E58A13]/40 flex items-center justify-center text-[#E58A13] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm text-[#FAF7F2] leading-none">
                    Aranya Farm AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-[#E58A13] text-[#15321E] uppercase tracking-wider">
                    FAQ
                  </span>
                </div>
                <p className="text-[11px] text-[#A8B7AA] font-sans mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Grounded on real farm facts</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart conversation"
                aria-label="Restart chat"
                className="p-1.5 text-[#A8B7AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="p-1.5 text-[#A8B7AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Handoff Banner in Header */}
          <div className="bg-[#1C3E25] px-3.5 py-2 border-b border-[#122E1B]/15 flex items-center justify-between text-xs text-[#E8F0E9] shrink-0">
            <span className="truncate pr-2 text-[11px]">Ready to buy milk or ghee?</span>
            <button
              type="button"
              onClick={() => handleWhatsAppHandoff()}
              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 py-1 rounded-full text-[11px] font-bold font-sans tracking-wide transition-transform active:scale-95 shrink-0 shadow-xs cursor-pointer"
            >
              <span>Order via WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs sm:text-sm font-sans">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-[#E58A13] text-white'
                        : 'bg-[#15321E] text-[#E58A13] border border-[#E58A13]/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#15321E] text-[#FAF7F2] rounded-tr-none'
                        : 'bg-white text-[#2C382F] border border-[#122E1B]/10 rounded-tl-none'
                    }`}
                  >
                    <div className="text-[12.5px]">{renderFormattedText(m.content)}</div>

                    {/* Show contextual WhatsApp Handoff CTA inside message if intent is detected */}
                    {m.hasOrderIntent && !isUser && (
                      <div className="mt-3 pt-2.5 border-t border-[#122E1B]/10">
                        <button
                          type="button"
                          onClick={() => handleWhatsAppHandoff(m.content)}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-3 rounded-xl font-sans font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Complete Order on WhatsApp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-1.5 text-right ${
                        isUser ? 'text-[#FAF7F2]/60' : 'text-[#8A988D]'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#15321E] text-[#E58A13] border border-[#E58A13]/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#122E1B]/10 rounded-2xl rounded-tl-none p-3 shadow-xs">
                  <div className="flex items-center gap-1.5 py-1 px-1">
                    <span className="w-2 h-2 rounded-full bg-[#15321E] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#E58A13] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#15321E] animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion row (visible when messages count is low) */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3.5 pb-2 pt-1 border-t border-[#122E1B]/10 bg-[#F5F0E8]/60 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#57655B] mb-1.5">
                Suggested Questions
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="shrink-0 text-[11px] bg-white hover:bg-[#FAF7F2] text-[#15321E] border border-[#122E1B]/15 hover:border-[#E58A13]/60 px-2.5 py-1.5 rounded-full font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#122E1B]/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about milk, delivery, ghee..."
              disabled={isLoading}
              maxLength={400}
              className="flex-1 bg-[#FAF7F2] border border-[#122E1B]/15 rounded-full px-3.5 py-2 text-xs sm:text-sm text-[#15321E] placeholder-[#8A988D] focus:outline-hidden focus:border-[#E58A13] focus:ring-1 focus:ring-[#E58A13] transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send question"
              className="w-9 h-9 rounded-full bg-[#15321E] hover:bg-[#1C3E25] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#15321E] text-[#E58A13] flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
