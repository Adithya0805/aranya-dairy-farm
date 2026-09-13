import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { getLiveProductCatalogSummary, buildSystemPrompt, FARM_KNOWLEDGE_CONTEXT } from '@/lib/farmKnowledge';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Detects if the user or reply expresses intent to purchase / order.
 */
function checkOrderIntent(text: string): boolean {
  const lower = text.toLowerCase();
  const orderKeywords = [
    'order',
    'buy',
    'purchase',
    'subscribe',
    'subscription',
    'booking',
    'get 1l',
    'get 2l',
    'deliver to',
    'how to buy',
    'add to cart',
    'checkout',
    'whatsapp',
  ];
  return orderKeywords.some((keyword) => lower.includes(keyword));
}

/**
 * Intelligent local fallback responder when GEMINI_API_KEY is not configured
 * or the external API is unreachable. Adheres strictly to the same guardrails.
 */
function generateLocalKnowledgeReply(userMessage: string, catalogSummary: string): string {
  const q = userMessage.toLowerCase();

  // 1. Order Intent & Purchasing takes precedence when customer wants to buy
  if (
    q.includes('how do i buy') ||
    q.includes('how to buy') ||
    q.includes('how to order') ||
    q.includes('place an order') ||
    q.includes('want to buy') ||
    q.includes('want to order') ||
    q.includes('subscribe') ||
    q.includes('subscription')
  ) {
    return `To place an order or start a daily morning subscription, please connect directly with our farm team on WhatsApp! All orders and doorstep delivery routes are managed via WhatsApp.\n\nPlease tap the **Continue on WhatsApp** button in this chat or message us directly at **${WHATSAPP_DISPLAY}**.`;
  }

  // 2. Pricing Guardrail (Strictly no invented numbers)
  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('விலை')) {
    return `Our final product pricing is currently being finalized by the farm to ensure fair, transparent farm-to-table rates. No numeric prices are confirmed yet.\n\nPlease check our Shop page or message us directly on WhatsApp (${WHATSAPP_DISPLAY}) for current pricing updates!`;
  }

  // 3. Organic & A2 Practices (Cow care, feed, calf-first, Vedic Bilona process)
  if (
    q.includes('cow') ||
    q.includes('breed') ||
    q.includes('feed') ||
    q.includes('pasture') ||
    q.includes('eat') ||
    q.includes('raised') ||
    q.includes('treated') ||
    q.includes('calf') ||
    q.includes('bilona') ||
    q.includes('organic') ||
    q.includes('antibiotic') ||
    q.includes('hormone') ||
    q.includes('oxytocin') ||
    q.includes('cold chain') ||
    q.includes('glass bottle') ||
    q.includes('hygiene') ||
    q.includes('story')
  ) {
    return `At Aranya Organic Dairy Farm (established in 2017 in Shoolagiri):\n• **Native Herd**: 100% free-roaming indigenous Gir & Sahiwal cows grazing naturally across pesticide-free open pastures.\n• **Natural Diet**: Grass-fed on fresh napier grass, moringa foliage, and native wild medicinal herbs.\n• **Calf-First Milking**: Calves feed first to their complete satisfaction; our caretakers only harvest surplus milk.\n• **Zero Chemicals**: Strictly zero synthetic hormones, zero oxytocin stimulants, and zero routine antibiotics.\n• **Vedic Bilona Ghee**: Authentic 5-step process from Charaka Samhita—whole A2 curd is churned bidirectionally with a wooden bilona staff, and separated makkhan is gently clarified in earthen clay pots over a low wood fire.\n• **4°C Cold-Chain**: Milk is chilled to 4°C within minutes of milking and delivered in 100% sterilized eco glass bottles (zero plastic contact).`;
  }

  // 4. Delivery Area Coverage
  if (
    q.includes('area') ||
    q.includes('location') ||
    q.includes('where') ||
    q.includes('cover') ||
    q.includes('hosur') ||
    q.includes('shoolagiri') ||
    q.includes('bangalore') ||
    q.includes('bengaluru') ||
    q.includes('chennai') ||
    q.includes('south india') ||
    q.includes('ship') ||
    q.includes('இடம்')
  ) {
    return `Our delivery coverage:\n• **Primary Fresh Milk Delivery**: Shoolagiri and Hosur, delivered every morning at 4°C in reusable glass bottles.\n• **South India Shipping**: We offer shipping across South India for dry provisions, traditional Vedic Bilona Ghee, native millets, and pulses. Specific shipping rules and carrier rates are currently being finalized.\n• **Farm Location**: Shoolagiri, Hosur Krishnagiri Highway, Tamil Nadu 635117.`;
  }

  // 5. Timings & Schedule
  if (q.includes('time') || q.includes('timing') || q.includes('hour') || q.includes('when') || q.includes('morning') || q.includes('cutoff') || q.includes('schedule') || q.includes('நேரம்')) {
    return `Our farm delivery timings and hours are:\n• **Daily Morning Delivery**: 5:30 AM – 7:30 AM delivered chilled at 4°C in sterilized eco glass bottles across Shoolagiri & Hosur.\n• **Order Cut-off**: Orders placed before 8:00 PM are delivered fresh the next morning.\n• **Farm Visits**: Weekends by appointment.\n• **WhatsApp Support**: 6:00 AM – 8:30 PM daily at ${WHATSAPP_DISPLAY}.`;
  }

  // 6. Available Products
  if (q.includes('product') || q.includes('available') || q.includes('sell') || q.includes('items') || q.includes('catalog') || q.includes('what do you') || q.includes('பொருட்கள்')) {
    return `Here are the products currently available from Aranya Farm:\n• **Pure A2 Dairy**: Fresh Farm Milk, A2 Desi Cow Milk (1L Glass Bottle), Farm Whole Milk, Fresh Cultured Butter, Pure Cow Ghee, Cultured Dairy Paneer, Traditional Bilona Cow Ghee.\n• **Native Millets**: Finger Millet (Ragi), Foxtail, Kodo, Little, Barnyard, and Pearl Millet.\n• **Organic Pulses**: Toor Dal, Moong Dal, Urad Dal, Chana Dal.\n• **Natural Sweeteners & Oils**: Organic Jaggery Powder, Raw Honey, Country Sugar, Cold-Pressed Groundnut & Sesame Oils.\n*(Note: Traditional rice varieties are pending confirmation).*`;
  }

  // General Intent to Order
  if (checkOrderIntent(q)) {
    return `To place an order or subscribe for daily delivery, please order directly through WhatsApp! All orders are fulfilled directly by our farm caretakers.\n\nYou can click the **Continue on WhatsApp** button in this chat or message us at **${WHATSAPP_DISPLAY}**.`;
  }

  return `Welcome to Aranya Organic Dairy Farm, Shoolagiri! We provide 100% pure raw A2 milk, Vedic Bilona ghee, native millets, and organic provisions delivered fresh to your doorstep in Hosur and Shoolagiri.\n\nFeel free to ask about our morning delivery timings, delivery areas, organic cow care practices, or tap **Continue on WhatsApp** to order directly!`;
}

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting
  const rateLimitResult = checkRateLimit(req);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests sent. Please wait a moment before asking again.',
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter || 10),
        },
      }
    );
  }

  // 2. Parse and validate request body
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
  }

  const lastUserMessage = messages[messages.length - 1];
  if (!lastUserMessage || !lastUserMessage.content || typeof lastUserMessage.content !== 'string') {
    return NextResponse.json({ error: 'Last message content must be a non-empty string.' }, { status: 400 });
  }

  const sanitizedContent = lastUserMessage.content.trim().slice(0, 1000);
  const userHasOrderIntent = checkOrderIntent(sanitizedContent);

  // 3. Load dynamic product catalog & system prompt
  const catalogSummary = await getLiveProductCatalogSummary();
  const systemPrompt = buildSystemPrompt(catalogSummary);

  // 4. Check for Gemini API key
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to verified farm knowledge engine
    const replyText = generateLocalKnowledgeReply(sanitizedContent, catalogSummary);
    return NextResponse.json({
      reply: replyText,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(replyText),
      source: 'local-knowledge',
    });
  }

  // 5. Format conversation history for Gemini API
  // Limit conversation history to the last 6 messages to keep context efficient
  const historySlice = messages.slice(-6).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content.slice(0, 1000) }],
  }));

  // Ensure first message in history has role 'user'
  while (historySlice.length > 0 && historySlice[0].role !== 'user') {
    historySlice.shift();
  }

  // If after trimming no messages remain, put the current user message
  if (historySlice.length === 0) {
    historySlice.push({
      role: 'user',
      parts: [{ text: sanitizedContent }],
    });
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: historySlice,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
          topP: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('[Gemini API] Request failed with status', response.status, errorText);

      // Try fallback to gemini-1.5-flash if model name was custom or 2.5 failed
      if (modelName !== 'gemini-1.5-flash') {
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const fbResponse = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: historySlice,
            generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
          }),
        });

        if (fbResponse.ok) {
          const fbData = await fbResponse.json();
          const fbReply = fbData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (fbReply) {
            return NextResponse.json({
              reply: fbReply,
              hasOrderIntent: userHasOrderIntent || checkOrderIntent(fbReply),
              source: 'gemini-1.5-flash',
            });
          }
        }
      }

      // If Gemini returned an error, fallback gracefully to verified local knowledge
      const fallbackReply = generateLocalKnowledgeReply(sanitizedContent, catalogSummary);
      return NextResponse.json({
        reply: fallbackReply,
        hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
        source: 'local-knowledge-fallback',
      });
    }

    const data = await response.json();
    const generatedReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedReply) {
      const fallbackReply = generateLocalKnowledgeReply(sanitizedContent, catalogSummary);
      return NextResponse.json({
        reply: fallbackReply,
        hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
        source: 'local-knowledge-fallback',
      });
    }

    return NextResponse.json({
      reply: generatedReply,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(generatedReply),
      source: modelName,
    });
  } catch (err) {
    console.error('[Gemini API] Error calling model:', err);
    // Gracefully provide verified knowledge
    const fallbackReply = generateLocalKnowledgeReply(sanitizedContent, catalogSummary);
    return NextResponse.json({
      reply: fallbackReply,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
      source: 'local-knowledge-fallback',
    });
  }
}
