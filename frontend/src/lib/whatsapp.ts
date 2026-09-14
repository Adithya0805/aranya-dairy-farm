// ─────────────────────────────────────────────────────────────────────────────
// Aranya Dairy Farm — WhatsApp Configuration
//
// Single source of truth for the farm's WhatsApp number and URL helpers.
// To update the number later: change WHATSAPP_NUMBER only — no other file
// needs to be touched.
// ─────────────────────────────────────────────────────────────────────────────

/** International format, no spaces or symbols. Used in wa.me URLs. */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918825714576';

/** Human-readable display label. */
export const WHATSAPP_DISPLAY = '+91 88257 14576';

/** tel: href used in phone-call links. */
export const WHATSAPP_TEL = `tel:+${WHATSAPP_NUMBER}`;

/**
 * Builds a complete wa.me URL with an optional pre-filled text message.
 * @param message - Raw (un-encoded) message string. Will be URI-encoded.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ── Common pre-built URLs used across the site ──────────────────────────────

export const WA_GENERAL_ORDER = buildWhatsAppUrl(
  "Hello Aranya Dairy Farm, I'd like to order fresh A2 milk!"
);

export const WA_CATALOG_INQUIRY = buildWhatsAppUrl(
  "Hello Aranya Dairy Farm, I'd like to view your full A2 catalog."
);

export const WA_FARM_INQUIRY = buildWhatsAppUrl(
  "Hello Aranya Dairy Farm, I would like to inquire about farm location and delivery service."
);

export const WA_STORY_INQUIRY = buildWhatsAppUrl(
  'Hello Aranya Dairy Farm, I would like to learn more about your farm story and products.'
);
