import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabaseServer';

// Regex patterns for validation
const ORDER_CODE_REGEX = /^[0-9A-Z]{4,16}$/i;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/track-order?code=<order-code>&id=<order-id>
 *
 * Security design:
 * - Uses service_role (bypasses RLS) for a single order lookup.
 * - Public anon SELECT on orders remains blocked by RLS.
 * - Accepts 8-character order code (e.g. "0A3E78AD", "#0A3E78AD") or full UUID.
 * - Strips leading '#' and whitespace, performs case-insensitive lookup.
 * - Returns only safe customer fields: id, order_code, created_at, items, total, status.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawInput = (searchParams.get('code') || searchParams.get('id') || '').trim();

  // 1. Require code or id parameter
  if (!rawInput) {
    return NextResponse.json(
      { error: 'Order Code is required. Please provide ?code=<order-code>.' },
      { status: 400 }
    );
  }

  // 2. Clean input: strip leading '#' and normalize
  const cleaned = rawInput.replace(/^#+/, '').trim();
  const upperCode = cleaned.toUpperCase();

  // 3. Validate format: must be either an alphanumeric order code or a full UUID
  const isUUID = UUID_REGEX.test(cleaned);
  const isOrderCode = ORDER_CODE_REGEX.test(cleaned);

  if (!isUUID && !isOrderCode) {
    return NextResponse.json(
      { error: 'Invalid Order Code format. Please enter your 8-character Order Code (e.g. 0A3E78AD).' },
      { status: 400 }
    );
  }

  try {
    const admin = getAdminClient();

    // 4. Primary Lookup: Try matching order_code first
    let matchedOrder: {
      id: string;
      order_code?: string | null;
      created_at: string;
      items: unknown;
      total: number | null;
      status: string;
    } | null = null;

    // A. Direct order_code match
    const { data: codeData, error: codeErr } = await admin
      .from('orders')
      .select('id, order_code, created_at, items, total, status')
      .ilike('order_code', upperCode)
      .limit(1)
      .maybeSingle();

    if (!codeErr && codeData) {
      matchedOrder = codeData;
    }

    // B. If not found and input is UUID, lookup by ID
    if (!matchedOrder && isUUID) {
      const { data: idData } = await admin
        .from('orders')
        .select('id, order_code, created_at, items, total, status')
        .eq('id', cleaned)
        .limit(1)
        .maybeSingle();

      if (idData) {
        matchedOrder = idData;
      }
    }

    // C. Fallback: If order_code column was not backfilled or input was 8-char hex prefix
    if (!matchedOrder && cleaned.length === 8) {
      const { data: fallbackRows } = await admin
        .from('orders')
        .select('id, order_code, created_at, items, total, status')
        .limit(20);

      if (fallbackRows && fallbackRows.length > 0) {
        const found = fallbackRows.find(
          (r) => r.id.replace(/-/g, '').slice(0, 8).toUpperCase() === upperCode
        );
        if (found) {
          matchedOrder = found;
        }
      }
    }

    if (!matchedOrder) {
      return NextResponse.json(
        { error: `Order #${upperCode} not found. Please check your code or contact us on WhatsApp.` },
        { status: 404 }
      );
    }

    // 5. Return safe, customer-facing response with consistent order_code
    const finalOrderCode =
      matchedOrder.order_code ||
      matchedOrder.id.replace(/-/g, '').slice(0, 8).toUpperCase();

    return NextResponse.json({
      order: {
        id: matchedOrder.id,
        order_code: finalOrderCode,
        created_at: matchedOrder.created_at,
        items: matchedOrder.items,
        total: matchedOrder.total,
        status: matchedOrder.status,
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

