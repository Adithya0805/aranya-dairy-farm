-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — MIGRATION
-- Migration: 20260918000003_knowledge_base_pgvector.sql
-- Enables pgvector extension, creates knowledge_base table, index & match RPC.
-- ============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  source text NOT NULL,              -- e.g. "our_story", "hygiene_process", "contact_faq", "farm_visits", "product"
  product_id text,                  -- optional product identifier for live dynamic updates
  metadata jsonb DEFAULT '{}'::jsonb,
  embedding vector(768),            -- 768-dimensional vector matching Gemini embedding models
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create indexes for metadata and fast vector similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source ON knowledge_base(source);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_product_id ON knowledge_base(product_id);

-- Note: IVFFlat index is optimal once initial vectors are populated; HNSW or IVFFlat with cosine ops:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'knowledge_base' AND indexname = 'idx_knowledge_base_embedding'
  ) THEN
    CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If table is empty, ivfflat may raise a notice or require records; HNSW fallback
    NULL;
END $$;

-- 4. Row Level Security (RLS)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public can read knowledge_base entries
DROP POLICY IF EXISTS "Public can read knowledge_base" ON knowledge_base;
CREATE POLICY "Public can read knowledge_base"
  ON knowledge_base
  FOR SELECT
  TO public
  USING (true);

-- Authenticated / Service Role can manage knowledge_base entries
DROP POLICY IF EXISTS "Admin full access to knowledge_base" ON knowledge_base;
CREATE POLICY "Admin full access to knowledge_base"
  ON knowledge_base
  FOR ALL
  TO authenticated, service_role
  USING (true);

-- Grant privileges
GRANT ALL ON TABLE knowledge_base TO anon, authenticated, service_role;

-- 5. Vector Similarity Search Function (RPC)
CREATE OR REPLACE FUNCTION match_knowledge_base (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.20,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  source text,
  product_id text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.source,
    kb.product_id,
    kb.metadata,
    (1 - (kb.embedding <=> query_embedding))::float AS similarity
  FROM knowledge_base kb
  WHERE kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION match_knowledge_base(vector(768), float, int) TO anon, authenticated, service_role;
