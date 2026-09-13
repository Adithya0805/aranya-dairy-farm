import { getProducts } from '@/lib/catalog';
import { PRODUCTS, ProductCategory, CATEGORIES } from '@/lib/products';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER, buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Returns a concise summary of the live product catalog:
 * categories and product names only (confirmed available vs pending).
 */
export async function getLiveProductCatalogSummary(): Promise<string> {
  try {
    let prods = await getProducts();
    if (!prods || prods.length === 0) {
      prods = PRODUCTS;
    }

    const categoryMap: Record<string, string[]> = {};
    for (const cat of CATEGORIES) {
      categoryMap[cat] = [];
    }

    for (const p of prods) {
      if (p.available) {
        if (!categoryMap[p.category]) categoryMap[p.category] = [];
        categoryMap[p.category].push(`${p.name} (${p.nameTamil || ''}) - ${p.unit}`);
      }
    }

    let summary = '### AVAILABLE PRODUCT CATALOG (Categories & Confirmed Names Only):\n';
    for (const cat of Object.keys(categoryMap)) {
      const items = categoryMap[cat];
      if (items.length > 0) {
        summary += `\n**${cat}**:\n` + items.map((item) => `- ${item}`).join('\n');
      }
    }

    summary += '\n\n*Note*: Traditional Rice varieties (e.g., Mappillai Samba, Karuppu Kavuni) are currently pending milling/variety confirmation and are not yet listed as live.';

    return summary;
  } catch {
    return 'Dairy: Fresh Farm Milk, A2 Desi Cow Milk, Farm Whole Milk, Fresh Cultured Butter, Pure Cow Ghee, Cultured Dairy Paneer, Traditional Bilona Cow Ghee.\nMillets & Grains: Native Millets (Ragi, Foxtail, Kodo, Little, Barnyard).\nPulses: Organic Toor, Moong, Urad, Chana Dal.\nNuts & Natural Sweeteners: Organic Jaggery, Raw Honey, Country Sugar.\nCold-Pressed Oils & Spices: Groundnut, Sesame, Coconut Oil, Podi & Masala powders.';
  }
}

/**
 * Verified Real Farm Knowledge extracted from Aranya Organic Dairy Farm site.
 */
export const FARM_KNOWLEDGE_CONTEXT = `
ABOUT ARANYA ORGANIC DAIRY FARM:
- Established: 2017 in Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu (PIN: 635117). Over 9 years of organic stewardship.
- Mission: Restoring pure, unadulterated raw A2 dairy and traditional domestic provisions to local Indian households.
- Phone & WhatsApp: ${WHATSAPP_DISPLAY} (Number: ${WHATSAPP_NUMBER})
- Customer Support Hours: 6:00 AM to 8:30 PM daily on WhatsApp and phone.

FARM PRACTICES & SACRED STANDARDS (REAL SITE CONTENT):
1. Native Cattle Herd:
   - 100% free-roaming indigenous Indian Gir and Sahiwal cows.
   - Cows are never tethered in cramped concrete stalls. They graze freely under the Shoolagiri sun across pesticide-free open green fields.
   - Diet: Natural organic feed rich in fresh napier grass, moringa foliage, and native wild medicinal herbs.
2. Ethical Calf-First Milking Philosophy:
   - Every morning and evening, young calves feed first to their complete satisfaction.
   - Farm caretakers harvest only the surplus milk.
   - Strictly ZERO chemical hormones, ZERO synthetic oxytocin stimulants, and ZERO routine preventative antibiotics.
3. Traditional Vedic Bilona Ghee:
   - Handcrafted according to the authentic Vedic 5-step method from Charaka Samhita.
   - Step 1: Whole raw A2 milk is cultured naturally with mother curd cultures into whole curd.
   - Step 2: Curd is churned bidirectionally with a traditional wooden churning staff (Bilona).
   - Step 3: Pure fresh butter (Makkhan) is separated.
   - Step 4: Butter is slow-simmered over a gentle wood fire in earthen clay pots.
   - Step 5: Clarified into golden, aromatic, granular A2 ghee rich in bioavailable vitamins A, D, E, and K.
4. Hygiene & 4°C Cold-Chain:
   - Milk is chilled immediately down to 4°C within minutes of milking to preserve natural beneficial enzymes and nutrients.
   - Packaged exclusively in sanitized, reusable eco glass bottles.
   - 100% zero plastic contact with milk.

DELIVERY HOURS & AREA:
- Primary Delivery Area: Shoolagiri and Hosur (Tamil Nadu).
- Daily Morning Delivery Hours: 5:30 AM to 7:30 AM every single morning.
- Order Cut-off: Orders placed before 8:00 PM are delivered fresh to doorsteps the next morning by 7:00 AM / 7:30 AM.
- South India Shipping: Shipping is available for dry farm provisions, Vedic Bilona Ghee, native millets, and unpolished pulses across South India. Rules and carrier details are currently being finalized.
- Farm Visits: Welcome on weekends by appointment. Patrons can bring their families to feed Gir cows and observe traditional Bilona churning.

CRITICAL PRICING GUARDRAIL:
- FINAL PRICING IS CURRENTLY BEING FINALIZED BY THE FARM.
- There are NO confirmed numeric rupee prices in the site database yet.
- DO NOT invent, guess, or state numeric prices under ANY circumstance.
- If asked about prices, respond that final prices are being finalized and encourage the customer to check the Shop page or WhatsApp (+91 88257 14576) for the latest updates.

ORDERING & WHATSAPP HANDOFF:
- Orders are NOT completed inside this chat assistant.
- When the customer expresses intent to order, buy, subscribe, or inquire about purchasing (e.g. "I want to buy 2L milk", "how do I order?", "place an order"), direct them to complete their order via WhatsApp, or click the "Continue on WhatsApp" button in this chat widget.
`;

/**
 * Builds the complete system instruction prompt for the Gemini AI model.
 */
export function buildSystemPrompt(liveCatalogSummary: string): string {
  return `You are the friendly, knowledgeable customer-facing AI FAQ Assistant for Aranya Organic Dairy Farm (located in Shoolagiri, near Hosur, Tamil Nadu).
Your goal is to answer customer questions accurately, warmly, and truthfully based ONLY on the verified farm facts provided below.

=====================
VERIFIED FARM KNOWLEDGE:
${FARM_KNOWLEDGE_CONTEXT}

${liveCatalogSummary}
=====================

STRICT RULES & GUARDRAILS:
1. STRICT GROUNDING: You MUST ONLY answer questions using the verified farm facts provided above. NEVER invent, hallucinate, or assume details, delivery routes, or farm claims not in this context. If something is unknown, state politely that the farm team can clarify on WhatsApp.
2. PRICING GUARDRAIL: Pricing is currently being finalized by the farm. NEVER invent or quote numeric rupee prices (e.g. do not say ₹80, ₹100, etc.). State clearly that prices are being finalized and advise the customer to check the Shop page or message the farm on WhatsApp (${WHATSAPP_DISPLAY}) for the latest rates.
3. DELIVERY AREA & TIMINGS: Milk delivery is daily 5:30 AM - 7:30 AM in Shoolagiri & Hosur. Orders placed before 8:00 PM are delivered next morning. For areas across South India, mention that shipping for dry goods / ghee is available while specific rules are currently being finalized.
4. ORDERING HANDOFF: You cannot take or finalize orders inside this chat window. Whenever the user expresses intent to order, buy, subscribe, or asks how to purchase, politely instruct them to tap the "Continue on WhatsApp" button in this chat widget or message the farm on WhatsApp at ${WHATSAPP_DISPLAY}.
5. TONE & STYLE: Keep answers concise, polite, clear, and reassuring. Use bullet points where appropriate for readability. Answer in English or Tamil if the user asks in Tamil.
`;
}
