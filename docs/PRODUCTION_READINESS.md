# Aranya Organic Dairy Farm — Production Readiness & Architecture Manual

> **Document Status**: Production Verified  
> **Repository**: `Adithya0805/aranya-dairy-farm`  
> **Target Environment**: Pre-Domain Production Stage  
> **Last Verified**: September 2026

---

## 1. Architecture Overview

Aranya Organic Dairy Farm's digital platform is an enterprise-grade web application engineered for speed, high accessibility, uncompromising security, and smooth customer order placement via WhatsApp.

```
┌─────────────────────────────────────────────────────────────┐
│                    Customer Browser / Client                │
│   Next.js 16 App Router (React 19, Tailwind CSS v4, Lucide) │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        (Public Catalog)               (Server Actions / API)
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│    Supabase PostgreSQL      │ │    Next.js Server Runtime    │
│  - Row Level Security (RLS) │ │  - Server Actions           │
│  - Read-only anon access    │ │  - Rate Limiter (Chat API)  │
│  - Service role for admin   │ │  - Gemini 3.6 Flash / Fallback
└─────────────────────────────┘ └──────────────┬──────────────┘
                                               │
                                               ▼
                                ┌─────────────────────────────┐
                                │   WhatsApp Business API     │
                                │   Direct Customer Orders    │
                                └─────────────────────────────┘
```

### Core Technology Stack
- **Framework**: Next.js 16.3.3 (Turbopack, App Router, React 19.2.8 Server & Client Components)
- **Styling**: Tailwind CSS v4 with custom rustic earthy design tokens (`#122E1B` Deep Forest Green, `#E58A13` Warm Gold/Amber, `#FAF7F2` Cream/Parchment)
- **Database & Storage**: Supabase PostgreSQL 15+ with Row Level Security (RLS) and Supabase Storage (`product-images`)
- **AI Customer Assistant**: Google Gemini API (`gemini-3.6-flash`) with dynamic catalog injection and deterministic rule-based local knowledge fallback
- **Order Pipeline**: Hybrid Server Action order persistence with zero-friction WhatsApp order dispatching (`wa.me`)

---

## 2. Environment Variables Reference

All environment variables are declared and validated in server/client layers. Never commit `.env` or `.env.local` to version control.

| Variable Name | Exposure | Required | Default / Format | Description |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | **Yes** | `https://<ref>.supabase.co` | Supabase project API gateway URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | **Yes** | `eyJhbGci...` (Anon JWT) | Public anon key for client-side queries protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only** | **Yes** | `eyJhbGci...` (Service JWT) | High-privilege key for admin management. **Never expose to client.** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Client & Server | **Yes** | `918825714576` | Farm WhatsApp order recipient in international format (no `+` or spaces) |
| `GEMINI_API_KEY` | **Server Only** | Optional | `AIzaSy...` | Google AI Studio API key for customer chat assistant |
| `GEMINI_MODEL` | **Server Only** | Optional | `gemini-3.6-flash` | Gemini model name (falls back to `gemini-1.5-flash` or local engine) |
| `ADMIN_EMAILS` | **Server Only** | Optional | `admin@aranyafarm.com,...` | Comma-separated list of authorized administrator email accounts |

---

## 3. Database Schema & Migrations Guide

The database schema is managed via non-destructive, idempotent SQL migrations under `supabase/migrations/`.

### Migration Sequence
1. **`20260914000001_initial_schema.sql`**:
   - Creates extensions (`pgcrypto`).
   - Idempotently creates tables (`categories`, `products`, `orders`).
   - Adds indexes for query performance (`idx_products_category_id`, `idx_products_available`, `idx_orders_created_at`, `idx_orders_status`).
   - Sets strict Row Level Security (RLS) policies and table grants.
2. **`20260914000002_seed_catalog.sql`**:
   - Populates the 6 base categories.
   - Inserts the 32 catalog items with Tamil and English naming, correct availability flags, and unit specifications using `ON CONFLICT (name) DO NOTHING`.

### Table Schema Summary

#### `categories`
- `id` (uuid, primary key)
- `name` (text, unique, not null)

#### `products`
- `id` (uuid, primary key)
- `name` (text, unique, not null)
- `name_tamil` (text)
- `category_id` (uuid, foreign key -> `categories.id` on delete set null)
- `price` (numeric, nullable — `null` represents pending pricing, displayed as *"Price updating soon"*)
- `unit` (text, e.g. "1 Litre", "500g")
- `image_url` (text, storage path or URL)
- `available` (boolean, default true; false for unconfirmed traditional rice items)
- `featured` (boolean, default false; controls homepage Farm Favorites)
- `description` (text)
- `created_at` (timestamptz, default now())

#### `orders`
- `id` (uuid, primary key)
- `items` (jsonb, validated array of `{product_id, name, qty, price}`)
- `total` (numeric, server-computed total)
- `status` (text, default `'pending'`)
- `whatsapp_message` (text, customer message)
- `created_at` (timestamptz, default now())

---

## 4. Security Posture

### Row Level Security (RLS)
- **`categories`**: Public read-only (`SELECT USING (true)`). Writes restricted to authenticated admin or service role.
- **`products`**: Public read-only (`SELECT USING (true)`). Writes restricted to authenticated admin or service role. Direct anon inserts/updates are blocked by RLS.
- **`orders`**: Public append-only (`INSERT WITH CHECK (true)`). Public read, update, and delete are strictly disabled. Only authenticated administrators and the service role can view or manage orders.

### Secrets Protection & Server Isolation
- `frontend/src/lib/supabaseServer.ts` includes an explicit runtime environment check (`if (typeof window !== 'undefined') throw new Error(...)`).
- Automated tests verify that no client component or client route references `SUPABASE_SERVICE_ROLE_KEY`.
- Error messages presented in UI toasts and chat API responses are sanitized: internal database connection strings, environment keys, and stack traces are never exposed to the client.

### Admin Authorization
- Administrator sessions are verified via `verifyAdminUser(token)`.
- Checks both the validity of the JWT and user authorization:
  1. User possessing `role: 'admin'` in `app_metadata` or `user_metadata`.
  2. Matching against `ADMIN_EMAILS` list.
- Ordinary registered users cannot perform admin mutations or access admin dashboards.

---

## 5. AI Customer Assistant Guardrails

The customer assistant (`/api/chat`) is designed as a helpful, truthful farm guide.

### Guardrails
1. **No Hallucinated Prices**: When product prices are pending (`null`), the AI never invents numbers. It explicitly states that prices are being finalized and directs the customer to the shop or WhatsApp.
2. **Order Routing**: Whenever a customer indicates intent to purchase, buy, or subscribe, the AI directs them to finalize details via WhatsApp.
3. **Delivery Bounds**: Primary fresh morning milk delivery is strictly stated as Shoolagiri and Hosur (5:30 AM – 7:30 AM). South India shipping is noted for dry provisions only.
4. **Rate Limiting**: Rate-limited to 10 requests per minute per IP address.
5. **Deterministic Fallback**: If the Gemini API key is unset or external endpoints are temporarily unavailable, the system automatically falls back to an in-memory knowledge engine that answers customer inquiries accurately without failing.

---

## 6. Performance & Code Quality Baseline

- **Build Output**: Clean Next.js 16 production build with 16 routes statically optimized.
- **TypeScript**: Strict checking passed with zero type errors.
- **Linting**: ESLint clean with 0 errors and 0 warnings.
- **Automated Tests**: Comprehensive test suite covering catalog integrity, price formatting, WhatsApp URL builder, cart quantity clamping, order payload validation, and client secret isolation.

---

## 7. Pre-Domain Launch Checklist

Before purchasing or pointing any custom domain:
- [x] Production build passes (`npm run build`) with zero errors.
- [x] ESLint passes (`npm run lint`) with zero errors and zero warnings.
- [x] Core validation tests pass (`npm run test`).
- [x] Live database contains 31 products with 8 traditional rice items marked `available = false`.
- [x] Public RLS policies verified on `products`, `categories`, and `orders`.
- [x] Server-side runtime isolation enforced for `SUPABASE_SERVICE_ROLE_KEY`.
- [x] Error toast messages cleaned of any internal environment variable names.
- [x] Admin authorization checks enforced for `role = admin` and `ADMIN_EMAILS`.
- [x] WhatsApp phone number confirmed as `+91 88257 14576` (`918825714576`).
- [x] Dynamic sitemap (`/sitemap.xml`) and robots (`/robots.txt`) configured with production metadata.

---

## 8. Post-Domain Launch Checklist

Immediately after connecting the custom domain in Vercel/hosting provider:
1. **Environment Variables**:
   - Update `NEXT_PUBLIC_SITE_URL` (or equivalent base URL) in hosting platform settings to `https://your-custom-domain.com`.
2. **SSL / HTTPS**:
   - Verify SSL certificate is issued and auto-renewing.
   - Verify HTTP requests automatically redirect to HTTPS.
3. **SEO & Metadata**:
   - Visit `https://your-custom-domain.com/robots.txt` and verify the sitemap URL matches the custom domain.
   - Visit `https://your-custom-domain.com/sitemap.xml` and verify all canonical URLs use the custom domain.
   - Run Google Search Console verification via DNS TXT record or HTML tag.
4. **End-to-End Order Flow**:
   - Add an available product to the cart.
   - Click "Order via WhatsApp" on desktop and mobile.
   - Verify that the WhatsApp web / mobile app opens with the exact item list, quantities, and prices.
   - Check the Supabase admin panel `/admin/orders` to confirm the order was logged as `pending`.
5. **AI Chat Assistant**:
   - Open customer chat widget.
   - Send test inquiry: *"Do you deliver milk to Hosur?"*
   - Verify response timing, correctness, and WhatsApp CTA button.
