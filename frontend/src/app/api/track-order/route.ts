import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabaseServer';

// UUID v4 regex — validates the exact format before hitting the DB
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/track-order?id=<uuid>
 *
 * Security design:
 * - Uses service_role (bypasses RLS) for a STRICT single primary-key lookup.
 * - Public anon SELECT on orders remains blocked by RLS — this route is the
 *   SOLE access path for order lookup.
 * - UUID format is validated before any DB query to prevent injection/enumeration.
 * - Returns only: id, created_at, items, total, status — never whatsapp_message.
 * - No filtering by status, date range, or any other field — PK only.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // 1. Require the id parameter
  if (!id || id.trim() === '') {
    return NextResponse.json(
      { error: 'Order ID is required. Please provide ?id=<order-id>.' },
      { status: 400 }
    );
  }

  const trimmedId = id.trim();

  // 2. Validate UUID format — reject anything that is not a well-formed UUID
  if (!UUID_REGEX.test(trimmedId)) {
    return NextResponse.json(
      { error: 'Invalid Order ID format. Please check the ID and try again.' },
      { status: 400 }
    );
  }

  try {
    const admin = getAdminClient();

    // 3. Strict single primary-key lookup — no scan, no filter, no enumeration
    const { data, error } = await admin
      .from('orders')
      .select('id, created_at, items, total, status')
      .eq('id', trimmedId)
      .single();

    if (error) {
      // PostgREST returns PGRST116 when no row is found with .single()
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found. Please check your Order ID or contact us on WhatsApp.' },
          { status: 404 }
        );
      }
      console.error('[TrackOrder] Database error:', error.message);
      return NextResponse.json(
        { error: 'Unable to retrieve order at this time. Please try again.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Order not found. Please check your Order ID or contact us on WhatsApp.' },
        { status: 404 }
      );
    }

    // 4. Return only the safe, customer-facing fields
    return NextResponse.json({
      order: {
        id: data.id,
        created_at: data.created_at,
        items: data.items,
        total: data.total,
        status: data.status,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[TrackOrder] Exception:', message);
    return NextResponse.json(
      { error: 'Unable to retrieve order at this time. Please try again.' },
      { status: 500 }
    );
  }
}
