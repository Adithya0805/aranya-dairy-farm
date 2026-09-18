import 'server-only';

import { getAdminClient } from '@/lib/supabaseServer';
import { generateEmbedding, cosineSimilarity } from '@/lib/embeddings';
import { PRODUCTS, Product } from '@/lib/products';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '@/lib/whatsapp';

export interface KnowledgeChunk {
  id?: string;
  content: string;
  source: 'our_story' | 'hygiene_process' | 'contact_faq' | 'farm_visits' | 'product';
  productId?: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  similarity?: number;
}

export const STATIC_KNOWLEDGE_CHUNKS: Omit<KnowledgeChunk, 'id' | 'embedding'>[] = [
  // ── Our Story Chunks ────────────────────────────────────────────────────────
  {
    source: 'our_story',
    content:
      'Aranya Organic Dairy Farm was founded in 2017 on ancestral family land in Shoolagiri, located on the Hosur-Krishnagiri Highway in Tamil Nadu (PIN 635117). The farm has over 9 years of unwavering organic stewardship, established to bring real, clean, unadulterated provisions directly from native cattle to household dining tables.',
    metadata: { section: 'genesis', year: 2017, location: 'Shoolagiri, Tamil Nadu' },
  },
  {
    source: 'our_story',
    content:
      'Our farm is home to 100% free-roaming indigenous Indian Gir and Sahiwal cows. The cattle are never tethered in cramped industrial stalls or concrete pens. They roam freely under the Shoolagiri sun across pesticide-free open green pastures.',
    metadata: { section: 'cattle_herd', breeds: ['Gir', 'Sahiwal'] },
  },
  {
    source: 'our_story',
    content:
      'Our cows graze naturally on pesticide-free open pastures rich in fresh napier grass, moringa foliage, and native wild medicinal herbs. We strictly prohibit synthetic feeds, chemical grain mixes, and artificial stimulants.',
    metadata: { section: 'diet_and_feed', pasture: '100% Grass-Fed & Herbaceous' },
  },
  {
    source: 'our_story',
    content:
      'We follow an ethical calf-first milking philosophy: every morning and evening, young calves feed first to their complete satisfaction. Farm caretakers harvest only the surplus unadulterated milk.',
    metadata: { section: 'milking_philosophy', principle: 'Calf-First Milking' },
  },
  {
    source: 'our_story',
    content:
      'Aranya strictly rejects artificial hormonal stimulants, synthetic oxytocin injections, and routine preventative antibiotics. Every provision from our farm is 100% natural, honest, and chemical-free.',
    metadata: { section: 'chemical_free', guarantee: 'Zero Hormones, Zero Oxytocin, Zero Antibiotics' },
  },

  // ── Hygiene & Process Chunks ────────────────────────────────────────────────
  {
    source: 'hygiene_process',
    content:
      'Our A2 Cow Ghee is handcrafted following the authentic 5-step Vedic Bilona method prescribed in Charaka Samhita: whole raw A2 milk is cultured naturally into curd with mother curd cultures, then churned bidirectionally with a traditional wooden churning staff (Bilona).',
    metadata: { section: 'bilona_ghee_step_1_2', method: 'Vedic Bilona Churning' },
  },
  {
    source: 'hygiene_process',
    content:
      'The fresh extracted butter (Makkhan) is separated and slow-simmered over a gentle wood fire in earthen clay pots. This low-temperature clarification yields pure, golden, granular, aromatic A2 ghee rich in bioavailable vitamins A, D, E, and K without harmful oxidized cholesterol.',
    metadata: { section: 'bilona_ghee_step_3_5', clay_pots: true, wood_fire: true },
  },
  {
    source: 'hygiene_process',
    content:
      'Fresh raw milk is chilled immediately down to 4°C within minutes of milking to halt bacterial proliferation while preserving natural bioactive enzymes, immunoglobulins, and delicate vitamins.',
    metadata: { section: 'cold_chain', temperature: '4°C Rapid Chilling' },
  },
  {
    source: 'hygiene_process',
    content:
      'All fresh milk is bottled exclusively in sanitized, reusable eco glass bottles. Zero plastic touches our milk from udder to delivery, ensuring zero microplastics, phthalates, or chemical leaching.',
    metadata: { section: 'packaging', packaging_type: '100% Sterilized Glass Bottles' },
  },

  // ── Contact & Delivery FAQ Chunks ───────────────────────────────────────────
  {
    source: 'contact_faq',
    content:
      'We deliver fresh A2 milk every morning between 5:30 AM and 7:30 AM chilled at 4°C in sterilized glass bottles across Shoolagiri and Hosur, Tamil Nadu.',
    metadata: { section: 'delivery_timings', hours: '5:30 AM - 7:30 AM', areas: ['Shoolagiri', 'Hosur'] },
  },
  {
    source: 'contact_faq',
    content:
      'Orders placed before 8:00 PM are harvested, chilled, and delivered fresh to doorsteps the very next morning before 7:30 AM.',
    metadata: { section: 'order_cutoff', cutoff_time: '8:00 PM' },
  },
  {
    source: 'contact_faq',
    content:
      'We offer courier shipping across South India for dry provisions, traditional Vedic Bilona Ghee, native millets, and unpolished pulses. Carrier rules and shipping rates are currently being finalized.',
    metadata: { section: 'shipping_coverage', region: 'South India' },
  },
  {
    source: 'contact_faq',
    content: `Customer support is available daily from 6:00 AM to 8:30 PM on WhatsApp and Phone at ${WHATSAPP_DISPLAY} (Number: ${WHATSAPP_NUMBER}). Farm location: Aranya Organic Dairy Farm, Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu 635117.`,
    metadata: { section: 'support_and_location', phone: WHATSAPP_DISPLAY },
  },
  {
    source: 'contact_faq',
    content:
      'To place an order or subscribe for daily morning delivery, please order directly through WhatsApp. Our farm caretakers fulfill and schedule daily deliveries on WhatsApp.',
    metadata: { section: 'ordering_handoff', channel: 'WhatsApp' },
  },

  // ── Farm Visits Chunks ──────────────────────────────────────────────────────
  {
    source: 'farm_visits',
    content:
      'Farm visits are welcome on weekends by appointment. Visitors and families can experience the pesticide-free pastures, pet and feed our indigenous Gir and Sahiwal cows, and observe traditional clay-pot Vedic Bilona churning firsthand.',
    metadata: { section: 'visit_experience', schedule: 'Weekends by Appointment' },
  },
  {
    source: 'farm_visits',
    content:
      'Farm visit slots: Morning Slot (8:00 AM – 10:00 AM) and Afternoon Slot (2:00 PM – 4:00 PM). Booking requests can be submitted on our website Contact page or requested via WhatsApp.',
    metadata: { section: 'visit_slots', slots: ['Morning (8-10 AM)', 'Afternoon (2-4 PM)'] },
  },
];

/**
 * Builds a comprehensive search chunk text string from a product object.
 */
export function buildProductChunkText(p: {
  id: string;
  name: string;
  name_tamil?: string | null;
  nameTamil?: string | null;
  category?: string | null;
  unit?: string | null;
  price?: number | null;
  available?: boolean;
  description?: string | null;
}): string {
  const tamil = p.name_tamil || p.nameTamil || '';
  const priceDisplay =
    typeof p.price === 'number' && p.price !== null
      ? `₹${p.price}`
      : 'Price updating soon (check Shop page or WhatsApp for latest rate)';
  const statusDisplay = p.available === false ? 'Awaiting confirmation / Not live yet' : 'In Stock & Available';

  return `Product: ${p.name} ${tamil ? `(${tamil})` : ''}. Category: ${p.category || 'Organic Harvest'}. Unit: ${p.unit || 'Standard packaging'}. Current Price: ${priceDisplay}. Availability Status: ${statusDisplay}. Description: ${p.description || 'Pure, chemical-free organic farm harvest.'}`;
}

/**
 * Regenerates the embedding entry for a single product.
 * Called automatically whenever a product is updated in /admin/products.
 */
export async function syncProductEmbedding(product: {
  id: string;
  name: string;
  name_tamil?: string | null;
  nameTamil?: string | null;
  category?: string | null;
  unit?: string | null;
  price?: number | null;
  available?: boolean;
  description?: string | null;
}): Promise<boolean> {
  try {
    const admin = getAdminClient();
    const content = buildProductChunkText(product);
    const embedding = await generateEmbedding(content);

    // 1. Delete existing entry for this product
    await admin.from('knowledge_base').delete().eq('product_id', product.id);

    // 2. Insert updated vector entry
    const { error } = await admin.from('knowledge_base').insert({
      content,
      source: 'product',
      product_id: product.id,
      metadata: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        available: product.available,
      },
      embedding,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn(`[RAG] Failed to insert product embedding for "${product.name}":`, error.message);
      return false;
    }

    console.info(`[RAG] Successfully updated vector embedding for product "${product.name}" (ID: ${product.id}).`);
    return true;
  } catch (err) {
    console.warn(`[RAG] syncProductEmbedding exception for "${product.name}":`, err);
    return false;
  }
}

export interface ReindexResult {
  success: boolean;
  staticChunksCount: number;
  productChunksCount: number;
  totalChunksCount: number;
  breakdown: Record<string, number>;
  error?: string;
}

/**
 * Performs a complete re-index of the knowledge base:
 * 1. Seeds all static chunks (Our Story, Hygiene, Contact, Visits).
 * 2. Seeds all 32 product entries.
 * Returns breakdown counts.
 */
export async function reindexFullKnowledgeBase(): Promise<ReindexResult> {
  const breakdown: Record<string, number> = {
    our_story: 0,
    hygiene_process: 0,
    contact_faq: 0,
    farm_visits: 0,
    product: 0,
  };

  try {
    const admin = getAdminClient();

    // 1. Fetch live products from database, fallback to PRODUCTS catalog
    let productList: Product[] = [];
    const { data: dbProducts } = await admin
      .from('products')
      .select('id, name, name_tamil, category_id, price, unit, image_url, available, featured, description, categories(name)');

    if (dbProducts && dbProducts.length > 0) {
      productList = dbProducts.map((p) => {
        // Handle join with categories
        let categoryName = 'General Store';
        if (p.categories) {
          const cats = p.categories as unknown as { name?: string } | { name?: string }[];
          if (Array.isArray(cats)) {
            categoryName = cats[0]?.name || categoryName;
          } else if (cats && typeof cats === 'object') {
            categoryName = cats.name || categoryName;
          }
        }
        return {
          id: p.id,
          name: p.name,
          nameTamil: p.name_tamil,
          category: categoryName as Product['category'],
          unit: p.unit || '1 unit',
          price: p.price,
          available: p.available ?? true,
          featured: p.featured ?? false,
          image: p.image_url || '/images/placeholder-product.svg',
          description: p.description,
        };
      });
    } else {
      productList = PRODUCTS;
    }

    // 2. Clear existing knowledge base
    const { error: deleteErr } = await admin.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteErr) {
      console.warn('[RAG] Clear knowledge_base warning (table may be empty or missing):', deleteErr.message);
    }

    // 3. Embed and insert static chunks
    const staticRows: {
      content: string;
      source: string;
      metadata: Record<string, unknown>;
      embedding: number[];
    }[] = [];

    for (const chunk of STATIC_KNOWLEDGE_CHUNKS) {
      const vector = await generateEmbedding(chunk.content);
      staticRows.push({
        content: chunk.content,
        source: chunk.source,
        metadata: chunk.metadata || {},
        embedding: vector,
      });
      breakdown[chunk.source] = (breakdown[chunk.source] || 0) + 1;
    }

    if (staticRows.length > 0) {
      const { error: insertStaticErr } = await admin.from('knowledge_base').insert(staticRows);
      if (insertStaticErr) {
        throw new Error(`Failed inserting static chunks: ${insertStaticErr.message}`);
      }
    }

    // 4. Embed and insert product chunks
    const productRows: {
      content: string;
      source: string;
      product_id: string;
      metadata: Record<string, unknown>;
      embedding: number[];
    }[] = [];

    for (const prod of productList) {
      const content = buildProductChunkText(prod);
      const vector = await generateEmbedding(content);
      productRows.push({
        content,
        source: 'product',
        product_id: prod.id,
        metadata: {
          product_id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          available: prod.available,
        },
        embedding: vector,
      });
      breakdown.product = (breakdown.product || 0) + 1;
    }

    if (productRows.length > 0) {
      const { error: insertProdErr } = await admin.from('knowledge_base').insert(productRows);
      if (insertProdErr) {
        throw new Error(`Failed inserting product chunks: ${insertProdErr.message}`);
      }
    }

    const staticCount = staticRows.length;
    const prodCount = productRows.length;
    const totalCount = staticCount + prodCount;

    console.info(`[RAG] Re-index complete: ${totalCount} total chunks (${staticCount} static + ${prodCount} products).`);

    return {
      success: true,
      staticChunksCount: staticCount,
      productChunksCount: prodCount,
      totalChunksCount: totalCount,
      breakdown,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[RAG] reindexFullKnowledgeBase error:', message);
    return {
      success: false,
      staticChunksCount: 0,
      productChunksCount: 0,
      totalChunksCount: 0,
      breakdown,
      error: message,
    };
  }
}

/**
 * Runs cosine similarity search against the knowledge base.
 * First tries Supabase match_knowledge_base RPC.
 * If Supabase RPC is unavailable or returns an error, gracefully computes local similarity.
 */
export async function similaritySearch(query: string, matchCount = 5, matchThreshold = 0.20): Promise<KnowledgeChunk[]> {
  try {
    const queryVector = await generateEmbedding(query);
    const admin = getAdminClient();

    // 1. Call Supabase RPC
    const { data: rpcMatches, error: rpcErr } = await admin.rpc('match_knowledge_base', {
      query_embedding: queryVector,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (!rpcErr && Array.isArray(rpcMatches) && rpcMatches.length > 0) {
      return rpcMatches.map((row) => ({
        id: row.id,
        content: row.content,
        source: row.source,
        productId: row.product_id,
        metadata: row.metadata,
        similarity: row.similarity,
      }));
    }

    // 2. Direct select fallback if RPC is not present
    const { data: tableData, error: tableErr } = await admin
      .from('knowledge_base')
      .select('id, content, source, product_id, metadata, embedding')
      .not('embedding', 'is', null)
      .limit(100);

    if (!tableErr && Array.isArray(tableData) && tableData.length > 0) {
      const scored = tableData
        .map((row) => {
          let vector: number[] = [];
          if (Array.isArray(row.embedding)) {
            vector = row.embedding;
          } else if (typeof row.embedding === 'string') {
            try {
              vector = JSON.parse(row.embedding);
            } catch {
              // String formatted vector "[0.1, 0.2, ...]"
              vector = row.embedding
                .replace(/^\[|\]$/g, '')
                .split(',')
                .map((n: string) => parseFloat(n.trim()))
                .filter((n: number) => !isNaN(n));
            }
          }
          const score = cosineSimilarity(queryVector, vector);
          return {
            id: row.id,
            content: row.content,
            source: row.source,
            productId: row.product_id,
            metadata: row.metadata,
            similarity: score,
          };
        })
        .filter((item) => item.similarity >= matchThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, matchCount);

      if (scored.length > 0) {
        return scored;
      }
    }
  } catch (err) {
    console.warn('[RAG] similaritySearch caught exception, falling back to local static chunks:', err);
  }

  // 3. Fallback: Local Keyword Matching if database is offline / empty
  const q = query.toLowerCase();
  const scoredStatic = STATIC_KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0.1;
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (chunk.content.toLowerCase().includes(word)) {
        score += 0.2;
      }
    }
    return {
      content: chunk.content,
      source: chunk.source,
      metadata: chunk.metadata,
      similarity: score,
    };
  })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, matchCount);

  return scoredStatic;
}
