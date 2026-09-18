'use server';

import { getAdminClient } from '@/lib/supabaseServer';

export interface SubmitVisitPayload {
  name: string;
  phone: string;
  preferred_date: string;
  time_slot: string;
  num_visitors?: number;
  notes?: string;
}

export interface SubmitVisitResult {
  success: boolean;
  visitId?: string;
  error?: string;
}

/**
 * Server Action: Validates and logs customer farm visit requests into Supabase.
 * Uses service_role to ensure reliable insertion while RLS protects the table.
 */
export async function submitVisitRequestAction(
  payload: SubmitVisitPayload
): Promise<SubmitVisitResult> {
  try {
    if (!payload) {
      return { success: false, error: 'Request payload is required.' };
    }

    const name = String(payload.name || '').trim().slice(0, 100);
    const phone = String(payload.phone || '').trim().slice(0, 30);
    const preferredDate = String(payload.preferred_date || '').trim();
    const timeSlot = String(payload.time_slot || '').trim().slice(0, 100);
    const numVisitors = Math.max(1, Math.min(100, Math.floor(Number(payload.num_visitors) || 1)));
    const notes = payload.notes ? String(payload.notes).trim().slice(0, 1000) : null;

    if (!name) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!phone) {
      return { success: false, error: 'Please enter a valid contact phone number.' };
    }

    if (!preferredDate) {
      return { success: false, error: 'Please select your preferred visit date.' };
    }

    if (!timeSlot) {
      return { success: false, error: 'Please select a preferred time slot.' };
    }

    const admin = getAdminClient();
    const { data, error } = await admin
      .from('farm_visit_requests')
      .insert({
        name,
        phone,
        preferred_date: preferredDate,
        time_slot: timeSlot,
        num_visitors: numVisitors,
        notes,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[VisitsAction] Database insert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, visitId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[VisitsAction] Exception during visit submission:', message);
    return { success: false, error: message };
  }
}
