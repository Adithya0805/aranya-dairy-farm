'use server';

import { getAdminClient } from '@/lib/supabaseServer';

interface OrderStatsResult {
  success: boolean;
  count: number;
}

// In-memory cache to avoid hitting the database on every page load
let cachedStats: { count: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Server Action: Queries the aggregate count of real orders placed within the last 7 days.
 * 
 * Privacy & Performance Guarantees:
 * 1. Uses { count: 'exact', head: true } — zero customer rows, names, phone numbers,
 *    or addresses are ever queried, transmitted, or exposed.
 * 2. Caches the integer count in memory for 15 minutes to avoid excessive DB reads.
 * 3. Returns strictly { success: boolean, count: number }.
 */
export async function getRecentOrderCountAction(): Promise<OrderStatsResult> {
  const now = Date.now();
  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return { success: true, count: cachedStats.count };
  }

  try {
    const admin = getAdminClient();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await admin
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    if (error) {
      console.warn('[OrderStats] Error fetching weekly order count:', error.message);
      // If error occurs, fall back to cached value if present, else 0
      return { success: false, count: cachedStats?.count ?? 0 };
    }

    const realCount = count ?? 0;
    cachedStats = {
      count: realCount,
      timestamp: now,
    };

    return { success: true, count: realCount };
  } catch (err) {
    console.warn('[OrderStats] Exception querying order stats:', err);
    return { success: false, count: cachedStats?.count ?? 0 };
  }
}
