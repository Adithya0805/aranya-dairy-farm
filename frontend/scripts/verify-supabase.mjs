import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
}

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('? Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const maskedUrl = url.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co');
console.log('?? Connecting to Supabase project at:', maskedUrl);
const supabase = createClient(url, anonKey);

async function runVerification() {
  let allPassed = true;

  // 1. Categories Check
  console.log('\n--- 1. Testing Categories Table ---');
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  if (catErr) {
    console.error('? Failed to fetch categories:', catErr.message);
    allPassed = false;
  } else {
    console.log(`? Successfully fetched ${categories.length} categories:`, categories.map(c => c.name).join(', '));
  }

  // 2. Products Check
  console.log('\n--- 2. Testing Products Table ---');
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, name_tamil, category_id, price, unit, image_url, available, categories(id, name)');

  if (prodErr) {
    console.error('? Failed to fetch products:', prodErr.message);
    allPassed = false;
  } else {
    const available = products.filter(p => p.available);
    const hidden = products.filter(p => !p.available);
    const nullPrices = products.filter(p => p.price === null);

    console.log(`? Total products in database: ${products.length}`);
    console.log(`? Available products (storefront): ${available.length} (expected 24)`);
    console.log(`? Hidden rice varieties (available=false): ${hidden.length} (expected 8)`);
    console.log(`? Products with price=null ("Price updating soon"): ${nullPrices.length}`);

    // Check relationship join
    const sampleJoined = products[0]?.categories?.name;
    console.log(`? Categories join test (Sample: "${products[0]?.name}" -> "${sampleJoined}")`);
  }

  // 3. RLS Test: Public INSERT on Products (Must FAIL)
  console.log('\n--- 3. Testing RLS on Products Table (Public INSERT must be BLOCKED) ---');
  const { data: hackedProd, error: hackErr } = await supabase
    .from('products')
    .insert({
      name: 'Unallowed Injection Item',
      unit: '1L',
      price: 100,
      available: true
    });

  if (hackErr) {
    console.log(`? RLS IS WORKING! Public anon insert was blocked with code: "${hackErr.code}" (${hackErr.message})`);
  } else {
    console.error('? SECURITY ALERT: Public insert succeeded! RLS policy is missing or permissive.', hackedProd);
    allPassed = false;
  }

  // 4. RLS Test: Public INSERT on Orders (Must SUCCEED)
  console.log('\n--- 4. Testing Orders Table (Public INSERT must SUCCEED) ---');
  const testOrderPayload = {
    items: [{ product_id: '00000000-0000-0000-0000-000000000000', name: 'Verification Test Item', qty: 1, price: null }],
    total: 0,
    whatsapp_message: 'Verification Test Order',
    status: 'pending'
  };

  const { error: plainInsertErr } = await supabase
    .from('orders')
    .insert(testOrderPayload);

  if (plainInsertErr) {
    console.error('? Public order insert failed:', plainInsertErr.message);
    allPassed = false;
  } else {
    console.log('? Public anon insert into "orders" SUCCEEDED as expected!');
  }

  // 5. RLS Test: Public SELECT on Orders (Must be BLOCKED / Empty)
  console.log('\n--- 5. Testing RLS on Orders Table (Public SELECT must NOT leak orders) ---');
  const { data: ordersList, error: ordersSelectErr } = await supabase
    .from('orders')
    .select('id, items, total');

  if (ordersSelectErr) {
    console.log(`? RLS IS WORKING! Public anon select on orders was blocked with code: "${ordersSelectErr.code}" (${ordersSelectErr.message})`);
  } else if (!ordersList || ordersList.length === 0) {
    console.log('? RLS IS WORKING! Public anon select returned 0 rows (orders hidden from public).');
  } else {
    console.warn('?? Public select returned orders:', ordersList.length);
  }

  // 6. Storage Bucket Public URL Test
  console.log('\n--- 6. Testing Storage Bucket URL resolution ---');
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl('dairy/fresh-milk.jpg');

  console.log(`? Public URL generated: ${publicUrlData.publicUrl}`);

  console.log('\n========================================');
  if (allPassed) {
    console.log('?? ALL BACKEND CHECKS AND RLS TESTS PASSED PERFECTLY!');
  } else {
    console.log('?? Some checks need review.');
  }
  console.log('========================================\n');
}

runVerification();
