'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
  Phone,
  Check,
  XCircle,
  FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getAdminVisitsAction,
  updateVisitStatusAction,
  deleteVisitAction,
  AdminVisitRequest,
} from '@/app/admin/actions';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

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
    color: 'text-[#1B4D2E]',
    border: 'border-[#1B4D2E]/30',
    bg: 'bg-[#E8F5EE]',
    icon: Check,
  },
  declined: {
    label: 'Declined',
    color: 'text-red-700',
    border: 'border-red-300',
    bg: 'bg-red-50',
    icon: XCircle,
  },
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatCreatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return iso;
  }
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<AdminVisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchVisits = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await getAdminVisitsAction(token);

      if (res.success && res.visits) {
        setVisits(res.visits);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to fetch visit requests.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error loading visits';
      setFeedback({ type: 'error', message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleRefresh = () => {
    setRefreshing(true);
    setFeedback(null);
    fetchVisits();
  };

  const handleStatusChange = async (visitId: string, newStatus: string) => {
    setUpdatingId(visitId);
    setFeedback(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await updateVisitStatusAction(visitId, newStatus, token);

      if (res.success) {
        setVisits((prev) =>
          prev.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v))
        );
        setFeedback({
          type: 'success',
          message: `Visit request status updated to "${newStatus}".`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to update visit status.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating status';
      setFeedback({ type: 'error', message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (visitId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the visit request from "${name}"?`)) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await deleteVisitAction(visitId, token);

      if (res.success) {
        setVisits((prev) => prev.filter((v) => v.id !== visitId));
        setFeedback({
          type: 'success',
          message: `Visit request from "${name}" was deleted.`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete visit request.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting visit';
      setFeedback({ type: 'error', message });
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = visits.length;
    const pending = visits.filter((v) => (v.status || '').toLowerCase() === 'pending').length;
    const confirmed = visits.filter((v) => (v.status || '').toLowerCase() === 'confirmed').length;
    const declined = visits.filter((v) => (v.status || '').toLowerCase() === 'declined').length;
    return { total, pending, confirmed, declined };
  }, [visits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    if (statusFilter === 'all') return visits;
    return visits.filter((v) => (v.status || '').toLowerCase() === statusFilter);
  }, [visits, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#1B4D2E]/20 border-t-[#1B4D2E] rounded-full animate-spin" />
        <p className="text-xs font-sans text-[#57655B] uppercase tracking-wider font-semibold">
          Loading Farm Visit Requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#1B4D2E]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#1B4D2E]/10 text-[#1B4D2E]">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1C241E]">
              Farm Visit Requests
            </h1>
          </div>
          <p className="text-xs text-[#57655B] mt-1">
            Manage customer booking requests for guided pasture visits, milking observations &amp; Bilona ghee making.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1B4D2E]/20 text-xs font-bold uppercase tracking-wider text-[#1C241E] hover:bg-[#FAF7F2] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#1B4D2E]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Feedback Toast ── */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-[#E8F5EE] text-[#1B4D2E] border border-[#1B4D2E]/20'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[10px] uppercase tracking-wider font-bold underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#1B4D2E]/10 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7B6E] block">
            Total Requests
          </span>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1C241E]">
            {metrics.total}
          </p>
          <p className="text-[11px] text-[#57655B]">All recorded visitor bookings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Pending Confirmation
          </span>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">
            {metrics.pending}
          </p>
          <p className="text-[11px] text-amber-800/80">Requires WhatsApp reply</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#1B4D2E]/20 shadow-xs space-y-1 bg-[#E8F5EE]/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E] block">
            Confirmed Visits
          </span>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1B4D2E]">
            {metrics.confirmed}
          </p>
          <p className="text-[11px] text-[#57655B]">Confirmed slot appointments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs space-y-1 bg-red-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
            Declined
          </span>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-red-600">
            {metrics.declined}
          </p>
          <p className="text-[11px] text-red-700/80">Declined or rescheduled</p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: `All Requests (${metrics.total})` },
          { key: 'pending', label: `Pending (${metrics.pending})` },
          { key: 'confirmed', label: `Confirmed (${metrics.confirmed})` },
          { key: 'declined', label: `Declined (${metrics.declined})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#1B4D2E] text-white shadow-xs'
                : 'bg-white text-[#57655B] hover:text-[#1C241E] border border-[#1B4D2E]/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Visits Table / Cards ── */}
      {filteredVisits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#1B4D2E]/15 flex items-center justify-center mx-auto text-[#8A7B6E]">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1C241E]">
            No Visit Requests Found
          </h3>
          <p className="text-xs text-[#57655B] max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'Customer farm visit requests will appear here when submitted from the Contact & Visit page.'
              : `There are currently no visits with status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#1B4D2E]/10 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1C241E]">
              <thead className="bg-[#FAF7F2] border-b border-[#1B4D2E]/10 text-[11px] font-bold uppercase tracking-wider text-[#57655B]">
                <tr>
                  <th className="py-3.5 px-4">Visitor / Contact</th>
                  <th className="py-3.5 px-4">Requested Date</th>
                  <th className="py-3.5 px-4">Time Slot</th>
                  <th className="py-3.5 px-4 text-center">Visitors</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B4D2E]/8">
                {filteredVisits.map((visit) => {
                  const statusKey = (visit.status || 'pending').toLowerCase();
                  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                  const isUpdating = updatingId === visit.id;

                  const whatsappReplyUrl = buildWhatsAppUrl(
                    `Hello ${visit.name}, this is Aranya Organic Dairy Farm regarding your visit request for ${formatDate(visit.preferred_date)} (${visit.time_slot}). We are delighted to confirm your visit slot!`
                  );

                  return (
                    <tr key={visit.id} className="hover:bg-[#FCFAF7] transition-colors">
                      {/* Name & Phone */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-serif font-bold text-sm text-[#1C241E]">
                          {visit.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${visit.phone}`}
                            className="text-xs text-[#57655B] hover:text-[#1B4D2E] font-mono inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{visit.phone}</span>
                          </a>
                        </div>
                        <span className="text-[10px] text-[#8A7B6E] block mt-0.5">
                          Received {formatCreatedAt(visit.created_at)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 align-top font-semibold">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#1B4D2E]/10">
                          <Calendar className="w-3.5 h-3.5 text-[#1B4D2E]" />
                          <span>{formatDate(visit.preferred_date)}</span>
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="py-4 px-4 align-top">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#1B4D2E]/10 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#E58A13]" />
                          <span>{visit.time_slot}</span>
                        </div>
                      </td>

                      {/* Visitors */}
                      <td className="py-4 px-4 align-top text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#1B4D2E]/10">
                          <Users className="w-3 h-3 text-[#57655B]" />
                          <span>{visit.num_visitors}</span>
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-4 align-top max-w-[200px]">
                        {visit.notes ? (
                          <p className="text-xs text-[#57655B] leading-relaxed line-clamp-2" title={visit.notes}>
                            {visit.notes}
                          </p>
                        ) : (
                          <span className="text-[11px] text-[#8A7B6E] italic">No notes</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 align-top">
                        <div className="relative inline-block">
                          <select
                            value={statusKey}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                            className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4D2E] ${cfg.bg} ${cfg.color} ${cfg.border} disabled:opacity-50`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="declined">Declined</option>
                          </select>
                          <ChevronDown className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right space-x-2 whitespace-nowrap">
                        <a
                          href={whatsappReplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message visitor on WhatsApp"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDelete(visit.id, visit.name)}
                          title="Delete Request"
                          className="inline-flex items-center p-1.5 rounded-lg text-[#8A7B6E] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[#1B4D2E]/10">
            {filteredVisits.map((visit) => {
              const statusKey = (visit.status || 'pending').toLowerCase();
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const isUpdating = updatingId === visit.id;

              const whatsappReplyUrl = buildWhatsAppUrl(
                `Hello ${visit.name}, this is Aranya Organic Dairy Farm regarding your visit request for ${formatDate(visit.preferred_date)} (${visit.time_slot}). We are delighted to confirm your visit slot!`
              );

              return (
                <div key={visit.id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1C241E]">
                        {visit.name}
                      </h4>
                      <p className="text-[10px] text-[#8A7B6E]">
                        Received {formatCreatedAt(visit.created_at)}
                      </p>
                    </div>

                    <div className="relative">
                      <select
                        value={statusKey}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                        className={`appearance-none pl-2.5 pr-6 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${cfg.bg} ${cfg.color} ${cfg.border}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="declined">Declined</option>
                      </select>
                      <ChevronDown className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#1B4D2E]/10 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7B6E] block">
                        Date &amp; Slot
                      </span>
                      <p className="font-semibold text-[#1C241E]">{formatDate(visit.preferred_date)}</p>
                      <p className="text-[11px] text-[#57655B]">{visit.time_slot}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#1B4D2E]/10 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7B6E] block">
                        Visitors &amp; Contact
                      </span>
                      <p className="font-semibold text-[#1C241E]">
                        {visit.num_visitors} {Number(visit.num_visitors) === 1 ? 'Person' : 'People'}
                      </p>
                      <a href={`tel:${visit.phone}`} className="text-[11px] text-[#1B4D2E] font-mono block">
                        {visit.phone}
                      </a>
                    </div>
                  </div>

                  {visit.notes && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#1B4D2E]/10 text-xs text-[#57655B]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7B6E] block mb-0.5">
                        Notes:
                      </span>
                      {visit.notes}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <a
                      href={whatsappReplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Reply on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleDelete(visit.id, visit.name)}
                      className="p-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
