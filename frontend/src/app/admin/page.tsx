'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Package,
  ShoppingCart,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Check,
  XCircle,
  Truck,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getAdminDashboardSummaryAction,
  AdminDashboardSummary,
  updateOrderStatusAction,
  updateVisitStatusAction,
} from '@/app/admin/actions';
import { exportOrdersToCSV, OrderForCSV } from '@/lib/csvExport';

function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingVisitId, setUpdatingVisitId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await getAdminDashboardSummaryAction(token);

      if (res.success && res.data) {
        setSummary(res.data);
        setError(null);
      } else {
        setError(res.error || 'Failed to load dashboard overview.');
      }
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
      setError('An unexpected error occurred while loading dashboard metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSummary();
  };

  const handleExportCSV = () => {
    if (!summary || summary.recentOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }
    const ordersForCSV: OrderForCSV[] = summary.recentOrders.map((o) => ({
      id: o.id,
      order_code: o.order_code,
      items: o.items || [],
      total: o.total,
      status: o.status,
      whatsapp_message: o.whatsapp_message,
      created_at: o.created_at,
    }));
    exportOrdersToCSV(ordersForCSV, 'Aranya-Farm-Orders-Summary');
  };

  const handleQuickOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await updateOrderStatusAction({ orderId, status: newStatus }, token);
      if (res.success) {
        setFeedback(`Order status updated to ${newStatus}.`);
        setTimeout(() => setFeedback(null), 3000);
        await fetchSummary();
      } else {
        alert(res.error || 'Failed to update order status.');
      }
    } catch {
      alert('Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleQuickVisitStatus = async (visitId: string, newStatus: 'confirmed' | 'declined') => {
    setUpdatingVisitId(visitId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await updateVisitStatusAction(visitId, newStatus, token);
      if (res.success) {
        setFeedback(`Visit request marked as ${newStatus}.`);
        setTimeout(() => setFeedback(null), 3000);
        await fetchSummary();
      } else {
        alert(res.error || 'Failed to update visit status.');
      }
    } catch {
      alert('Failed to update visit status.');
    } finally {
      setUpdatingVisitId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-4">
        <div className="h-10 bg-white/70 rounded-lg w-1/3 border border-[#1B4D2E]/10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-[#1B4D2E]/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-xl border border-[#1B4D2E]/10" />
          <div className="h-64 bg-white rounded-xl border border-[#1B4D2E]/10" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12">
        <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-red-900 mb-1">
          Unable to Load Dashboard
        </h3>
        <p className="text-xs text-red-700 mb-4">{error || 'Unknown error occurred.'}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4D2E] text-white text-xs font-semibold rounded-lg hover:bg-[#153E24] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const todayDateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-5 sm:p-6 border border-[#1B4D2E]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#57655B]">
              Store Operations Center
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C241E] mt-1">
            {getGreeting()}, Aranya Farm
          </h1>
          <p className="text-xs text-[#8A7B6E] mt-0.5 font-sans">
            {todayDateString} • Shoolagiri Pastures &amp; Farm Store
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F7F4F0] hover:bg-[#EFEAE2] text-[#1C241E] text-xs font-semibold border border-[#1B4D2E]/15 transition-colors cursor-pointer touch-manipulation"
            title="Download orders as Excel-ready CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#1B4D2E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F7F4F0] text-[#57655B] hover:text-[#1C241E] text-xs font-medium border border-[#1B4D2E]/15 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B4D2E] hover:bg-[#153E24] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ── 4 Primary Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Pending Orders */}
        <Link
          href="/admin/orders"
          className="group bg-white rounded-2xl p-5 border border-[#1B4D2E]/15 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B6E]">
                Pending Orders
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#1C241E] mt-1">
                {summary.pendingOrdersCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-between text-xs text-[#57655B]">
            <span>{summary.todayOrdersCount} placed today</span>
            <span className="font-semibold text-amber-700 group-hover:underline flex items-center gap-0.5">
              Fulfill <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 2. Low-Stock Items */}
        <Link
          href="/admin/products"
          className="group bg-white rounded-2xl p-5 border border-[#1B4D2E]/15 hover:border-red-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B6E]">
                Low-Stock Alerts
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#1C241E] mt-1">
                {summary.lowStockCount}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${
              summary.lowStockCount > 0
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-between text-xs text-[#57655B]">
            <span>{summary.lowStockCount > 0 ? 'Requires restocking' : 'Stock levels healthy'}</span>
            <span className="font-semibold text-[#1B4D2E] group-hover:underline flex items-center gap-0.5">
              Inventory <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 3. New Visit Requests */}
        <Link
          href="/admin/visits"
          className="group bg-white rounded-2xl p-5 border border-[#1B4D2E]/15 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B6E]">
                Visit Requests
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#1C241E] mt-1">
                {summary.pendingVisitsCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-between text-xs text-[#57655B]">
            <span>Awaiting confirmation</span>
            <span className="font-semibold text-blue-700 group-hover:underline flex items-center gap-0.5">
              Review <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* 4. Weekly Gross Revenue */}
        <Link
          href="/admin/orders"
          className="group bg-white rounded-2xl p-5 border border-[#1B4D2E]/15 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B6E]">
                7-Day Revenue
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#1C241E] mt-1">
                {formatIndianCurrency(summary.weeklyRevenue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] border border-[#1B4D2E]/25 flex items-center justify-center text-[#1B4D2E] group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1B4D2E]/10 flex items-center justify-between text-xs text-[#57655B]">
            <span>Recent storefront sales</span>
            <span className="font-semibold text-[#1B4D2E] group-hover:underline flex items-center gap-0.5">
              Sales Log <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

      </div>

      {/* ── Quick Action Launcher Row ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#1B4D2E]/10 shadow-xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B6E] mb-3">
          Daily Operational Shortcuts
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F4F0] hover:bg-[#EFEAE2] text-[#1C241E] border border-[#1B4D2E]/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1B4D2E] shadow-2xs shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight">Add Product</span>
              <span className="block text-[10px] text-[#8A7B6E]">Manage catalog</span>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F4F0] hover:bg-[#EFEAE2] text-[#1C241E] border border-[#1B4D2E]/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1B4D2E] shadow-2xs shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight">Delivery Run Sheet</span>
              <span className="block text-[10px] text-[#8A7B6E]">Print packing list</span>
            </div>
          </Link>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F4F0] hover:bg-[#EFEAE2] text-[#1C241E] border border-[#1B4D2E]/10 transition-colors text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1B4D2E] shadow-2xs shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold leading-tight">Backup Orders</span>
              <span className="block text-[10px] text-[#8A7B6E]">Export CSV format</span>
            </div>
          </button>

          <Link
            href="/admin/visits"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F4F0] hover:bg-[#EFEAE2] text-[#1C241E] border border-[#1B4D2E]/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1B4D2E] shadow-2xs shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight">Confirm Visits</span>
              <span className="block text-[10px] text-[#8A7B6E]">Weekend schedules</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Two-Column Operational Activity Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Recent Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#1B4D2E]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1B4D2E]/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#1B4D2E]" />
                <h3 className="font-serif text-base font-bold text-[#1C241E]">
                  Recent Orders Requiring Dispatch
                </h3>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-[#1B4D2E] hover:underline flex items-center gap-0.5"
              >
                All Orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#1B4D2E]/5 mt-2">
              {summary.recentOrders.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#8A7B6E]">
                  No orders recorded yet.
                </p>
              ) : (
                summary.recentOrders.map((order) => {
                  const code = order.order_code || order.id.replace(/-/g, '').slice(0, 8).toUpperCase();
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div key={order.id} className="py-3.5 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1C241E] bg-[#F7F4F0] px-2 py-0.5 rounded border border-[#1B4D2E]/10">
                            #{code}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-[#E8F5EE] text-[#1B4D2E]'
                              : order.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-[11px] text-[#8A7B6E]">
                            {formatDate(order.created_at)}
                          </span>
                        </div>

                        <p className="text-xs text-[#57655B] mt-1.5 truncate">
                          {(order.items || [])
                            .map((it) => `${it.name} (x${it.qty})`)
                            .join(', ')}
                        </p>

                        {order.total !== null && (
                          <p className="text-xs font-bold text-[#1C241E] mt-0.5">
                            ₹{order.total}
                          </p>
                        )}
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-1">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleQuickOrderStatus(order.id, 'confirmed')}
                            disabled={isUpdating}
                            className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs transition-colors cursor-pointer"
                            title="Mark as Confirmed"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => handleQuickOrderStatus(order.id, 'delivered')}
                            disabled={isUpdating}
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs transition-colors cursor-pointer"
                            title="Mark as Delivered"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#1B4D2E]/10">
            <Link
              href="/admin/orders"
              className="text-xs text-[#57655B] hover:text-[#1B4D2E] font-medium flex items-center justify-between"
            >
              <span>Manage packing and delivery run sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Visit Requests */}
        <div className="bg-white rounded-2xl p-5 border border-[#1B4D2E]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1B4D2E]/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1B4D2E]" />
                <h3 className="font-serif text-base font-bold text-[#1C241E]">
                  New Farm Visit Requests
                </h3>
              </div>
              <Link
                href="/admin/visits"
                className="text-xs font-semibold text-[#1B4D2E] hover:underline flex items-center gap-0.5"
              >
                All Visits <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#1B4D2E]/5 mt-2">
              {summary.recentVisits.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#8A7B6E]">
                  No farm visit requests recorded yet.
                </p>
              ) : (
                summary.recentVisits.map((visit) => {
                  const isUpdating = updatingVisitId === visit.id;

                  return (
                    <div key={visit.id} className="py-3.5 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1C241E]">
                            {visit.name}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            visit.status === 'confirmed'
                              ? 'bg-[#E8F5EE] text-[#1B4D2E]'
                              : visit.status === 'declined'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {visit.status}
                          </span>
                        </div>

                        <p className="text-xs text-[#57655B] mt-1">
                          📅 {visit.preferred_date} • {visit.time_slot} ({visit.num_visitors} visitor{visit.num_visitors > 1 ? 's' : ''})
                        </p>

                        <p className="text-[11px] text-[#8A7B6E] mt-0.5">
                          📞 {visit.phone}
                        </p>
                      </div>

                      {/* Quick Action Buttons */}
                      {visit.status === 'pending' && (
                        <div className="flex items-center gap-1.5 shrink-0 pt-1">
                          <button
                            onClick={() => handleQuickVisitStatus(visit.id, 'confirmed')}
                            disabled={isUpdating}
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs transition-colors cursor-pointer"
                            title="Confirm Visit Slot"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickVisitStatus(visit.id, 'declined')}
                            disabled={isUpdating}
                            className="p-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs transition-colors cursor-pointer"
                            title="Decline Request"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#1B4D2E]/10">
            <Link
              href="/admin/visits"
              className="text-xs text-[#57655B] hover:text-[#1B4D2E] font-medium flex items-center justify-between"
            >
              <span>Manage visitor slots and WhatsApp replies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* ── Low-Stock Depletion Watchlist ── */}
      {summary.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1B4D2E]/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="font-serif text-base font-bold text-[#1C241E]">
                Critical Inventory Depletion Watchlist
              </h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#1B4D2E] hover:underline flex items-center gap-0.5"
            >
              Manage Catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-3.5">
            {summary.lowStockProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1C241E] leading-tight">
                    {prod.name}
                  </h4>
                  {prod.name_tamil && (
                    <p className="text-[10px] text-[#8A7B6E]">{prod.name_tamil}</p>
                  )}
                  <p className="text-[11px] text-red-700 font-semibold mt-1">
                    {prod.stock} unit{prod.stock === 1 ? '' : 's'} remaining ({prod.unit || 'Standard'})
                  </p>
                </div>

                <Link
                  href="/admin/products"
                  className="px-2.5 py-1.5 rounded-md bg-white border border-red-300 text-red-700 hover:bg-red-50 text-[11px] font-semibold transition-colors shrink-0"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
