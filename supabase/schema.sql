-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — COMPLETE SUPABASE SETUP SCRIPT
-- Paste and run this complete script in the Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DROP EXISTING CONFLICTING TABLES (CLEAN SLATE)
-- ----------------------------------------------------------------------------
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists categories cascade;

-- ----------------------------------------------------------------------------
-- 2. CREATE TABLES
-- ----------------------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_tamil text,
  category_id uuid references categories(id) on delete set null,
  price numeric,               -- null until client confirms pricing
  unit text,                   -- e.g. "1 Litre", "500g", "1 kg"
  image_url text,              -- Supabase storage path: <category-folder>/<filename>
  available boolean default true,
  description text,
  created_at timestamp default now(),
  constraint unique_product_name unique (name)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,        -- array of {product_id, name, qty, price}
  total numeric,
  status text default 'pending',  -- pending / confirmed / delivered
  whatsapp_message text,
  created_at timestamp default now()
);

-- ----------------------------------------------------------------------------
-- 3. GRANT PERMISSIONS TO ROLES
-- In PostgreSQL/Supabase, RLS policies require base table-level GRANTS.
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

-- Categories & Products: Read only for public/anon
grant select on table categories to anon, authenticated;
grant select on table products to anon, authenticated;

-- Orders: Insert only for public/anon (no select/update/delete)
grant insert on table orders to anon, authenticated;

-- Service Role: Full access for server-side admin management
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all routines in schema public to service_role;

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Categories: Public read-only
drop policy if exists "Allow public read access on categories" on categories;
create policy "Allow public read access on categories"
  on categories for select
  to public
  using (true);

-- Products: Public read-only
drop policy if exists "Allow public read access on products" on products;
create policy "Allow public read access on products"
  on products for select
  to public
  using (true);

-- Orders: Public insert only (no public select, update, or delete)
drop policy if exists "Allow public insert on orders" on orders;
create policy "Allow public insert on orders"
  on orders for insert
  to public
  with check (true);

-- ----------------------------------------------------------------------------
-- 5. STORAGE BUCKET: product-images & POLICIES
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow public read on product-images" on storage.objects;
drop policy if exists "Allow authenticated insert on product-images" on storage.objects;
drop policy if exists "Allow authenticated update on product-images" on storage.objects;
drop policy if exists "Allow authenticated delete on product-images" on storage.objects;

-- Storage Policy: Public read access
create policy "Allow public read on product-images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

-- Storage Policy: Authenticated write access only
create policy "Allow authenticated insert on product-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Allow authenticated update on product-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Allow authenticated delete on product-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ----------------------------------------------------------------------------
-- 6. SEED CATEGORIES (Exactly 6 Rows)
-- ----------------------------------------------------------------------------
insert into categories (name) values
  ('Dairy'),
  ('Rice & Millets'),
  ('Pulses & Lentils'),
  ('Nuts & Sweeteners'),
  ('Ready Mixes'),
  ('General Store');

-- ----------------------------------------------------------------------------
-- 7. MIGRATE EXISTING PRODUCTS (32 Products)
-- 24 confirmed items (available = true, price = null)
-- 8 pending traditional Rice items (available = false, price = null)
-- ----------------------------------------------------------------------------

-- Dairy (7 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Fresh Farm Milk', '?????????', (select id from categories where name = 'Dairy'), null, '1 Litre', 'dairy/fresh-milk.jpg', true, 'Fresh, unadulterated whole cow milk from local pasture-fed cows in Shoolagiri.'),
  ('A2 Desi Cow Milk', 'A2 ???????? ?????????', (select id from categories where name = 'Dairy'), null, '1 Litre Glass Bottle', 'dairy/a2-desi-cow-milk.jpg', true, '100% pure raw A2 milk from free-roaming Gir and Sahiwal cows, naturally rich in A2 beta-casein.'),
  ('Farm Whole Milk', '??????? ????', (select id from categories where name = 'Dairy'), null, '1 Litre', 'dairy/milk-generic.jpg', true, 'Wholesome daily whole farm milk for domestic household cooking and tea/coffee.'),
  ('Fresh Cultured Butter', '????????', (select id from categories where name = 'Dairy'), null, '250g', 'dairy/fresh-butter.jpg', true, 'Traditional cultured butter, freshly hand-churned daily from whole farm cream.'),
  ('Pure Cow Ghee', '????? ????', (select id from categories where name = 'Dairy'), null, '500ml Glass Jar', 'dairy/cow-ghee.jpg', true, 'Pure golden cow ghee prepared traditionally with natural aroma and granular texture.'),
  ('Traditional Desi Cow Ghee', '???? ????? ????', (select id from categories where name = 'Dairy'), null, '500ml Glass Jar', 'dairy/desi-cow-ghee.jpg', true, 'Authentic Desi cow ghee crafted following time-tested indigenous Indian methods.'),
  ('Pure A2 Vedic Desi Ghee', '??? ???? ????', (select id from categories where name = 'Dairy'), null, '500ml Glass Jar', 'dairy/pure-desi-ghee.jpg', true, 'Woodfired Vedic Bilona ghee hand-churned from cultured curd, zero additives or preservatives.');

-- Rice & Millets — Confirmed Millets (4 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Siri Mix (Pearl, Foxtail & Kodo)', '???? ?????? (?????, ????, ????)', (select id from categories where name = 'Rice & Millets'), null, '500g', 'rice-millets/siri-mix.jpg', true, 'Wholesome power mix of native millets: Kambu (Pearl), Thinai (Foxtail), and Varagu (Kodo).'),
  ('Proso Millet', '??? ???? (????)', (select id from categories where name = 'Rice & Millets'), null, '500g', 'rice-millets/proso-millet.jpg', true, 'Naturally gluten-free grain rich in protein, complex carbohydrates, and dietary minerals.'),
  ('Foxtail Millet', '????', (select id from categories where name = 'Rice & Millets'), null, '500g', 'rice-millets/foxtail-millet.jpg', true, 'Ancient grain celebrated for high dietary fiber, iron, and slow-releasing energy.'),
  ('Barnyard Millet', '??????????', (select id from categories where name = 'Rice & Millets'), null, '500g', 'rice-millets/barnyard-millet.jpg', true, 'Low-glycemic wholesome millet, ideal for daily porridge, upma, and nutritious khichdi.');

-- Rice & Millets — Pending Traditional Rice (8 items, available: false)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Mappillai Samba Rice', '?????????? ?????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/mappillai-samba.jpg', false, 'Legendary Tamil heritage red rice variety renowned for strength, stamina, and zinc content.'),
  ('Karuppu Kavuni Black Rice', '??????? ?????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/karuppu-kavuni.jpg', false, 'Ancient royal black rice rich in anthocyanin antioxidants, dietary fiber, and minerals.'),
  ('Seeraga Samba Rice', '???? ?????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/seeraga-samba.jpg', false, 'Tiny aromatic grain famed across South India for fragrant biryanis and festive feasts.'),
  ('Thooyamalli Rice', '????????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/thooyamalli.jpg', false, 'Pristine jasmine-like white heritage rice, exceptionally light on stomach and easy to digest.'),
  ('Poongar Traditional Rice', '????????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/poongar.jpg', false, 'Traditional wellness red rice variety, traditionally cherished for women and maternal nutrition.'),
  ('Kaattuyanam Rice', '???????????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/kaattuyanam.jpg', false, 'Ancient tall-stem wild rice variety loaded with calcium, magnesium, and natural fiber.'),
  ('Kichili Samba Rice', '???????? ?????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/kichili-samba.jpg', false, 'Fine heritage grain with low glycemic response, widely favored for daily South Indian meals.'),
  ('Kullakkar Rice', '???????????', (select id from categories where name = 'Rice & Millets'), null, '1 kg', 'rice-millets/kullakkar.jpg', false, 'Resilient indigenous red rice variety prized for making nutritive gruel, idlis, and dosas.');

-- Pulses & Lentils (6 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Fried Gram (Pottukadalai)', '??????? ???? / ????????????', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/fried-gram.jpg', true, 'Crispy roasted split Bengal gram, essential for South Indian chutneys, snacks, and sweets.'),
  ('Green Gram (Whole Moong)', '?????????? (????)', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/green-gram.jpg', true, 'Whole unpolished green moong beans, excellent for sprouting, sundal, and wholesome curries.'),
  ('Horse Gram (Kollu)', '??????', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/horse-gram.jpg', true, 'High-protein ancient rustic pulse, celebrated for warmth, metabolism, rasam, and thuvaiyal.'),
  ('Moong Dal (Split Yellow)', '????????????? (?????? ??????????)', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/moong-dal.jpg', true, 'Dehusked split yellow lentils that cook quickly into silky, easy-to-digest kootu and dal.'),
  ('Toor Dal', '?????? ???????', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/toor-dal.jpg', true, 'Premium unpolished split pigeon peas, the foundational heart of daily South Indian sambar.'),
  ('Urad Dal (Split White)', '???????? ??????? (??????)', (select id from categories where name = 'Pulses & Lentils'), null, '500g', 'pulses-lentils/urad-dal.jpg', true, 'Clean split white urad lentils, indispensable for airy fermentation of fluffy idlis and medu vadas.');

-- Nuts & Sweeteners (2 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Peanuts / Groundnuts', '????????? / ??????????', (select id from categories where name = 'Nuts & Sweeteners'), null, '500g', 'nuts-sweeteners/peanuts.jpg', true, 'Farm-fresh raw groundnuts rich in healthy natural fats, protein, and satisfying crunch.'),
  ('Organic Jaggery Powder', '???????? ???????? / ??????? ????', (select id from categories where name = 'Nuts & Sweeteners'), null, '500g', 'nuts-sweeteners/jaggery-powder.jpg', true, 'Unrefined sugarcane jaggery powder, free from chemical clarifying agents, rich in natural iron.');

-- Ready Mixes (3 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Barnyard Millet Pongal Mix', '?????????? ??????? ??????', (select id from categories where name = 'Ready Mixes'), null, '500g', 'ready-mixes/barnyard-pongal-mix.jpg', true, 'Wholesome instant breakfast blend of barnyard millet, split moong dal, and fragrant seasoning.'),
  ('Barnyard Bisibelebath Mix', '?????????? ???????????? ??????', (select id from categories where name = 'Ready Mixes'), null, '500g', 'ready-mixes/barnyard-bisibelebath-mix.jpg', true, 'Nutritious Karnataka-style spicy hot lentil rice mix powered with fiber-rich barnyard millet.'),
  ('Millet Dosa Batter Flour (Dosa Hittu)', '???? ???? (???? ????? ????)', (select id from categories where name = 'Ready Mixes'), null, '500g', 'ready-mixes/dosa-hittu.jpg', true, 'Finely milled multi-millet flour blend for crisp, golden, healthy home-cooked dosas.');

-- General Store (2 items, available: true)
insert into products (name, name_tamil, category_id, price, unit, image_url, available, description)
values
  ('Amul Pure Ghee', '????? ????', (select id from categories where name = 'General Store'), null, '500ml', 'general-store/amul-pure-ghee.jpg', true, 'Standard packaged pure dairy ghee available in the local retail store inventory.'),
  ('Vanaspati Ghee', '??????? ????', (select id from categories where name = 'General Store'), null, '500ml', 'general-store/vanaspati-ghee.jpg', true, 'Commercial vegetable cooking fat for domestic kitchen frying, sweets, and bakery.');
