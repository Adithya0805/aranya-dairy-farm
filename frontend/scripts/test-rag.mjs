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

process.env.GEMINI_API_KEY = envVars.GEMINI_API_KEY;
process.env.NEXT_PUBLIC_SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
process.env.SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

const apiKey = envVars.GEMINI_API_KEY;
const EMBEDDING_MODEL = 'models/gemini-embedding-001';

async function getEmbedding(text, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: { parts: [{ text }] },
          outputDimensionality: 768,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.embedding?.values;
      }
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 600));
        continue;
      }
      throw new Error(`Embedding failed ${res.status}: ${await res.text()}`);
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise(r => setTimeout(r, attempt * 600));
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

// Static & Product chunks definition
const STATIC_CHUNKS = [
  {
    source: 'our_story',
    content: 'Aranya Organic Dairy Farm was founded in 2017 on ancestral family land in Shoolagiri, located on the Hosur-Krishnagiri Highway in Tamil Nadu (PIN 635117). The farm has over 9 years of organic stewardship dedicated to real, unadulterated provisions directly from native cattle to household tables.',
  },
  {
    source: 'our_story',
    content: 'Our farm is home to 100% free-roaming indigenous Indian Gir and Sahiwal cows. The cattle are never tethered in cramped industrial stalls or concrete pens. They roam freely under the Shoolagiri sun across pesticide-free open green pastures.',
  },
  {
    source: 'our_story',
    content: 'Our cows graze naturally on pesticide-free open pastures rich in fresh napier grass, moringa foliage, and native wild medicinal herbs. We strictly prohibit synthetic feeds, chemical grain mixes, and artificial stimulants.',
  },
  {
    source: 'our_story',
    content: 'We follow an ethical calf-first milking philosophy: every morning and evening, young calves feed first to their complete satisfaction. Farm caretakers harvest only the surplus unadulterated milk.',
  },
  {
    source: 'our_story',
    content: 'Aranya strictly rejects artificial hormonal stimulants, synthetic oxytocin injections, and routine preventative antibiotics. Every provision from our farm is 100% natural, honest, and chemical-free.',
  },
  {
    source: 'hygiene_process',
    content: 'Our A2 Cow Ghee is handcrafted following the authentic 5-step Vedic Bilona method prescribed in Charaka Samhita: whole raw A2 milk is cultured naturally into curd with mother curd cultures, then churned bidirectionally with a traditional wooden churning staff (Bilona).',
  },
  {
    source: 'hygiene_process',
    content: 'The fresh extracted butter (Makkhan) is separated and slow-simmered over a gentle wood fire in earthen clay pots. This low-temperature clarification yields pure, golden, granular, aromatic A2 ghee rich in bioavailable vitamins A, D, E, and K without harmful oxidized cholesterol.',
  },
  {
    source: 'hygiene_process',
    content: 'Fresh raw milk is chilled immediately down to 4°C within minutes of milking to halt bacterial proliferation while preserving natural bioactive enzymes, immunoglobulins, and delicate vitamins.',
  },
  {
    source: 'hygiene_process',
    content: 'All fresh milk is bottled exclusively in sanitized, reusable eco glass bottles. Zero plastic touches our milk from udder to delivery, ensuring zero microplastics, phthalates, or chemical leaching.',
  },
  {
    source: 'contact_faq',
    content: 'We deliver fresh A2 milk every morning between 5:30 AM and 7:30 AM chilled at 4°C in sterilized glass bottles across Shoolagiri and Hosur, Tamil Nadu.',
  },
  {
    source: 'contact_faq',
    content: 'Orders placed before 8:00 PM are harvested, chilled, and delivered fresh to doorsteps the very next morning before 7:30 AM.',
  },
  {
    source: 'contact_faq',
    content: 'We offer courier shipping across South India for dry provisions, traditional Vedic Bilona Ghee, native millets, and unpolished pulses. Carrier rules and shipping rates are currently being finalized.',
  },
  {
    source: 'contact_faq',
    content: 'Customer support is available daily from 6:00 AM to 8:30 PM on WhatsApp and Phone at +91 99443 38612. Farm location: Aranya Organic Dairy Farm, Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu 635117.',
  },
  {
    source: 'contact_faq',
    content: 'To place an order or subscribe for daily morning delivery, please order directly through WhatsApp at +91 99443 38612. Our farm caretakers fulfill and schedule daily deliveries on WhatsApp.',
  },
  {
    source: 'farm_visits',
    content: 'Farm visits are welcome on weekends by appointment. Visitors and families can experience the pesticide-free pastures, pet and feed our indigenous Gir and Sahiwal cows, and observe traditional clay-pot Vedic Bilona churning firsthand.',
  },
  {
    source: 'farm_visits',
    content: 'Farm visit slots: Morning Slot (8:00 AM – 10:00 AM) and Afternoon Slot (2:00 PM – 4:00 PM). Booking requests can be submitted on our website Contact page or requested via WhatsApp at +91 99443 38612.',
  },
];

// Product Sample Chunks
const PRODUCT_CHUNKS = [
  {
    source: 'product',
    content: 'Product: A2 Desi Cow Milk (நாட்டுப் பசு பால்). Category: Dairy. Unit: 1 Litre (Glass Bottle). Current Price: Price updating soon (check Shop page or WhatsApp for latest rate). Availability Status: In Stock & Available. Description: Raw, unpasteurized, unhomogenized A2 milk from free-grazing Gir and Sahiwal cows. Delivered chilled at 4°C in sterilized eco glass bottles.',
  },
  {
    source: 'product',
    content: 'Product: Traditional Desi Cow Ghee (பாரம்பரிய நாட்டுப் பசு நெய்). Category: Dairy. Unit: 500ml / 1 Litre. Current Price: Price updating soon (check Shop page or WhatsApp for latest rate). Availability Status: In Stock & Available. Description: Authentic Vedic Bilona Ghee made from cultured A2 curd, slow-simmered in clay pots over low wood fire into aromatic golden granular texture.',
  },
  {
    source: 'product',
    content: 'Product: Finger Millet (கேழ்வரகு / ராகி). Category: Rice & Millets. Unit: 1 kg. Current Price: Price updating soon (check Shop page or WhatsApp for latest rate). Availability Status: In Stock & Available. Description: Unpolished native ragi rich in calcium and natural fiber, grown chemical-free by partnered Krishnagiri dryland farmers.',
  },
];

const ALL_CHUNKS = [...STATIC_CHUNKS, ...PRODUCT_CHUNKS];

async function runRAGTest() {
  console.log(`\n======================================================`);
  console.log(`1. SEEDING & PRE-COMPUTING VECTOR EMBEDDINGS`);
  console.log(`Total Knowledge Base Chunks: ${ALL_CHUNKS.length} (16 Static + ${PRODUCT_CHUNKS.length} Products Sample)`);
  console.log(`======================================================`);

  const embeddedChunks = [];
  for (const chunk of ALL_CHUNKS) {
    const vec = await getEmbedding(chunk.content);
    embeddedChunks.push({ ...chunk, vector: vec });
  }
  console.log(`✔ All ${embeddedChunks.length} chunks successfully embedded with 768-dim vectors.`);

  const testQueries = [
    'When was Aranya farm founded and where is it located?',
    'How do you make your traditional A2 Bilona Ghee?',
    'What are your daily morning milk delivery timings and coverage area?',
    'Can we visit the farm with our children on weekends?',
    'What is the price of A2 Desi Cow Milk?',
    'Do you sell laptops and smartphones?',
  ];

  console.log(`\n======================================================`);
  console.log(`2. EXECUTING RAG RETRIEVAL & GENERATION TEST CASES`);
  console.log(`======================================================`);

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`\n--- Test Case ${i + 1}: "${query}" ---`);

    // Step A: Embed query
    const qVec = await getEmbedding(query);

    // Step B: Similarity search
    const scored = embeddedChunks.map(c => ({
      source: c.source,
      content: c.content,
      similarity: cosineSimilarity(qVec, c.vector),
    })).sort((a, b) => b.similarity - a.similarity);

    const topMatches = scored.slice(0, 3);
    console.log(`Top Retrieved Chunks:`);
    topMatches.forEach((m, idx) => {
      console.log(`  [${idx + 1}] Source: ${m.source} | Similarity: ${(m.similarity * 100).toFixed(1)}% | Excerpt: "${m.content.slice(0, 70)}..."`);
    });

    // Step C: Build RAG Prompt
    const contextText = topMatches
      .map((m, idx) => `[Source ${idx + 1}: ${m.source.toUpperCase()} | Relevance: ${(m.similarity * 100).toFixed(1)}%]\n${m.content}`)
      .join('\n\n');

    const systemPrompt = `You are the knowledgeable, warm, and honest customer AI Assistant for Aranya Organic Dairy Farm (located in Shoolagiri, near Hosur, Tamil Nadu).
Answer the user's question based SOLELY on the retrieved farm knowledge below.

RETRIEVED KNOWLEDGE BASE CONTEXT:
${contextText}

STRICT GUARDRAILS:
1. If the information is not in the context, politely state you do not have farm records on that topic and point to WhatsApp (+91 99443 38612).
2. Never invent numeric prices. If a price is "Price updating soon", explicitly say so and point to the Shop or WhatsApp.
3. Keep answers concise and helpful.`;

    // Step D: Call Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
    const genRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: query }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      }),
    });

    if (genRes.ok) {
      const data = await genRes.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`AI Answer:\n${reply}`);
    } else {
      console.log(`Gemini API Error:`, genRes.status, await genRes.text());
    }
  }
}

runRAGTest();
