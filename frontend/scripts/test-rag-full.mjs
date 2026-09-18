import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(line => line.match(/^([^#=]+)=(.*)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const apiKey = envVars.GEMINI_API_KEY;
const EMBEDDING_MODEL = 'models/gemini-embedding-001';

async function getEmbedding(text, retries = 4) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: { parts: [{ text: text.trim() }] },
          outputDimensionality: 768,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.embedding?.values;
      }
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 700));
        continue;
      }
      throw new Error(`Embedding failed ${res.status}: ${await res.text()}`);
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise(r => setTimeout(r, attempt * 700));
    }
  }
}

function cosineSimilarity(a, b) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 16 Static Chunks
const STATIC_CHUNKS = [
  { source: 'our_story', content: 'Aranya Organic Dairy Farm was founded in 2017 on ancestral family land in Shoolagiri, located on the Hosur-Krishnagiri Highway in Tamil Nadu (PIN 635117). The farm has over 9 years of unwavering organic stewardship dedicated to real, unadulterated provisions directly from native cattle to household dining tables.' },
  { source: 'our_story', content: 'Our farm is home to 100% free-roaming indigenous Indian Gir and Sahiwal cows. The cattle are never tethered in cramped industrial stalls or concrete pens. They roam freely under the Shoolagiri sun across pesticide-free open green pastures.' },
  { source: 'our_story', content: 'Our cows graze naturally on pesticide-free open pastures rich in fresh napier grass, moringa foliage, and native wild medicinal herbs. We strictly prohibit synthetic feeds, chemical grain mixes, and artificial stimulants.' },
  { source: 'our_story', content: 'We follow an ethical calf-first milking philosophy: every morning and evening, young calves feed first to their complete satisfaction. Farm caretakers harvest only the surplus unadulterated milk.' },
  { source: 'our_story', content: 'Aranya strictly rejects artificial hormonal stimulants, synthetic oxytocin injections, and routine preventative antibiotics. Every provision from our farm is 100% natural, honest, and chemical-free.' },
  { source: 'hygiene_process', content: 'Our A2 Cow Ghee is handcrafted following the authentic 5-step Vedic Bilona method prescribed in Charaka Samhita: whole raw A2 milk is cultured naturally into curd with mother curd cultures, then churned bidirectionally with a traditional wooden churning staff (Bilona).' },
  { source: 'hygiene_process', content: 'The fresh extracted butter (Makkhan) is separated and slow-simmered over a gentle wood fire in earthen clay pots. This low-temperature clarification yields pure, golden, granular, aromatic A2 ghee rich in bioavailable vitamins A, D, E, and K without harmful oxidized cholesterol.' },
  { source: 'hygiene_process', content: 'Fresh raw milk is chilled immediately down to 4°C within minutes of milking to halt bacterial proliferation while preserving natural bioactive enzymes, immunoglobulins, and delicate vitamins.' },
  { source: 'hygiene_process', content: 'All fresh milk is bottled exclusively in sanitized, reusable eco glass bottles. Zero plastic touches our milk from udder to delivery, ensuring zero microplastics, phthalates, or chemical leaching.' },
  { source: 'contact_faq', content: 'We deliver fresh A2 milk every morning between 5:30 AM and 7:30 AM chilled at 4°C in sterilized glass bottles across Shoolagiri and Hosur, Tamil Nadu.' },
  { source: 'contact_faq', content: 'Orders placed before 8:00 PM are harvested, chilled, and delivered fresh to doorsteps the very next morning before 7:30 AM.' },
  { source: 'contact_faq', content: 'We offer courier shipping across South India for dry provisions, traditional Vedic Bilona Ghee, native millets, and unpolished pulses. Carrier rules and shipping rates are currently being finalized.' },
  { source: 'contact_faq', content: 'Customer support is available daily from 6:00 AM to 8:30 PM on WhatsApp and Phone at +91 99443 38612. Farm location: Aranya Organic Dairy Farm, Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu 635117.' },
  { source: 'contact_faq', content: 'To place an order or subscribe for daily morning delivery, please order directly through WhatsApp at +91 99443 38612. Our farm caretakers fulfill and schedule daily deliveries on WhatsApp.' },
  { source: 'farm_visits', content: 'Farm visits are welcome on weekends by appointment. Visitors and families can experience the pesticide-free pastures, pet and feed our indigenous Gir and Sahiwal cows, and observe traditional clay-pot Vedic Bilona churning firsthand.' },
  { source: 'farm_visits', content: 'Farm visit slots: Morning Slot (8:00 AM – 10:00 AM) and Afternoon Slot (2:00 PM – 4:00 PM). Booking requests can be submitted on our website Contact page or requested via WhatsApp at +91 99443 38612.' },
];

// Product catalog representation (all 32 products)
const CATALOG_ITEMS = [
  { id: 'milk-generic', name: 'Farm Whole Milk', tamil: 'பண்ணை முழு பால்', cat: 'Dairy', unit: '1 Litre (Glass Bottle)', price: null, avail: true, desc: 'Fresh whole unpasteurized farm milk from healthy, grass-fed native cows. Cold-chain chilled to 4°C and bottled in sterilized glass.' },
  { id: 'desi-milk', name: 'A2 Desi Cow Milk', tamil: 'நாட்டுப் பசு பால்', cat: 'Dairy', unit: '1 Litre (Glass Bottle)', price: null, avail: true, desc: '100% pure raw A2 milk from free-grazing indigenous Gir and Sahiwal cows. Harvested after calf feeding, chilled immediately to 4°C.' },
  { id: 'fresh-milk', name: 'Fresh Farm Milk', tamil: 'பண்ணை பசும்பால்', cat: 'Dairy', unit: '500ml (Glass Bottle)', price: null, avail: true, desc: 'Fresh farm milk collected morning and evening, cold-chain chilled, bottled in eco glass.' },
  { id: 'butter', name: 'Fresh Cultured Butter', tamil: 'நாட்டு வெண்ணெய்', cat: 'Dairy', unit: '500g', price: null, avail: true, desc: 'Traditional unsalted Makkhan churned from natural whole-curd A2 milk.' },
  { id: 'paneer', name: 'Cultured Dairy Paneer', tamil: 'நாட்டுப் பன்னீர்', cat: 'Dairy', unit: '500g', price: null, avail: true, desc: 'Fresh cottage cheese crafted from whole A2 milk curdled with natural lemon extract.' },
  { id: 'ghee', name: 'Traditional Desi Cow Ghee', tamil: 'பாரம்பரிய நாட்டுப் பசு நெய்', cat: 'Dairy', unit: '500ml / 1 Litre', price: null, avail: true, desc: 'Pure Vedic Bilona Ghee made by culturing A2 milk into curd, churning with wooden bilona, and slow-simmering in earthen clay pots.' },
  { id: 'pure-ghee', name: 'Pure Farm Ghee', tamil: 'சுத்தமான பசு நெய்', cat: 'Dairy', unit: '500ml', price: null, avail: true, desc: 'Pure granular cow ghee slow-cooked to golden perfection.' },
  { id: 'millet-finger', name: 'Finger Millet (Ragi)', tamil: 'கேழ்வரகு / ராகி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Unpolished native ragi rich in calcium, iron, and dietary fiber.' },
  { id: 'millet-foxtail', name: 'Foxtail Millet (Thinai)', tamil: 'தினை', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Indigenous thinai high in protein and low glycemic index.' },
  { id: 'millet-kodo', name: 'Kodo Millet (Varagu)', tamil: 'வரகு', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Traditional dryland varagu millet rich in antioxidants.' },
  { id: 'millet-little', name: 'Little Millet (Samai)', tamil: 'சாமை', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Fine-grained unpolished samai millet easy to digest.' },
  { id: 'millet-barnyard', name: 'Barnyard Millet (Kuthiraivali)', tamil: 'குதிரைவாலி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Nutrient-rich kuthiraivali millet with high fiber.' },
  { id: 'millet-pearl', name: 'Pearl Millet (Kambu)', tamil: 'கம்பு', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: true, desc: 'Traditional cooling kambu grain packed with magnesium and iron.' },
  { id: 'rice-mappillai', name: 'Mappillai Samba Rice', tamil: 'மாப்பிள்ளை சம்பா அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Heritage red rice variety known for building physical stamina and iron reserves. Pending milling confirmation.' },
  { id: 'rice-kavuni', name: 'Karuppu Kavuni Rice', tamil: 'கருப்பு கவுனி அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Antioxidant-dense ancient black rice rich in anthocyanins. Pending milling confirmation.' },
  { id: 'rice-seeraga', name: 'Seeraga Samba Rice', tamil: 'சீரக சம்பா அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Aromatic short-grain traditional biryani rice. Pending milling confirmation.' },
  { id: 'rice-poongar', name: 'Poongar Rice', tamil: 'பூங்கார் அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Heirloom women-wellness rice variety rich in zinc. Pending milling confirmation.' },
  { id: 'rice-kattuyanam', name: 'Kattuyanam Rice', tamil: 'காட்டுயானம் அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Wild heritage rice traditionally consumed for diabetes management. Pending milling confirmation.' },
  { id: 'rice-karungkuruvai', name: 'Karungkuruvai Rice', tamil: 'கருங்குறுவை அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Ancient medicinal black-red rice used in Siddha medicine. Pending milling confirmation.' },
  { id: 'pulse-toor', name: 'Organic Toor Dal', tamil: 'நாட்டு துவரம் பருப்பு', cat: 'Pulses & Lentils', unit: '1 kg', price: null, avail: true, desc: 'Unpolished native yellow pigeon peas cultivated without synthetic fertilizers.' },
  { id: 'pulse-moong', name: 'Organic Moong Dal', tamil: 'நாட்டு பாசிப் பருப்பு', cat: 'Pulses & Lentils', unit: '1 kg', price: null, avail: true, desc: 'Split yellow moong dal, easy to digest and rich in plant protein.' },
  { id: 'pulse-urad', name: 'Organic Urad Dal', tamil: 'நாட்டு உளுத்தம் பருப்பு', cat: 'Pulses & Lentils', unit: '1 kg', price: null, avail: true, desc: 'Unpolished whole black and split white urad dal for soft idlis and traditional dosas.' },
  { id: 'pulse-chana', name: 'Organic Chana Dal', tamil: 'நாட்டு கடலைப் பருப்பு', cat: 'Pulses & Lentils', unit: '1 kg', price: null, avail: true, desc: 'Golden unpolished chickpea lentils stone-ground naturally.' },
  { id: 'sweet-jaggery', name: 'Organic Jaggery Powder', tamil: 'நாட்டு நாட்டுச் சர்க்கரை / வெல்லம்', cat: 'Nuts & Sweeteners', unit: '1 kg', price: null, avail: true, desc: 'Chemical-free unrefined cane jaggery powder packed with natural minerals and iron.' },
  { id: 'sweet-honey', name: 'Raw Forest Honey', tamil: 'சுத்தமான காட்டுத் தேன்', cat: 'Nuts & Sweeteners', unit: '500g', price: null, avail: true, desc: 'Unpasteurized raw honey harvested ethically from wild forest bees.' },
  { id: 'mix-dosa', name: 'Multi-Millet Dosa Mix', tamil: 'சத்து மாவு தோசை மிக்ஸ்', cat: 'Ready Mixes', unit: '500g', price: null, avail: true, desc: 'Sprouted native millet blend for crispy, wholesome breakfast dosas.' },
  { id: 'mix-health', name: 'Traditional Health Mix (Sathu Maavu)', tamil: 'பாரம்பரிய சத்து மாவு', cat: 'Ready Mixes', unit: '1 kg', price: null, avail: true, desc: 'Heritage blend of 24 roasted sprouted millets, pulses, and nuts.' },
  { id: 'store-groundnut-oil', name: 'Cold-Pressed Groundnut Oil', tamil: 'மரச்செக்கு கடலை எண்ணெய்', cat: 'General Store', unit: '1 Litre', price: null, avail: true, desc: 'Wood-pressed mara chekku oil extracted at low temperature without chemical refining.' },
  { id: 'store-sesame-oil', name: 'Cold-Pressed Sesame Oil (Nallennai)', tamil: 'மரச்செக்கு நல்லெண்ணெய்', cat: 'General Store', unit: '1 Litre', price: null, avail: true, desc: 'Traditional wood-pressed gingelly oil sweetened with organic palm jaggery.' },
  { id: 'rice-thanga', name: 'Thanga Samba Rice', tamil: 'தங்க சம்பா அரிசி', cat: 'Rice & Millets', unit: '1 kg', price: null, avail: false, desc: 'Golden heritage rice prized for radiant skin and vitality. Pending milling confirmation.' },
  { id: 'pulse-horsegram', name: 'Organic Horse Gram (Kollu)', tamil: 'நாட்டு கொள்ளு', cat: 'Pulses & Lentils', unit: '1 kg', price: null, avail: true, desc: 'Native kollu pulse rich in iron, protein, and natural warmth.' },
  { id: 'mix-ragi-puttu', name: 'Sprouted Ragi Puttu Flour', tamil: 'முளைகட்டிய ராகி புட்டு மாவு', cat: 'Ready Mixes', unit: '500g', price: null, avail: true, desc: 'Finely stone-milled sprouted ragi flour for soft steamed puttu.' },
];

const PRODUCT_CHUNKS = CATALOG_ITEMS.map(p => ({
  source: 'product',
  content: `Product: ${p.name} (${p.tamil}). Category: ${p.cat}. Unit: ${p.unit}. Current Price: ${p.price ? '₹' + p.price : 'Price updating soon (check Shop page or WhatsApp for latest rate)'}. Availability Status: ${p.avail ? 'In Stock & Available' : 'Awaiting confirmation / Pending variety listing'}. Description: ${p.desc}`,
}));

const ALL_CHUNKS = [...STATIC_CHUNKS, ...PRODUCT_CHUNKS];

async function run() {
  console.log(`Knowledge Base Breakdown:`);
  console.log(`- Our Story Chunks: 5`);
  console.log(`- Hygiene & Process Chunks: 4`);
  console.log(`- Contact & Delivery FAQ Chunks: 5`);
  console.log(`- Farm Visits Chunks: 2`);
  console.log(`- Product Live Chunks: ${PRODUCT_CHUNKS.length} (7 Dairy, 12 Grains, 6 Pulses, 2 Sweeteners, 3 Ready Mixes, 2 General Store)`);
  console.log(`- Total Chunks: ${ALL_CHUNKS.length}`);

  // Test similarity search on sample queries
  const sampleQueries = [
    'How do you make your traditional A2 Bilona Ghee?',
    'What are your daily morning milk delivery timings?',
    'What is the price of A2 Desi Cow Milk?',
    'Can we visit the farm on weekends?',
    'Do you sell laptops or electronic items?'
  ];

  console.log(`\nTesting RAG vector search across sample queries:`);
  for (const q of sampleQueries) {
    const qVec = await getEmbedding(q);
    // Find best match in static or sample
    let best = null;
    let bestScore = -1;
    for (const c of ALL_CHUNKS.slice(0, 20)) {
      const cVec = await getEmbedding(c.content);
      const score = cosineSimilarity(qVec, cVec);
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    console.log(`\nQuery: "${q}"`);
    console.log(`Top Matched Source: ${best.source} (${(bestScore * 100).toFixed(1)}% similarity)`);
    console.log(`Top Fact: "${best.content.slice(0, 100)}..."`);
  }
}

run();
