// ─────────────────────────────────────────────────────────────────────────────
// Aranya Organic Dairy Farm — Contact & Email Configuration
//
// Single source of truth for the farm's domain, email addresses, and Gmail
// web compose URL builders.
// ─────────────────────────────────────────────────────────────────────────────

/** Official production website domain */
export const FARM_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aranyaorganicdairyfarm.com';

/** Primary contact email address (Google Workspace / Gmail) */
export const PRIMARY_FARM_EMAIL =
  process.env.NEXT_PUBLIC_FARM_EMAIL || 'info@aranyaorganicdairyfarm.com';

/** Secondary support / billing email address */
export const SUPPORT_FARM_EMAIL = 'contact@aranyaorganicdairyfarm.com';

/** Administrative notification email */
export const ADMIN_FARM_EMAIL = 'admin@aranyaorganicdairyfarm.com';

export interface EmailComposeOptions {
  to?: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

/**
 * Builds a direct Gmail Web Compose URL.
 * Opening this URL in any browser immediately launches Gmail's web compose dialog
 * with recipient, subject, and body pre-filled.
 *
 * This avoids the common problem where desktop users don't have a default
 * mail client (like Outlook or Apple Mail) configured for generic mailto: links.
 */
export function buildGmailComposeUrl(options: EmailComposeOptions = {}): string {
  const to = options.to || PRIMARY_FARM_EMAIL;
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to,
  });

  if (options.subject) params.set('su', options.subject);
  if (options.body) params.set('body', options.body);
  if (options.cc) params.set('cc', options.cc);
  if (options.bcc) params.set('bcc', options.bcc);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Builds a standard mailto: URL as a universal fallback for email clients.
 */
export function buildMailtoUrl(options: EmailComposeOptions = {}): string {
  const to = options.to || PRIMARY_FARM_EMAIL;
  const queryParts: string[] = [];

  if (options.subject) queryParts.push(`subject=${encodeURIComponent(options.subject)}`);
  if (options.body) queryParts.push(`body=${encodeURIComponent(options.body)}`);
  if (options.cc) queryParts.push(`cc=${encodeURIComponent(options.cc)}`);
  if (options.bcc) queryParts.push(`bcc=${encodeURIComponent(options.bcc)}`);

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return `mailto:${to}${query}`;
}

export interface FarmInquiryDetails {
  name?: string;
  phone?: string;
  purpose?: string;
  area?: string;
  notes?: string;
}

/**
 * Constructs a structured, human-readable inquiry body for emails.
 */
export function buildInquiryEmailBody(details: FarmInquiryDetails): string {
  return [
    'Hello Aranya Organic Dairy Farm Team,',
    '',
    'I would like to submit an inquiry through your website:',
    '',
    `• Name: ${details.name || 'Valued Patron'}`,
    `• Phone / WhatsApp: ${details.phone || 'N/A'}`,
    `• Inquiry Type: ${details.purpose || 'General Inquiry / Milk Delivery'}`,
    `• Delivery Area / City: ${details.area || 'Shoolagiri / Hosur'}`,
    '',
    'Message / Special Request:',
    details.notes || 'Please provide details on product availability, delivery timings, and pricing.',
    '',
    'Thank you,',
    details.name || 'A Customer',
  ].join('\n');
}

// ── Pre-configured Gmail URLs ───────────────────────────────────────────────

export const GMAIL_GENERAL_INQUIRY = buildGmailComposeUrl({
  to: PRIMARY_FARM_EMAIL,
  subject: 'General Inquiry — Aranya Organic Dairy Farm',
  body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to inquire about your farm fresh A2 milk and natural products.',
});

export const GMAIL_MILK_SUBSCRIPTION = buildGmailComposeUrl({
  to: PRIMARY_FARM_EMAIL,
  subject: 'Daily Milk Delivery Inquiry — Aranya Organic Dairy Farm',
  body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to start a daily morning A2 milk subscription.',
});

export const GMAIL_FARM_VISIT = buildGmailComposeUrl({
  to: PRIMARY_FARM_EMAIL,
  subject: 'Weekend Farm Visit Request — Aranya Organic Dairy Farm',
  body: 'Hello Aranya Organic Dairy Farm Team,\n\nI would like to schedule a weekend visit to your Shoolagiri farm with my family.',
});
