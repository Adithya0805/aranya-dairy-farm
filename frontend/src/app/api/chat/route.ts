import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { similaritySearch } from '@/lib/ragKnowledgeBase';
import { WHATSAPP_DISPLAY } from '@/lib/whatsapp';

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
    'வாங்க',
    'ஆர்டர்',
  ];
  return orderKeywords.some((keyword) => lower.includes(keyword));
}

/**
 * Constructs a strict, RAG-grounded prompt using retrieved knowledge base chunks.
 */
function buildRagSystemPrompt(retrievedContext: string): string {
  return `You are the knowledgeable, warm, and honest customer AI Assistant for Aranya Organic Dairy Farm (located in Shoolagiri, near Hosur, Tamil Nadu).

Your task is to answer the customer's question truthfully, accurately, and politely based SOLELY on the retrieved farm knowledge provided below.

================================================================================
RETRIEVED KNOWLEDGE BASE CONTEXT:
${retrievedContext}
================================================================================

STRICT RULES & GUARDRAILS:
1. STRICT GROUNDING: Use ONLY facts, details, and principles directly stated in the retrieved context above. NEVER hallucinate, extrapolate, or invent farm details, delivery areas, or practices not explicitly provided.
2. UNKNOWN QUERIES: If the retrieved context does not contain enough information to answer the user's question (e.g. out-of-scope topics, unsupported products, or unverified claims), clearly and politely state that the information is not in farm records and advise them to message the farm caretakers on WhatsApp at ${WHATSAPP_DISPLAY}.
3. PRICING RULES:
   - If the retrieved context lists a confirmed numeric price (e.g. "₹80", "₹120"), you may mention it.
   - If a product's price states "Price updating soon" or is not mentioned, EXPLICITLY state that the price is currently being updated by the farm, and invite them to check the Shop page or message WhatsApp (${WHATSAPP_DISPLAY}) for live rates.
   - NEVER invent or guess a numeric price under any circumstances.
4. ORDERING & PURCHASE INTENT: You cannot process payments or finalize orders in this chat. When the customer wants to buy, order, or subscribe, politely guide them to tap the "Continue on WhatsApp" button or message the farm directly at ${WHATSAPP_DISPLAY}.
5. TONE & LANGUAGE: Keep replies concise, helpful, friendly, and well-structured with bullet points when listing items. Reply in Tamil if the user asks in Tamil, or in English otherwise.
`;
}

/**
 * Generates an intelligent grounded local fallback reply using retrieved facts
 * when Gemini API key is missing or the external API call fails.
 */
function generateRagFallbackReply(userMessage: string, contextFacts: string[]): string {
  const q = userMessage.toLowerCase();

  // 1. Order Intent
  if (checkOrderIntent(q)) {
    return `To place an order or start a daily morning subscription, please connect directly with our farm team on WhatsApp! All orders and daily morning delivery routes are coordinated via WhatsApp.\n\nPlease tap the **Continue on WhatsApp** button below or message us directly at **${WHATSAPP_DISPLAY}**.`;
  }

  // 2. If we retrieved relevant facts, summarize them directly
  if (contextFacts.length > 0) {
    return contextFacts.slice(0, 3).join('\n\n') +
      `\n\n*For any additional details or to order, feel free to reach out on WhatsApp at ${WHATSAPP_DISPLAY}.*`;
  }

  // 3. Fallback for out-of-scope or empty context
  return `I don't have verified farm records regarding that question. For specific inquiries or custom orders, please connect directly with our farm team on WhatsApp at **${WHATSAPP_DISPLAY}**!`;
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

  // 3. RAG Step: Vector Similarity Search against Knowledge Base
  let retrievedChunks: { content: string; source: string; similarity?: number }[] = [];
  try {
    retrievedChunks = await similaritySearch(sanitizedContent, 5, 0.20);
  } catch (ragErr) {
    console.warn('[RAG] Similarity search exception:', ragErr);
  }

  const contextText =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map(
            (c, i) =>
              `[Source ${i + 1}: ${c.source.toUpperCase()}${typeof c.similarity === 'number' ? ` | Relevance: ${(c.similarity * 100).toFixed(1)}%` : ''}]\n${c.content}`
          )
          .join('\n\n')
      : 'No specific knowledge base matches found for this query.';

  const systemPrompt = buildRagSystemPrompt(contextText);

  // 4. Check for Gemini API key
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to verified RAG local responder
    const replyText = generateRagFallbackReply(
      sanitizedContent,
      retrievedChunks.map((c) => c.content)
    );
    return NextResponse.json({
      reply: replyText,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(replyText),
      source: 'rag-local-fallback',
      retrievedCount: retrievedChunks.length,
    });
  }

  // 5. Format conversation history for Gemini API
  const historySlice = messages.slice(-6).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content.slice(0, 1000) }],
  }));

  while (historySlice.length > 0 && historySlice[0].role !== 'user') {
    historySlice.shift();
  }

  if (historySlice.length === 0) {
    historySlice.push({
      role: 'user',
      parts: [{ text: sanitizedContent }],
    });
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
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
      console.warn('[Gemini API] Request failed with status', response.status);

      // Fallback model trial: gemini-1.5-flash
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
              source: 'gemini-1.5-flash-rag',
              retrievedCount: retrievedChunks.length,
            });
          }
        }
      }

      const fallbackReply = generateRagFallbackReply(
        sanitizedContent,
        retrievedChunks.map((c) => c.content)
      );
      return NextResponse.json({
        reply: fallbackReply,
        hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
        source: 'rag-local-fallback',
        retrievedCount: retrievedChunks.length,
      });
    }

    const data = await response.json();
    const generatedReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedReply) {
      const fallbackReply = generateRagFallbackReply(
        sanitizedContent,
        retrievedChunks.map((c) => c.content)
      );
      return NextResponse.json({
        reply: fallbackReply,
        hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
        source: 'rag-local-fallback',
        retrievedCount: retrievedChunks.length,
      });
    }

    return NextResponse.json({
      reply: generatedReply,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(generatedReply),
      source: `${modelName}-rag`,
      retrievedCount: retrievedChunks.length,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message.replace(/key=[^&]+/g, 'key=REDACTED') : 'Unknown error';
    console.error('[RAG Chat] Error calling Gemini model:', errorMsg);
    const fallbackReply = generateRagFallbackReply(
      sanitizedContent,
      retrievedChunks.map((c) => c.content)
    );
    return NextResponse.json({
      reply: fallbackReply,
      hasOrderIntent: userHasOrderIntent || checkOrderIntent(fallbackReply),
      source: 'rag-local-fallback',
      retrievedCount: retrievedChunks.length,
    });
  }
}
