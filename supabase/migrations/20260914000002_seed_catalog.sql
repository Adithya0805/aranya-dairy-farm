-- ============================================================================
-- ARANYA ORGANIC DAIRY FARM — CATALOG SEED MIGRATION
-- Migration: 20260914000002_seed_catalog.sql
-- Safe idempotent seed: Uses ON CONFLICT (name) DO NOTHING to protect live records
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO categories (name) VALUES
  ('Dairy'),
  ('Rice & Millets'),
  ('Pulses & Lentils'),
  ('Nuts & Sweeteners'),
  ('Ready Mixes'),
  ('General Store')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS (32 Catalog Items)
-- ----------------------------------------------------------------------------
INSERT INTO products (name, name_tamil, category_id, price, unit, image_url, available, description)
VALUES
  ('Fresh Farm Milk', 'பசும்பால்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '1 Litre', null, true, 'Fresh, unadulterated whole cow milk from local pasture-fed cows in Shoolagiri.'),
  ('A2 Desi Cow Milk', 'A2 நாட்டுப் பசும்பால்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '1 Litre Glass Bottle', '/images/a2_milk_bottle.jpg', true, '100% pure raw A2 milk from free-roaming Gir and Sahiwal cows, naturally rich in A2 beta-casein.'),
  ('Farm Whole Milk', 'பண்ணைப் பால்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '1 Litre', null, true, 'Wholesome daily whole farm milk for domestic household cooking and tea/coffee.'),
  ('Fresh Cultured Butter', 'வெண்ணெய்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '250g', '/images/vedic_butter.jpg', true, 'Traditional cultured butter, freshly hand-churned daily from whole farm cream.'),
  ('Pure Cow Ghee', 'பசும் நெய்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '500ml Glass Jar', null, true, 'Pure golden cow ghee prepared traditionally with natural aroma and granular texture.'),
  ('Traditional Desi Cow Ghee', 'தேசி பசும் நெய்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '500ml Glass Jar', '/images/bilona_ghee_jar.jpg', true, 'Authentic Desi cow ghee crafted following time-tested indigenous Indian methods.'),
  ('Pure A2 Vedic Desi Ghee', 'தூய தேசி நெய்', (SELECT id FROM categories WHERE name = 'Dairy'), null, '500ml Glass Jar', null, true, 'Woodfired Vedic Bilona ghee hand-churned from cultured curd, zero additives or preservatives.'),
  ('Siri Mix (Pearl, Foxtail & Kodo)', 'சிரி மிக்ஸ் (கம்பு, திணை, வரகு)', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '500g', null, true, 'Wholesome power mix of native millets: Kambu (Pearl), Thinai (Foxtail), and Varagu (Kodo).'),
  ('Proso Millet', 'பனி வரகு (சாமை)', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '500g', null, true, 'Naturally gluten-free grain rich in protein, complex carbohydrates, and dietary minerals.'),
  ('Foxtail Millet', 'திணை', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '500g', null, true, 'Ancient grain celebrated for high dietary fiber, iron, and slow-releasing energy.'),
  ('Barnyard Millet', 'குதிரைவாலி', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '500g', null, true, 'Low-glycemic wholesome millet, ideal for daily porridge, upma, and nutritious khichdi.'),
  ('Mappillai Samba Rice', 'மாப்பிள்ளை சம்பா', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Legendary Tamil heritage red rice variety renowned for strength, stamina, and zinc content.'),
  ('Karuppu Kavuni Black Rice', 'கருப்பு கவுனி', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Ancient royal black rice rich in anthocyanin antioxidants, dietary fiber, and minerals.'),
  ('Seeraga Samba Rice', 'சீரக சம்பா', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Tiny aromatic grain famed across South India for fragrant biryanis and festive feasts.'),
  ('Thooyamalli Rice', 'தூயமல்லி', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Pristine jasmine-like white heritage rice, exceptionally light on stomach and easy to digest.'),
  ('Poongar Traditional Rice', 'பூங்கார்', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Traditional wellness red rice variety, traditionally cherished for women and maternal nutrition.'),
  ('Kaattuyanam Rice', 'காட்டுயானம்', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Ancient tall-stem wild rice variety loaded with calcium, magnesium, and natural fiber.'),
  ('Kichili Samba Rice', 'கிச்சிலி சம்பா', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Fine heritage grain with low glycemic response, widely favored for daily South Indian meals.'),
  ('Kullakkar Rice', 'குள்ளக்கார்', (SELECT id FROM categories WHERE name = 'Rice & Millets'), null, '1 kg', null, false, 'Resilient indigenous red rice variety prized for making nutritive gruel, idlis, and dosas.'),
  ('Fried Gram (Pottukadalai)', 'பொரித்த கடலை / பொட்டுக்கடலை', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'Crispy roasted split Bengal gram, essential for South Indian chutneys, snacks, and sweets.'),
  ('Green Gram (Whole Moong)', 'பாசிப்பயறு (முழு)', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'Whole unpolished green moong beans, excellent for sprouting, sundal, and wholesome curries.'),
  ('Horse Gram (Kollu)', 'கொள்ளு', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'High-protein ancient rustic pulse, celebrated for warmth, metabolism, rasam, and thuvaiyal.'),
  ('Moong Dal (Split Yellow)', 'பாசிப்பருப்பு (உரித்த பாசிப்பயறு)', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'Dehusked split yellow lentils that cook quickly into silky, easy-to-digest kootu and dal.'),
  ('Toor Dal', 'துவரம் பருப்பு', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'Premium unpolished split pigeon peas, the foundational heart of daily South Indian sambar.'),
  ('Urad Dal (Split White)', 'உளுத்தம் பருப்பு (உரித்த)', (SELECT id FROM categories WHERE name = 'Pulses & Lentils'), null, '500g', null, true, 'Clean split white urad lentils, indispensable for airy fermentation of fluffy idlis and medu vadas.'),
  ('Peanuts / Groundnuts', 'நிலக்கடலை / வேர்க்கடலை', (SELECT id FROM categories WHERE name = 'Nuts & Sweeteners'), null, '500g', null, true, 'Farm-fresh raw groundnuts rich in healthy natural fats, protein, and satisfying crunch.'),
  ('Organic Jaggery Powder', 'நாட்டுச் சர்க்கரை / வெல்லப் பொடி', (SELECT id FROM categories WHERE name = 'Nuts & Sweeteners'), null, '500g', null, true, 'Unrefined sugarcane jaggery powder, free from chemical clarifying agents, rich in natural iron.'),
  ('Barnyard Millet Pongal Mix', 'குதிரைவாலி பொங்கல் மிக்ஸ்', (SELECT id FROM categories WHERE name = 'Ready Mixes'), null, '500g', null, true, 'Wholesome instant breakfast blend of barnyard millet, split moong dal, and fragrant seasoning.'),
  ('Barnyard Bisibelebath Mix', 'குதிரைவாலி பிசிபேளாபாத் மிக்ஸ்', (SELECT id FROM categories WHERE name = 'Ready Mixes'), null, '500g', null, true, 'Nutritious Karnataka-style spicy hot lentil rice mix powered with fiber-rich barnyard millet.'),
  ('Millet Dosa Batter Flour (Dosa Hittu)', 'தோசை மாவு (சிறு தானிய மாவு)', (SELECT id FROM categories WHERE name = 'Ready Mixes'), null, '500g', null, true, 'Finely milled multi-millet flour blend for crisp, golden, healthy home-cooked dosas.'),
  ('Amul Pure Ghee', 'அமுல் நெய்', (SELECT id FROM categories WHERE name = 'General Store'), null, '500ml', null, true, 'Standard packaged pure dairy ghee available in the local retail store inventory.'),
  ('Vanaspati Ghee', 'வனஸ்பதி நெய்', (SELECT id FROM categories WHERE name = 'General Store'), null, '500ml', null, true, 'Commercial vegetable cooking fat for domestic kitchen frying, sweets, and bakery.')
ON CONFLICT (name) DO NOTHING;
