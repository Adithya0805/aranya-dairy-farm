-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — PRODUCTION DATABASE SCHEMA MIGRATION
-- Migration: 20260914000001_initial_schema.sql
-- Non-destructive, idempotent setup with Row Level Security (RLS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. TABLES (IDEMPOTENT)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_tamil text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price numeric,               -- null until pricing is confirmed
  unit text,                   -- e.g. "1 Litre", "500g", "1 kg"
  image_url text,              -- Supabase storage path: <category-folder>/<filename>
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_product_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  items jsonb NOT NULL,        -- array of {product_id, name, qty, price}
  total numeric,
  status text DEFAULT 'pending',  -- pending / confirmed / delivered / cancelled
  whatsapp_message text,
  created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ----------------------------------------------------------------------------
-- 4. PERMISSIONS
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Categories & Products: Read-only for public/anon
GRANT SELECT ON TABLE categories TO anon, authenticated;
GRANT SELECT ON TABLE products TO anon, authenticated;

-- Orders: Insert-only for public/anon (no select/update/delete)
GRANT INSERT ON TABLE orders TO anon, authenticated;

-- Service Role: Full access for server actions and administrative tools
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Categories RLS
DROP POLICY IF EXISTS "Public categories read" ON categories;
CREATE POLICY "Public categories read" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin categories all" ON categories;
CREATE POLICY "Admin categories all" ON categories
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Products RLS
DROP POLICY IF EXISTS "Public products read" ON products;
CREATE POLICY "Public products read" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin products all" ON products;
CREATE POLICY "Admin products all" ON products
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Orders RLS
DROP POLICY IF EXISTS "Public orders insert" ON orders;
CREATE POLICY "Public orders insert" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin orders all" ON orders;
CREATE POLICY "Admin orders all" ON orders
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
