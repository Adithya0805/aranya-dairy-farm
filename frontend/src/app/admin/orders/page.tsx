'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Check,
  ChevronDown,
  MessageSquare,
  X,
  Printer,
  Copy,
  Package,
  Trash2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  deleteOrderAction,
  deleteDeliveredOrdersAction,
} from '@/app/admin/actions';

interface OrderItem {
  product_id?: string;
  name: string;
  qty: number;
  price?: number | null;
}

interface AdminOrder {
  id: string;
  items: OrderItem[];
  total: number | null;
  status: 'pending' | 'confirmed' | 'delivered' | string;
  whatsapp_message: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; border: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-blue-700',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    icon: Check,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-[#1B4D2E]',
    border: 'border-[#1B4D2E]/30',
    bg: 'bg-[#E8F5EE]',
    icon: Truck,
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewingMessage, setViewingMessage] = useState<AdminOrder | null>(null);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedModalMsg, setCopiedModalMsg] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await getAdminOrdersAction(token);

      if (res.success && res.orders) {
        setOrders(res.orders as AdminOrder[]);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to fetch orders. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching orders';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    setFeedback(null);

    // Optimistic update
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await updateOrderStatusAction({ orderId, status: newStatus }, token);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Order status updated to "${newStatus.toUpperCase()}"!`,
        });
      } else {
        // Revert
        setOrders(previousOrders);
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update order status.',
        });
      }
    } catch {
      setOrders(previousOrders);
      setFeedback({ type: 'error', message: 'Failed to update order status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyOrder = (order: AdminOrder) => {
    const itemsSummary = (order.items || [])
      .map((i) => `• ${i.name} × ${i.qty}`)
      .join('\n');
    const text = `Order #${order.id.slice(0, 8)}\nDate: ${formatDate(order.created_at)}\nStatus: ${order.status.toUpperCase()}\nItems:\n${itemsSummary}\nTotal: ₹${order.total ?? 0}`;
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyModalMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedModalMsg(true);
    setTimeout(() => setCopiedModalMsg(false), 2000);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Permanently delete this order record? This will free up database storage.')) {
      return;
    }
    setUpdatingId(orderId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await deleteOrderAction(orderId, session?.access_token);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setFeedback({ type: 'success', message: 'Order record deleted permanently.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete order.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Error deleting order record.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePurgeDelivered = async () => {
    if (!window.confirm(`Permanently delete all ${deliveredCount} delivered orders to keep the store clean and within free limits?`)) {
      return;
    }
    setRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await deleteDeliveredOrdersAction(session?.access_token);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => (o.status || '').toLowerCase() !== 'delivered'));
        setFeedback({ type: 'success', message: `Successfully purged ${res.count} delivered orders from database!` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to purge orders.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Error purging delivered orders.' });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return (o.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
  });

  const pendingCount = orders.filter((o) => (o.status || 'pending').toLowerCase() === 'pending').length;
  const confirmedCount = orders.filter((o) => (o.status || '').toLowerCase() === 'confirmed').length;
  const deliveredCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;

  // Active orders (pending or confirmed) for dispatch & preparation tally
  const activeOrders = orders.filter((o) =>
    ['pending', 'confirmed'].includes((o.status || 'pending').toLowerCase())
  );

  // Item tally across all active orders
  const packingTally = activeOrders.reduce((acc, order) => {
    (order.items || []).forEach((item) => {
      const key = item.name.trim();
      acc[key] = (acc[key] || 0) + (item.qty || 1);
    });
    return acc;
  }, {} as Record<string, number>);

  const tallyEntries = Object.entries(packingTally).sort((a, b) => b[1] - a[1]);
  const totalBottlesAndPacks = tallyEntries.reduce((sum, [, count]) => sum + count, 0);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] mt-1 font-sans">
            Track customer orders, prepare morning packing tallies, and dispatch delivery run sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {deliveredCount > 0 && (
            <button
              onClick={handlePurgeDelivered}
              disabled={refreshing}
              title="Delete all completed/delivered orders to keep database clean"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Purge Delivered ({deliveredCount})</span>
            </button>
          )}

          <button
            onClick={() => setIsRunSheetOpen(true)}
            disabled={activeOrders.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Delivery Run Sheet</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchOrders();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#1B4D2E]/20 bg-white text-xs font-semibold uppercase tracking-wider text-[#1C241E] hover:bg-[#F2ECE7] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/10 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#8A7B6E] font-bold block">
            Total Orders
          </span>
          <span className="text-2xl font-serif font-bold text-[#1C241E] mt-0.5 block">
            {orders.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block">
            Pending Orders
          </span>
          <span className="text-2xl font-serif font-bold text-amber-900 mt-0.5 block">
            {pendingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-blue-800 font-bold block">
            Confirmed
          </span>
          <span className="text-2xl font-serif font-bold text-blue-900 mt-0.5 block">
            {confirmedCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#1B4D2E]/20 bg-[#E8F5EE]/20 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#1B4D2E] font-bold block">
            Delivered
          </span>
          <span className="text-2xl font-serif font-bold text-[#1B4D2E] mt-0.5 block">
            {deliveredCount}
          </span>
        </div>
      </div>

      {/* Daily Bottling & Packing Tally (Saves workers calculation time every morning) */}
      <div className="bg-[#FAF7F2] rounded-lg border border-[#1B4D2E]/15 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1B4D2E]/10 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1B4D2E]" />
            <div>
              <h2 className="font-serif font-bold text-base text-[#1C241E]">
                Morning Packing & Bottling Tally
              </h2>
              <p className="text-xs text-[#57655B]">
                Aggregated units required for all active (Pending + Confirmed) delivery orders.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1B4D2E]/10 text-[#1B4D2E]">
              {activeOrders.length} {activeOrders.length === 1 ? 'order' : 'orders'} active
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1B4D2E] text-white">
              {totalBottlesAndPacks} total units
            </span>
          </div>
        </div>

        {tallyEntries.length === 0 ? (
          <p className="text-xs text-[#8A7B6E] italic py-2">
            No active orders to pack right now. When orders are placed, required bottle and pack quantities will calculate automatically here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {tallyEntries.map(([itemName, count]) => (
              <div
                key={itemName}
                className="flex items-center justify-between p-2.5 bg-white rounded-md border border-[#1B4D2E]/10 shadow-2xs hover:border-[#1B4D2E]/25 transition-colors"
              >
                <span className="text-xs font-medium text-[#1C241E] truncate mr-2">
                  {itemName}
                </span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#E8F5EE] text-[#1B4D2E] shrink-0">
                  × {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-md border flex items-center justify-between gap-3 text-sm font-sans ${
            feedback.type === 'success'
              ? 'bg-[#E8F5EE] border-[#1B4D2E]/20 text-[#1B4D2E]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#1B4D2E] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-current hover:opacity-70 cursor-pointer p-1"
            aria-label="Dismiss feedback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1B4D2E]/10 pb-3 overflow-x-auto">
        {[
          { key: 'all', label: `All (${orders.length})` },
          { key: 'pending', label: `Pending (${pendingCount})` },
          { key: 'confirmed', label: `Confirmed (${confirmedCount})` },
          { key: 'delivered', label: `Delivered (${deliveredCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              statusFilter === tab.key
                ? 'bg-[#1B4D2E] text-white'
                : 'bg-white text-[#57655B] border border-[#1B4D2E]/15 hover:bg-[#F2ECE7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-lg border border-[#1B4D2E]/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#1B4D2E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase font-bold tracking-wider text-[#57655B]">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-[#8A7B6E] mx-auto opacity-50" />
            <p className="text-base font-serif text-[#1C241E]">No orders found</p>
            <p className="text-xs text-[#57655B]">
              {statusFilter === 'all'
                ? 'Orders placed via customer checkout will appear here.'
                : `No orders in "${statusFilter}" status.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFAF7] border-b border-[#1B4D2E]/10 text-[11px] uppercase tracking-wider font-bold text-[#57655B]">
                  <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Customer Inquiry</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4D2E]/8 text-sm">
                {filteredOrders.map((order) => {
                  const currentStatus = (order.status || 'pending').toLowerCase();
                  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
                  const StatusIcon = config.icon;
                  const isUpdating = updatingId === order.id;

                  // Parse items safely
                  const itemsList = Array.isArray(order.items) ? order.items : [];
                  const totalItemsCount = itemsList.reduce((sum, i) => sum + (i.qty || 1), 0);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FAF8F5] transition-colors"
                    >
                      {/* ID & Date & Copy */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-[#1C241E]">
                            #{order.id.slice(0, 8)}
                          </span>
                          <button
                            onClick={() => handleCopyOrder(order)}
                            className="text-[#8A7B6E] hover:text-[#1B4D2E] p-0.5 rounded cursor-pointer transition-colors"
                            title="Copy Order Summary"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3 h-3 text-[#1B4D2E]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-[#8A7B6E] block mt-1">
                          {formatDate(order.created_at)}
                        </span>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1 max-w-sm">
                          {itemsList.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-[#1C241E] flex items-center justify-between gap-4"
                            >
                              <span className="truncate">
                                • {item.name}{' '}
                                <span className="text-[#8A7B6E]">× {item.qty}</span>
                              </span>
                              {item.price !== null && item.price !== undefined ? (
                                <span className="font-mono text-[11px] text-[#57655B] shrink-0">
                                  ₹{(item.price * item.qty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#6B472B] italic shrink-0">
                                  TBD
                                </span>
                              )}
                            </div>
                          ))}
                          {itemsList.length === 0 && (
                            <span className="text-xs text-[#8A7B6E] italic">
                              No items recorded
                            </span>
                          )}
                          <span className="text-[11px] text-[#8A7B6E] font-medium block pt-1">
                            Total {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      {/* Total in ₹ */}
                      <td className="py-4 px-4 align-top font-sans">
                        {order.total && order.total > 0 ? (
                          <span className="font-bold text-base text-[#1C241E]">
                            ₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-[#6B472B] bg-[#F2ECE7] px-2 py-0.5 rounded">
                            TBD on WhatsApp
                          </span>
                        )}
                      </td>

                      {/* Customer Inquiry Button */}
                      <td className="py-4 px-4 align-top">
                        {order.whatsapp_message ? (
                          <button
                            onClick={() => setViewingMessage(order)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-[#1B4D2E] hover:bg-[#1B4D2E]/10 border border-[#1B4D2E]/20 font-medium transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>View Message</span>
                          </button>
                        ) : (
                          <span className="text-xs text-[#8A7B6E]">—</span>
                        )}
                      </td>

                      {/* Status Dropdown & Delete Action */}
                      <td className="py-4 px-4 sm:px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="inline-block relative">
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              disabled={isUpdating}
                              className={`appearance-none pl-7 pr-8 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] transition-all disabled:opacity-50 ${config.bg} ${config.color} ${config.border}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <StatusIcon className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${config.color}`} />
                            <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 ${config.color}`} />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={isUpdating}
                            className="p-1.5 text-[#8A7B6E] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-40"
                            title="Permanently delete this order record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WhatsApp Message View Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-[#1B4D2E]/15 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#1B4D2E]/10 flex items-center justify-between bg-[#FCFAF7]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1B4D2E]" />
                <h3 className="font-serif font-bold text-lg text-[#1C241E]">
                  Customer Order Message
                </h3>
              </div>
              <button
                onClick={() => setViewingMessage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57655B] hover:bg-[#1B4D2E]/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-[#8A7B6E] flex justify-between border-b border-[#1B4D2E]/10 pb-2">
                <span>Order #{viewingMessage.id.slice(0, 8)}</span>
                <span>{formatDate(viewingMessage.created_at)}</span>
              </div>

              <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap text-[#1C241E] leading-relaxed max-h-72 overflow-y-auto">
                {viewingMessage.whatsapp_message}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCopyModalMessage(viewingMessage.whatsapp_message || '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1B4D2E]/20 text-xs font-semibold text-[#1B4D2E] hover:bg-[#F2ECE7] transition-colors cursor-pointer"
                >
                  {copiedModalMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1B4D2E]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Message</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setViewingMessage(null)}
                  className="px-5 py-2 rounded bg-[#1C241E] hover:bg-[#1B4D2E] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Delivery Run Sheet Modal */}
      {isRunSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-lg shadow-2xl border border-[#1B4D2E]/20 max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full">
            {/* Run Sheet Header (Screen controls) */}
            <div className="px-6 py-4 border-b border-[#1B4D2E]/10 flex items-center justify-between bg-[#FAF7F2] shrink-0 print:hidden">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C241E]">
                  Morning Delivery Dispatch Run Sheet
                </h3>
                <p className="text-xs text-[#57655B]">
                  Printable packing & delivery schedule for delivery personnel.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#1B4D2E] hover:bg-[#143B23] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setIsRunSheetOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#57655B] hover:bg-[#1B4D2E]/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
              {/* Document Letterhead */}
              <div className="border-b-2 border-[#1B4D2E] pb-4 flex justify-between items-start">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#1B4D2E]">
                    ARANYA ORGANIC DAIRY FARM
                  </h1>
                  <p className="text-xs text-[#57655B] font-sans">
                    Morning Dispatch & Delivery Run Sheet &bull; Salem &bull; Phone: +91 94883 04443
                  </p>
                </div>
                <div className="text-right text-xs text-[#1C241E]">
                  <p className="font-bold">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-[#8A7B6E]">Generated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
              </div>

              {/* Tally Summary Box */}
              <div className="bg-[#FAF7F2] p-4 rounded border border-[#1B4D2E]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#1B4D2E]">
                    Vehicle Bottling & Load Tally ({totalBottlesAndPacks} Units across {activeOrders.length} Orders)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {tallyEntries.map(([name, qty]) => (
                    <div key={name} className="flex justify-between border-b border-[#1B4D2E]/10 pb-1">
                      <span className="font-sans text-[#1C241E] truncate">{name}:</span>
                      <span className="font-bold font-mono text-[#1B4D2E] shrink-0 ml-1">{qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div>
                <table className="w-full text-left border border-[#1B4D2E]/20 text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#1B4D2E]/20 font-bold uppercase text-[#1B4D2E]">
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3 w-28">Order ID</th>
                      <th className="py-2.5 px-3">Items To Deliver</th>
                      <th className="py-2.5 px-3 w-24">Amount</th>
                      <th className="py-2.5 px-3 w-28 text-center">Status</th>
                      <th className="py-2.5 px-3 w-32 text-center">Receiver Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B4D2E]/10">
                    {activeOrders.map((order, idx) => (
                      <tr key={order.id} className="align-top">
                        <td className="py-3 px-3 font-bold font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-mono">
                          <span className="font-bold">#{order.id.slice(0, 8)}</span>
                          <span className="block text-[10px] text-[#8A7B6E]">
                            {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <ul className="space-y-0.5">
                            {(order.items || []).map((it, i) => (
                              <li key={i} className="flex justify-between gap-2">
                                <span>{it.name}</span>
                                <span className="font-bold font-mono">× {it.qty}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-3 font-bold font-mono">
                          {order.total ? `₹${Number(order.total).toLocaleString('en-IN')}` : 'WhatsApp'}
                        </td>
                        <td className="py-3 px-3 text-center uppercase text-[10px] font-bold text-[#57655B]">
                          [ ] Delivered
                        </td>
                        <td className="py-3 px-3 text-center border-l border-dashed border-[#1B4D2E]/20">
                          <div className="h-8 border-b border-gray-400 mt-2" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Driver Sign-Off Footer */}
              <div className="pt-6 flex justify-between text-xs text-[#57655B] border-t border-[#1B4D2E]/10">
                <div>
                  <p className="font-semibold text-[#1C241E]">Delivery Driver Name: _______________________</p>
                  <p className="mt-1">Vehicle / Route: Salem City Delivery Route</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1C241E]">Supervisor Sign-Off: _______________________</p>
                  <p className="mt-1">Dispatched Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
