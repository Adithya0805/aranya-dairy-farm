# Aranya Organic Dairy Farm (அரண்யா இயற்கை பால் பண்ணை)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://frontend-seven-indol-10.vercel.app/)

> **A modern, mobile-first farm-to-table web application, AI-powered customer assistant, and live administrative management platform built for Aranya Organic Dairy Farm in Shoolagiri, Hosur, Tamil Nadu (Established in 2017).**

🌐 **Live Production App**: [frontend-seven-indol-10.vercel.app](https://frontend-seven-indol-10.vercel.app/)  
📍 **Farm Location**: Shoolagiri, Hosur, Krishnagiri District, Tamil Nadu, India  
📞 **Official WhatsApp & Inquiries**: [+91 88257 14576](https://wa.me/918825714576)

---

## 📖 Table of Contents
1. [Heritage & Farm Philosophy](#-heritage--farm-philosophy)
2. [Key Features & Highlights](#-key-features--highlights)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [AI Customer Assistant (Aranya AI)](#-ai-customer-assistant-aranya-ai)
5. [Database & Security Architecture (Supabase)](#-database--security-architecture-supabase)
6. [Administrative Management Portal (/admin)](#-administrative-management-portal-admin)
7. [SEO, Social Cards & PWA](#-seo-social-cards--pwa)
8. [Project Structure](#-project-structure)
9. [Getting Started (Local Development)](#-getting-started-local-development)
10. [Environment Variables](#-environment-variables)
11. [Build, Quality & Pre-Production Audit](#-build-quality--pre-production-audit)
12. [Deployment Guide (Vercel)](#-deployment-guide-vercel)
13. [License & Contact](#-license--contact)

---

## 🌿 Heritage & Farm Philosophy

**Aranya Organic Dairy Farm** was founded in 2017 with a singular mission: to eliminate adulteration, synthetic stimulants, and industrial mistreatment from daily household dairy and provisions. Situated amidst the scenic pasture hills of Shoolagiri (near Hosur & Bengaluru), the farm operates strictly on traditional Vedic ecological practices:

- **Calf-First Milking (கன்றுக்கு முதலிடம்)**: Calves nurse to complete satisfaction twice daily before any surplus unadulterated milk is collected.
- **100% Free-Roaming Pastures**: Native Gir and Sahiwal cows graze freely on chemical-free pastures seeded with napier grass, moringa, and native medicinal herbs. Zero industrial stall confinement.
- **Zero Hormones & Antibiotics**: Zero synthetic oxytocin injections, zero chemical growth hormones, and zero prophylactic antibiotics.
- **Handcrafted Vedic Bilona Ghee (பழமையான பிலோனா நெய்)**: Authentic 5-step Vedic method — whole raw milk cultured into curd, bidirectional wooden churn (bilona) extraction of makkhan, and slow clarification in earthen pots over low flame.
- **4°C Cold-Chain & Zero Plastic**: Immediately chilled to 4°C within minutes of milking and delivered fresh across Hosur and Shoolagiri in sterilized, reusable glass bottles.

---

## ✨ Key Features & Highlights

### 🛍️ 1. Dynamic Storefront & Catalog
- **Live Inventory**: Real-time catalog fetched from Supabase with instant client fallback defaults.
- **Categories**: Pure A2 Dairy, Traditional Vedic Bilona Ghee, Heritage Rice & Millets, Organic Pulses & Lentils, Cold-Pressed Oils, and Native Butter.
- **Filter & Search**: Real-time category pills, interactive category dropdown in the header, and quick filtering.
- **Quick View Modals & Detail Drawers**: Full nutritional breakdown, traditional Tamil heritage descriptions, packaging details, and unit selectors.
- **Dynamic Stock Status**: Real-time badges for items in stock or awaiting seasonal harvest pricing.

### 🛒 2. Persistent Shopping Cart & Direct WhatsApp Checkout
- **React Context API (`CartContext`)**: Synchronous cart state with quantity stepper, subtotal computation, and local state persistence.
- **Slide-Over Drawer**: Clean sliding cart drawer accessible anywhere on mobile and desktop.
- **Animated Cart Badge**: Live notification pop badge reflecting active item count.
- **Sticky Mobile Add-to-Cart Bar**: Smooth mobile drawer bar that slides up on product pages for instant purchasing.
- **Direct WhatsApp Order Generation**: Compiles items, quantities, units, total cost, and delivery address into pre-formatted, clickable WhatsApp messages routed to the farm manager.

### 🤖 3. Aranya AI Farm Assistant
- **Gemini 3.6 Flash Integration**: High-speed conversational agent specialized in organic dairy, A2 milk benefits, Bilona ghee preparation, and farm heritage.
- **Dynamic Catalog Context**: Automatically embeds real-time product prices, units, and availability directly into system prompts.
- **Guardrails & Order Intent Detection**: Flags customer purchasing intent and suggests instant WhatsApp handoff.
- **Intelligent Local Fallback**: Rule-based backup response system ensuring customer service never goes down if external AI APIs encounter network issues or rate limits.
- **IP Rate Limiting**: Built-in sliding window rate limiter (10 requests/min per IP) to prevent abuse and API exhaustion.

### 🛡️ 4. Enterprise Security & Row Level Security (RLS)
- **Zero Public Write Access**: Catalog tables (`products`, `categories`) are strictly public read-only (`SELECT` only).
- **Public Insert-Only Orders**: Anonymous visitors can insert their own orders, but cannot view, edit, or delete any orders.
- **Admin Server Actions**: All catalog mutations and order status updates execute through authenticated Supabase server actions with service role verification.

### 📊 5. Secured Admin Portal (`/admin`)
- **Authentication**: Supabase Auth session protection with automatic redirect to `/admin/login`.
- **Product Management (`/admin/products`)**: Add new products, update prices, toggle availability, set featured status, and edit descriptions.
- **Order Management (`/admin/orders`)**: Real-time status pipeline (`pending`, `confirmed`, `out_for_delivery`, `delivered`, `cancelled`), customer contact details, and printable delivery slips.

### 🚀 6. Performance & Modern SEO
- **Turbopack Build**: Static generation with Next.js 16+ App Router for near-instant page loads.
- **MetadataBase & Social Cards**: Fully compliant OpenGraph (1200x630) and Twitter Card tags.
- **Dedicated Route Layouts**: Custom metadata titles and descriptions for `/products`, `/story`, and `/contact`.
- **Crawler Optimization**: Dynamic `robots.txt` and `sitemap.xml` for maximum search engine indexation.
- **Custom 404 Page**: Branded, engaging not-found page styled with organic farm aesthetics.

---

## 🏗️ Architecture & Tech Stack

```
                        ┌─────────────────────────────────────────┐
                        │              Client Browser             │
                        │    (Desktop / Mobile PWA Viewports)     │
                        └───────────────────┬─────────────────────┘
                                            │
                                  HTTPS / Next.js 16
                                            │
                        ┌───────────────────▼─────────────────────┐
                        │          Next.js App Router             │
                        │   Turbopack • React 19 • TypeScript     │
                        │   Tailwind CSS v4 • Context API         │
                        └─────────┬───────────────────┬───────────┘
                                  │                   │
                 Server Actions & │                   │ POST /api/chat
                 Direct Supabase  │                   │ (Rate Limited)
                                  │                   │
                        ┌─────────▼─────────┐       ┌─▼──────────────────┐
                        │     Supabase      │       │   Google Gemini    │
                        │    PostgreSQL     │       │     3.6 Flash      │
                        │ (RLS Protected)   │       │  (AI Farm Assist)  │
                        └───────────────────┘       └────────────────────┘
```

### Technology Breakdown

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Type Checking) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom farm brand tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Auth) |
| **AI / LLM Engine** | [Google Gemini 3.6 Flash](https://ai.google.dev/) (`@google/genai` & REST API) |
| **State Management** | React Context (`CartContext`), React Hooks (`useCallback`, `useMemo`, `useRef`) |
| **Hosting & CDN** | [Vercel](https://vercel.com/) (Edge Network & Serverless Functions) |

---

## 🤖 AI Customer Assistant (`Aranya AI`)

The AI assistant lives in [src/components/ChatAssistantWidget.tsx](frontend/src/components/ChatAssistantWidget.tsx) and connects to [src/app/api/chat/route.ts](frontend/src/app/api/chat/route.ts).

### How It Works:
1. **Catalog Injection**: At request time, the chat route reads all available products from the database and summarizes them into structured system prompt context:
   ```ts
   // Live catalog format supplied to Gemini
   Category: Dairy | Product: Raw Whole A2 Milk | Unit: 1 Litre | Price: ₹95 | Status: In Stock
   Category: Dairy | Product: Vedic Bilona Ghee | Unit: 500ml | Price: ₹950 | Status: In Stock
   ```
2. **Strict Guardrails**:
   - Only provides information about Aranya Organic Dairy Farm, A2 cow milk, Bilona ghee, Shoolagiri heritage, delivery zones, and organic farming methods.
   - Refuses off-topic questions politely and steers users back to farm offerings.
3. **Intent Detection & WhatsApp Handoff**:
   - Detects customer order keywords (e.g., *"buy"*, *"order"*, *"price"*, *"subscribe"*, *"deliver to Hosur"*).
   - Dynamically offers a **"Continue on WhatsApp"** pill that transfers the user directly to the farm's WhatsApp with their inquiry pre-filled.
4. **Resilient Local Fallback Engine**:
   - If the Gemini API key is not configured or upstream service experiences rate-limiting, the system automatically uses an internal deterministic NLP knowledge matcher, guaranteeing 100% uptime.

---

## 🗄️ Database & Security Architecture (Supabase)

The database schema is defined in [supabase/schema.sql](supabase/schema.sql).

### Tables

1. **`categories`**:
   - `id` (UUID, Primary Key)
   - `name` (Text, Unique) — e.g. *Dairy*, *Rice & Millets*, *Pulses & Lentils*, *Cold-Pressed Oils*
2. **`products`**:
   - `id` (UUID, Primary Key)
   - `name` (Text, Unique)
   - `name_tamil` (Text) — Traditional Tamil name (e.g., *நாட்டு மாட்டு பால்*, *பிலோனா நெய்*)
   - `category_id` (UUID, Foreign Key referencing `categories.id`)
   - `price` (Numeric)
   - `unit` (Text) — e.g., *1 Litre*, *500ml*, *1 kg*
   - `image_url` (Text)
   - `available` (Boolean, Default `true`)
   - `featured` (Boolean, Default `false`)
   - `description` (Text)
3. **`orders`**:
   - `id` (UUID, Primary Key)
   - `items` (JSONB) — array of items with `{ product_id, name, qty, price }`
   - `total` (Numeric)
   - `status` (Text, Default `'pending'`)
   - `whatsapp_message` (Text)
   - `created_at` (Timestamp)

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Public READ ONLY on products & categories
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read products" on products for select using (true);

-- Public INSERT ONLY on orders (prevents customers from reading other orders)
create policy "Public can place orders" on orders for insert with check (true);

-- Admin CRUD access (via authenticated role or server-side service role)
create policy "Authenticated users full access to categories" on categories for all to authenticated using (true);
create policy "Authenticated users full access to products" on products for all to authenticated using (true);
create policy "Authenticated users full access to orders" on orders for all to authenticated using (true);
```

---

## 🛡️ Administrative Management Portal (`/admin`)

The admin dashboard provides secure management for the farm operations team:

- **`/admin/login`**: Authenticates farm managers using Supabase Auth.
- **`/admin/products`**:
  - Live toggling of item availability (`available = true/false`).
  - Editing retail prices (₹) and packaging units.
  - Adding new harvest items and assigning categories.
- **`/admin/orders`**:
  - Order status pipeline: **Pending** ➔ **Confirmed** ➔ **Out for Delivery** ➔ **Delivered** (or **Cancelled**).
  - Single-click invoice print view with complete itemized breakdown and delivery address.
  - WhatsApp customer communication trigger with pre-filled order status updates.

---

## 🌐 SEO, Social Cards & PWA

- **Canonical URL**: `https://aranyadairyfarm.com` configured via Next.js `metadataBase`.
- **OpenGraph & Twitter Card**: Pre-rendered OpenGraph previews with high-resolution pasture imagery (`/images/nature_hero_pasture.jpg`, 1200×630).
- **Robots Directives ([src/app/robots.ts](frontend/src/app/robots.ts))**:
  - Public indexing allowed on `/`, `/products`, `/story`, `/contact`.
  - Disallowed on `/admin*` to protect sensitive dashboards.
- **Dynamic Sitemap ([src/app/sitemap.ts](frontend/src/app/sitemap.ts))**: Automatically registers all primary and catalog routes with proper change frequencies.
- **Branded 404 Page ([src/app/not-found.tsx](frontend/src/app/not-found.tsx))**: Helpful user redirection with direct action links to the farm shop.

---

## 📂 Project Structure

```
aranya-dairy-farm/
├── .gitignore
├── README.md                      # Comprehensive Project Documentation
├── docs/
│   ├── Aranya-Product-List-Draft.md # Catalog draft & pricing notes
│   └── roadmap.md                 # Project vision & phase tracking
├── supabase/
│   └── schema.sql                 # PostgreSQL DDL, RLS policies & seed data
└── frontend/                      # Next.js 16 Web Application
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs          # Flat ESLint configuration
    ├── .env.example               # Template environment configuration
    ├── public/
    │   ├── favicon.ico
    │   ├── manifest.json
    │   └── images/
    │       ├── a2_milk_bottle.jpg
    │       ├── aranya-logo.png
    │       ├── bilona_ghee_jar.jpg
    │       ├── nature_hero_pasture.jpg
    │       └── vedic_butter.jpg
    └── src/
        ├── app/
        │   ├── layout.tsx         # Root layout with CartProvider & ChatAssistant
        │   ├── page.tsx           # High-conversion Homepage
        │   ├── not-found.tsx      # Custom branded 404 page
        │   ├── robots.ts          # Search engine crawler configuration
        │   ├── sitemap.ts         # Dynamic XML sitemap generator
        │   ├── products/
        │   │   ├── layout.tsx     # Products SEO metadata layout
        │   │   └── page.tsx       # Complete product catalog page
        │   ├── story/
        │   │   ├── layout.tsx     # 9-Year Story SEO metadata layout
        │   │   └── page.tsx       # Farm heritage & Vedic philosophy
        │   ├── contact/
        │   │   ├── layout.tsx     # Contact & Map SEO metadata layout
        │   │   └── page.tsx       # Farm visit & subscription booking
        │   ├── admin/
        │   │   ├── layout.tsx     # Protected admin layout & navigation
        │   │   ├── actions.ts     # Admin Server Actions (Supabase Service Role)
        │   │   ├── login/page.tsx # Admin Supabase Auth sign-in
        │   │   ├── products/page.tsx # Inventory & price editor
        │   │   └── orders/page.tsx   # Order tracking & invoice generation
        │   └── api/
        │       └── chat/route.ts  # Gemini 3.6 Flash AI chat endpoint
        ├── components/
        │   ├── Header.tsx         # Sticky header with animated cart badge
        │   ├── Hero.tsx           # Full-bleed nature photography hero
        │   ├── TrustBadgesSection.tsx # 9-year trust indicators & social proof
        │   ├── ProductsSection.tsx # Live catalog grid with local cart state
        │   ├── FeaturedCategoriesSection.tsx # Category showcase cards
        │   ├── FeaturedProductsPreview.tsx # Curated highlights
        │   ├── AboutSection.tsx   # Heritage & organic pasture storytelling
        │   ├── Footer.tsx         # Footer with address, hours & navigation
        │   ├── CartDrawer.tsx     # Slide-over shopping cart
        │   ├── QuickViewModal.tsx # Product quick preview dialog
        │   ├── DetailModal.tsx    # Comprehensive product modal
        │   ├── MobileBottomNav.tsx # Native mobile bottom bar
        │   ├── StickyMobileAddToCartBar.tsx # Mobile sticky buying bar
        │   ├── ChatAssistantWidget.tsx # AI Chat Assistant floating widget
        │   ├── WhatsAppCTA.tsx    # Floating WhatsApp action button
        │   └── Toast.tsx          # Non-intrusive feedback toast
        ├── context/
        │   └── CartContext.tsx    # Cart state, badge counters & subtotal
        ├── hooks/
        │   └── useScrollReveal.ts # IntersectionObserver scroll animations
        └── lib/
            ├── supabase.ts        # Supabase client & service role factories
            ├── products.ts        # Static product types & fallback catalog
            ├── catalog.ts         # Supabase data fetchers & cover resolvers
            └── whatsapp.ts        # WhatsApp message formatters & URL builders
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher (tested on Node.js `v20+` and `v24+`)
- **npm** or **pnpm** installed
- A **Supabase** account & project ([supabase.com](https://supabase.com))
- A **Google Gemini API Key** ([aistudio.google.com](https://aistudio.google.com/))

### 2. Clone Repository
```bash
git clone https://github.com/Adithya0805/aranya-dairy-farm.git
cd aranya-dairy-farm/frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials (see [Environment Variables](#-environment-variables) section below).

### 5. Setup Supabase Database
1. Go to your Supabase project's **SQL Editor**.
2. Open and paste the contents of [supabase/schema.sql](supabase/schema.sql).
3. Click **Run**. This will create the `categories`, `products`, and `orders` tables, enable Row Level Security, grant permissions, and insert initial categories.

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `frontend/.env.local` file with the following variables:

```ini
# Supabase Configuration (Public Anon)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Server Admin (Kept strictly server-side)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API for Farm Assistant Widget
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash

# WhatsApp Business Communication Number (Country Code + 10 Digits)
NEXT_PUBLIC_WHATSAPP_NUMBER=918825714576
```

> **Security Note**: Never commit `.env.local` or sensitive service role keys to Git. The project `.gitignore` strictly ignores `.env*` files with an exception for `.env.example`.

---

## 🧪 Build, Quality & Pre-Production Audit

The codebase underwent a complete 8-category pre-production audit before release:

### 1. Verification Commands
```bash
# Typecheck & production build (Turbopack)
npm run build

# Code linting & style enforcement
npm run lint
```

### 2. Audit Summary Table

| Category | Verification | Result | Status |
|---|---|---|---|
| **Build Health** | `npm run build` | 16/16 routes compiled and prerendered cleanly | **PASS** |
| **Code Health** | `npm run lint` | ESLint exited with 0 errors and 0 warnings | **PASS** |
| **TypeScript Strictness** | `tsc --noEmit` | Strict mode enabled, zero `any` types in critical flows | **PASS** |
| **Database RLS** | Supabase Policies | Public read-only on catalog, public insert-only on orders | **PASS** |
| **AI Assistant** | `/api/chat` Route | Upgraded to `gemini-3.6-flash` + local knowledge fallback | **PASS** |
| **WhatsApp Links** | Click Handlers | Dynamic `NEXT_PUBLIC_WHATSAPP_NUMBER` configuration | **PASS** |
| **Internal Routing** | Next.js `<Link>` | Zero full-page reloads across all navigations | **PASS** |
| **SEO & Crawlers** | OpenGraph & Robots | `robots.ts`, `sitemap.ts`, OpenGraph (1200x630), 404 page | **PASS** |

---

## 🚢 Deployment Guide (Vercel)

The application is optimized for deployment on the **Vercel Platform**:

1. **Push to GitHub**:
   Ensure all changes are pushed to your `main` branch.
2. **Import into Vercel**:
   - In your Vercel Dashboard, select **Add New Project** ➔ **Import Git Repository**.
   - Set the **Root Directory** to `frontend`.
3. **Configure Environment Variables**:
   Add the following variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (`gemini-3.6-flash`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (`918825714576`)
4. **Deploy**:
   Vercel will trigger an automated build using `next build`.
5. **Custom Domain**:
   Add your domain (e.g., `aranyadairyfarm.com`) under **Project Settings ➔ Domains** and point your DNS A / CNAME records to Vercel.

---

## 📜 License & Contact

### 🏛️ Farm Address & Contact
- **Farm Name**: Aranya Organic Dairy Farm (அரண்யா இயற்கை பால் பண்ணை)
- **Location**: Shoolagiri, Hosur, Krishnagiri District, Tamil Nadu — 635117
- **Direct Phone / WhatsApp**: [+91 88257 14576](https://wa.me/918825714576)
- **Email**: aranyadairyfarm@gmail.com
- **Justdial Rating**: [3.6★ (15+ Verified Customer Reviews)](https://www.justdial.com/Hosur/Aranya-Organic-Dairy-Farm-Shoolagiri/9999P4344-4344-200625222032-D9B4_BZDET)

### 📄 License
This software and its branding assets are developed for **Aranya Organic Dairy Farm**. All rights reserved. Code is provided for production operation and maintenance.
