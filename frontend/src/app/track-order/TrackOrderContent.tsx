'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle, Clock, Truck, AlertCircle, Package, MessageSquare, ArrowLeft } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  price: number | null;
}

interface TrackedOrder {
  id: string;
  created_at: string;
  items: OrderItem[];
  total: number | null;
  status: string;
}

type FetchState = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

const STATUS_STEPS: Array<{ key: string; label: string; icon: React.ReactNode; description: string }> = [
  {
    key: 'pending',
    label: 'Order Received',
    icon: <Clock className="w-5 h-5" />,
    description: 'Your order has been received and is awaiting confirmation.',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Your order has been confirmed by the farm team.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: <Truck className="w-5 h-5" />,
    description: 'Your order has been delivered. Thank you!',
  },
];

function getStatusIndex(status: string): number {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 2;
  if (s === 'confirmed') return 1;
  return 0;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return iso;
  }
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Price TBD';
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export default function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputId, setInputId] = useState('');
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrder = useCallback(async (orderId: string) => {
    const trimmed = orderId.trim();
    if (!trimmed) return;

    setFetchState('loading');
    setOrder(null);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/track-order?id=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
        setFetchState('found');
      } else if (res.status === 404) {
        setFetchState('not_found');
        setErrorMessage(data.error || 'Order not found.');
      } else {
        setFetchState('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFetchState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  }, []);

  // Auto-fetch when ?id= is in the URL
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setInputId(idFromUrl);
      fetchOrder(idFromUrl);
    }
  }, [searchParams, fetchOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputId.trim();
    if (!trimmed) return;
    router.push(`/track-order?id=${encodeURIComponent(trimmed)}`);
    fetchOrder(trimmed);
  };

  const statusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#1B4D2E]/10 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#57655B] hover:text-[#1B4D2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </Link>
          <div className="h-5 w-px bg-[#1B4D2E]/15 mx-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-[#1B4D2E]/20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aranya-logo.png"
                alt="Aranya Farm"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className="font-serif font-bold text-base text-[#1C241E]">Track Your Order</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 shadow-sm p-6 sm:p-8">
          <div className="space-y-1 mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C241E] font-bold">
              Order Tracking
            </h1>
            <p className="text-sm text-[#57655B] leading-relaxed">
              Enter the Order ID from your WhatsApp confirmation message to check your order status.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Package className="w-4 h-4 text-[#8A7B6E]" />
              </div>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="e.g. 3f9e2a4b-1c7d-..."
                className="w-full pl-10 pr-4 py-3 border border-[#1B4D2E]/20 rounded-xl text-sm text-[#1C241E] placeholder-[#8A7B6E] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/30 focus:border-[#1B4D2E]/40 bg-[#FAF7F2] transition-colors font-mono"
                spellCheck={false}
                autoComplete="off"
                aria-label="Order ID"
              />
            </div>
            <button
              type="submit"
              disabled={fetchState === 'loading' || !inputId.trim()}
              className="flex items-center gap-2 bg-[#1B4D2E] hover:bg-[#15321E] disabled:bg-[#1B4D2E]/40 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation cursor-pointer min-w-[80px] justify-center"
            >
              {fetchState === 'loading' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {fetchState === 'loading' && (
          <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 shadow-sm p-12 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-[#1B4D2E]/20 border-t-[#1B4D2E] rounded-full animate-spin" />
            <p className="text-sm text-[#57655B] font-sans">Looking up your order...</p>
          </div>
        )}

        {/* Not Found / Error */}
        {(fetchState === 'not_found' || fetchState === 'error') && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-xl text-[#1C241E] font-semibold">
                  {fetchState === 'not_found' ? 'Order Not Found' : 'Something Went Wrong'}
                </h2>
                <p className="text-sm text-[#57655B] leading-relaxed">
                  {fetchState === 'not_found'
                    ? "We couldn't find an order with that ID. Please double-check the Order ID from your WhatsApp confirmation message."
                    : errorMessage}
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I need help tracking my order.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:text-[#1FB055] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    Contact us on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Found */}
        {fetchState === 'found' && order && (
          <div className="space-y-5">

            {/* Status Stepper */}
            <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 shadow-sm p-6 sm:p-8">
              <h2 className="font-serif text-lg text-[#1C241E] font-bold mb-6">Order Status</h2>

              <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#1B4D2E]/10" aria-hidden="true" />

                <ol className="space-y-6 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= statusIndex;
                    const isCurrent = idx === statusIndex;

                    return (
                      <li key={step.key} className="flex gap-4 items-start">
                        {/* Step Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            isCompleted
                              ? isCurrent
                                ? 'bg-[#1B4D2E] text-white ring-4 ring-[#1B4D2E]/15'
                                : 'bg-[#1B4D2E] text-white'
                              : 'bg-[#F2ECE7] text-[#8A7B6E]'
                          }`}
                          aria-current={isCurrent ? 'step' : undefined}
                        >
                          {step.icon}
                        </div>

                        {/* Step Label */}
                        <div className="pt-1.5 flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold leading-none mb-1 ${
                              isCompleted ? 'text-[#1C241E]' : 'text-[#8A7B6E]'
                            }`}
                          >
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1B4D2E]/10 text-[#1B4D2E]">
                                Current
                              </span>
                            )}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[#57655B] leading-relaxed">{step.description}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 shadow-sm p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <h2 className="font-serif text-lg text-[#1C241E] font-bold">Order Details</h2>
                  <p className="text-xs text-[#8A7B6E] mt-0.5 font-mono break-all">{order.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#8A7B6E] uppercase tracking-wider font-semibold">Placed on</p>
                  <p className="text-sm text-[#1C241E] font-semibold mt-0.5">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#1B4D2E]/8">
                {Array.isArray(order.items) && order.items.map((item, idx) => (
                  <div key={`${item.product_id}-${idx}`} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1C241E] leading-snug">{item.name}</p>
                      <p className="text-xs text-[#8A7B6E] mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1C241E] shrink-0 tabular-nums">
                      {item.price !== null && item.price !== undefined
                        ? formatPrice(item.price * item.qty)
                        : 'TBD'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-[#1B4D2E]/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#57655B] uppercase tracking-wider">Order Total</span>
                <span className="font-serif text-xl font-bold text-[#1C241E]">
                  {order.total !== null && order.total !== undefined ? formatPrice(order.total) : 'Price updating soon'}
                </span>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-[#F0FDF4] rounded-2xl border border-[#1B4D2E]/15 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C241E]">Need help with your order?</p>
                <p className="text-xs text-[#57655B]">Our farm team is available on WhatsApp.</p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I need help with Order ID: ${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:text-[#1FB055] transition-colors shrink-0"
              >
                Chat now
              </a>
            </div>

          </div>
        )}

        {/* Idle hint */}
        {fetchState === 'idle' && (
          <p className="text-center text-xs text-[#8A7B6E]">
            Your Order ID is included in the WhatsApp confirmation message sent when you placed your order.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1B4D2E]/10 py-6 text-center">
        <Link href="/" className="text-xs text-[#8A7B6E] hover:text-[#1B4D2E] transition-colors">
          &larr; Back to Aranya Organic Dairy Farm
        </Link>
      </footer>
    </div>
  );
}
