-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — MIGRATION
-- Migration: 20260918000002_add_order_code.sql
-- Adds unique 8-character order_code column to orders table and backfills existing orders.
-- ============================================================================

-- 1. Add order_code column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_code text;

-- 2. Backfill existing orders with uppercase 8-character code from their UUID
UPDATE orders
SET order_code = UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8))
WHERE order_code IS NULL;

-- 3. Add UNIQUE constraint and index on order_code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_order_code_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
