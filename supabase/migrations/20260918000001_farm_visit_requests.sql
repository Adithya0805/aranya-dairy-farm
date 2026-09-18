-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — MIGRATION
-- Migration: 20260918000001_farm_visit_requests.sql
-- Creates farm_visit_requests table with Row Level Security (RLS).
-- ============================================================================

CREATE TABLE IF NOT EXISTS farm_visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  preferred_date date NOT NULL,
  time_slot text NOT NULL,      -- e.g. "Morning (8-10 AM)", "Afternoon (2-4 PM)"
  num_visitors integer NOT NULL DEFAULT 1,
  notes text,
  status text NOT NULL DEFAULT 'pending', -- pending / confirmed / declined
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying visits by date & status
CREATE INDEX IF NOT EXISTS idx_farm_visit_requests_date ON farm_visit_requests(preferred_date ASC);
CREATE INDEX IF NOT EXISTS idx_farm_visit_requests_status ON farm_visit_requests(status);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE farm_visit_requests ENABLE ROW LEVEL SECURITY;

-- 1. Public can INSERT visit requests (allows visitors to submit bookings)
DROP POLICY IF EXISTS "Public can submit visit requests" ON farm_visit_requests;
CREATE POLICY "Public can submit visit requests"
  ON farm_visit_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 2. Authenticated users (Admin) / Service Role full access
DROP POLICY IF EXISTS "Admin full access to visit requests" ON farm_visit_requests;
CREATE POLICY "Admin full access to visit requests"
  ON farm_visit_requests
  FOR ALL
  TO authenticated
  USING (true);

-- Grant privileges
GRANT ALL ON TABLE farm_visit_requests TO anon, authenticated, service_role;
