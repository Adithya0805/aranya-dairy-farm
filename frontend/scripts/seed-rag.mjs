import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(line => line.match(/^([^#=]+)=(.*)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const apiKey = envVars.GEMINI_API_KEY;

if (!supabaseUrl || !serviceRoleKey || !apiKey) {
  console.error('Missing environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function generateEmbedding(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Embedding API failed ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.embedding?.values;
}

async function testSeeding() {
  console.log('Testing Supabase knowledge_base table accessibility...');
  const { data, error } = await supabase.from('knowledge_base').select('id').limit(1);
  console.log('knowledge_base table status:', { data, error });
}

testSeeding();
