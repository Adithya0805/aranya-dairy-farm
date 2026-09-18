import 'server-only';

if (typeof window !== 'undefined') {
  throw new Error('Security violation: embeddings.ts must not be imported in client-side code.');
}

const EMBEDDING_MODEL = 'models/gemini-embedding-001';
const EMBEDDING_DIMENSION = 768;

/**
 * Generates a 768-dimensional vector embedding for the given text using Google Gemini.
 * Strictly executed on the server only.
 */
export async function generateEmbedding(text: string, retries = 3): Promise<number[]> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment variables.');
  }

  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('Cannot generate embedding for empty text string.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          content: {
            parts: [{ text: cleanText }],
          },
          outputDimensionality: EMBEDDING_DIMENSION,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const vector: number[] = data?.embedding?.values;

        if (Array.isArray(vector) && vector.length > 0) {
          return vector;
        }
      }

      // If server returned 503 or 429, wait and retry
      if (response.status === 503 || response.status === 429) {
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 500));
          continue;
        }
      }

      const errorBody = await response.text().catch(() => '');
      if (attempt === retries) {
        throw new Error(`Gemini Embedding API failed with status ${response.status}: ${errorBody.slice(0, 200)}`);
      }
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw new Error('Failed to generate embedding after retries.');
}

/**
 * Computes cosine similarity between two numeric vectors of identical length.
 * Useful for local in-memory re-ranking or validation.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;
  return dotProduct / magnitude;
}
