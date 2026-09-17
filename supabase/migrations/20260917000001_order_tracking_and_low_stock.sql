-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — MIGRATION
-- Migration: 20260917000001_order_tracking_and_low_stock.sql
-- Adds stock tracking + low-stock alert columns to products table.
-- Non-destructive, idempotent (safe to re-run).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD STOCK TRACKING COLUMNS TO PRODUCTS TABLE
--    - stock: current unit count in hand (nullable — means "not tracked")
--    - low_stock_threshold: alert fires when stock <= this value (default 5)
--    - low_stock_alert_sent_at: tracks last alert time for spam prevention
-- ----------------------------------------------------------------------------

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock integer,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS low_stock_alert_sent_at timestamptz;

-- Index for efficiently querying products that may need alerts
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock)
  WHERE stock IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 2. RLS VERIFICATION NOTES (no changes needed)
--    
--    Order tracking security design:
--    - The /api/track-order route handler uses service_role key.
--    - It performs a strict single primary-key lookup (.eq('id', id).single()).
--    - Public anon SELECT on orders remains BLOCKED by existing RLS.
--    - No new RLS policies are added for orders — the server-side API is
--      the sole access path, preventing enumeration entirely.
--
--    Existing policies remain:
--    - "Public orders insert"  ? INSERT WITH CHECK (true)   — unchanged
--    - "Admin orders all"      ? ALL for service_role/auth  — unchanged
-- ----------------------------------------------------------------------------

-- No RLS changes required. Migration complete.
