# 🌿 Aranya Organic Dairy Farm (அரண்யா இயற்கை பால் பண்ணை)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://frontend-seven-indol-10.vercel.app/)

> **A modern, mobile-first farm-to-table eCommerce web platform, conversational AI assistant, live order tracking, and administrative management system built for Aranya Organic Dairy Farm (Shoolagiri, Hosur, Tamil Nadu — Est. 2017).**

---

## 🌐 Official Links & Domain

- 🌍 **Official Production Website**: [https://aranyaorganicdairyfarm.com](https://aranyaorganicdairyfarm.com)
- 🚀 **Live Vercel Deployment**: [https://frontend-seven-indol-10.vercel.app](https://frontend-seven-indol-10.vercel.app)
- 📍 **Farm Location**: Shoolagiri, Hosur, Krishnagiri District, Tamil Nadu — 635117
- 📞 **WhatsApp Hotline**: [+91 99443 38612](https://wa.me/919944338612)
- ✉️ **Primary Email**: [info@aranyaorganicdairyfarm.com](mailto:info@aranyaorganicdairyfarm.com)

---

## ⚡ System Workflows & Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CUSTOMER TOUCHPOINTS                            │
│                                                                             │
│  [Storefront / Catalog] ──> [Cart Drawer] ──> [WhatsApp Checkout]           │
│           │                                           │                     │
│           ▼                                           ▼                     │
│    [Aranya AI Chat]                          [Order ID Generated]           │
│           │                                           │                     │
│           ▼                                           ▼                     │
│    [WhatsApp Handoff]                    [/track-order?id=UUID]             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND & ADMIN WORKFLOWS                          │
│                                                                             │
│  [Supabase PostgreSQL] <── [Admin Server Actions (Service Role)]            │
│           │                                     │                           │
│           ▼                                     ▼                           │
│  [Orders Pipeline]                   [Stock & Low-Stock Alerts]             │
│  (Pending ➔ Delivered)               (Threshold Alert / 24h Anti-Spam)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. 🛍️ Storefront & Dynamic Catalog
- **Live Supabase Catalog**: 32+ curated farm products across A2 Dairy, Traditional Vedic Bilona Ghee, Heritage Rice & Millets, Organic Pulses, Cold-Pressed Oils, and Native Butter.
- **Dynamic Category Filtering**: Category pills and header navigation for seamless browsing.
- **Product Details & Nutritional Modals**: Full nutritional breakdown, traditional Tamil heritage descriptions, packaging units, and live availability badges.

### 2. 🛒 Shopping Cart & WhatsApp Checkout Workflow
- **Client-Side Cart (`CartContext`)**: Synchronous cart state with quantity stepper, subtotal computation, and local state persistence.
- **Seamless Order Insertion**: Submits the order payload (`items`, `total`, `whatsapp_message`) to Supabase via `submitOrderAction`.
- **Order ID Generation & WhatsApp Redirect**: Generates a unique UUID Order ID and opens WhatsApp with a pre-filled itemized invoice and an order tracking link.

### 3. 📦 Customer Order Tracking (`/track-order`)
- **Public & Secure Lookup**: Customers enter their Order ID or open direct links (`/track-order?id=XXXX`).
- **Visual Status Stepper**: Real-time progress indicators: **Order Received (Pending)** ➔ **Confirmed** ➔ **Delivered**.
- **Itemized Breakdown**: Displays ordered items, quantities, pricing, order date, and instant WhatsApp support link.
- **Zero Enumeration Security**: Powered by `/api/track-order` server route using strict single UUID primary-key lookup. Public direct table querying remains blocked.

### 4. 🛡️ Admin Management Portal (`/admin`)
- **Supabase Auth Protection**: Role-based access control redirecting unauthorized visitors to `/admin/login`.
- **Product Management (`/admin/products`)**:
  - Live price editing (₹) and packaging unit updates.
  - Image upload with automatic Supabase Storage sync and orphan file cleanup.
  - Availability toggles (`available = true/false`) and featured item tagging.
- **Order Pipeline (`/admin/orders`)**:
  - Status pipeline: **Pending** ➔ **Confirmed** ➔ **Delivered**.
  - One-click customer WhatsApp communication triggers with pre-populated order status messages.

### 5. ⚠️ Inventory & Low-Stock Alerts
- **Configurable Thresholds**: Product-level `stock` and `low_stock_threshold` (default: 5 units).
- **Automated Alerts**: Triggered when product stock drops below threshold during admin updates.
- **24-Hour Anti-Spam Protection**: Tracks `low_stock_alert_sent_at` in the database to guarantee only one alert per product per day.
- **Multi-Channel Delivery**:
  - Prominent visual `⚠️ Low Stock` badges in the Admin panel.
  - Transactional email dispatch via **Resend** (when configured) or server-side logging.

### 6. 🤖 Aranya AI Farm Assistant
- **Gemini 3.6 Flash Engine**: High-speed conversational AI in [ChatAssistantWidget.tsx](frontend/src/components/ChatAssistantWidget.tsx).
- **Dynamic Catalog Context**: Real-time catalog and pricing injected directly into prompt context.
- **Intent Detection & WhatsApp Handoff**: Identifies purchasing intent and generates one-click WhatsApp action buttons.
- **Deterministic Offline Fallback**: Rule-based backup NLP engine guarantees 100% uptime even during external API downtime.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom farm aesthetic tokens |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth, Storage) |
| **AI / LLM** | [Google Gemini 3.6 Flash](https://ai.google.dev/) (`@google/genai` & REST API) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Hosting** | [Vercel](https://vercel.com/) (Edge Network & Serverless Functions) |

---

## 🗄️ Database & Security Architecture

The database schema is managed via Supabase SQL migrations in `supabase/migrations/`:

### Core Tables
1. **`categories`**: `id` (UUID, PK), `name` (Text, Unique).
2. **`products`**: `id` (UUID, PK), `name`, `name_tamil`, `category_id` (FK), `price`, `unit`, `image_url`, `available`, `featured`, `description`, `stock`, `low_stock_threshold`, `low_stock_alert_sent_at`.
3. **`orders`**: `id` (UUID, PK), `items` (JSONB), `total` (Numeric), `status` (Text), `whatsapp_message` (Text), `created_at` (Timestamptz).

### Row Level Security (RLS) Model
- **`products` & `categories`**: Public `SELECT` allowed. Write mutations restricted to authenticated admin / service role.
- **`orders`**: Public `INSERT` only (customers can submit orders). Public `SELECT`/`UPDATE`/`DELETE` blocked.
- **Order Tracking**: Server route (`/api/track-order`) uses `service_role` to fetch orders strictly by exact UUID, preventing unauthorized catalog enumeration.

---

## 📂 Project Structure

```
aranya-dairy-farm/
├── README.md                      # Project documentation
├── supabase/
│   ├── schema.sql                 # Baseline PostgreSQL schema
│   └── migrations/                # Database migrations
│       ├── 20260914000001_initial_schema.sql
│       ├── 20260914000002_seed_catalog.sql
│       └── 20260917000001_order_tracking_and_low_stock.sql
└── frontend/                      # Next.js 16 Web Application
    ├── package.json
    ├── next.config.ts
    ├── .env.example               # Template environment configuration
    ├── public/                    # Static assets & brand photography
    └── src/
        ├── app/
        │   ├── layout.tsx         # Root layout with CartProvider & ChatAssistant
        │   ├── page.tsx           # High-conversion Homepage
        │   ├── track-order/       # Order tracking public page
        │   ├── products/          # Catalog & category browser
        │   ├── story/             # Heritage & Vedic farming philosophy
        │   ├── contact/           # Farm visit & subscription booking
        │   ├── admin/             # Authenticated store management
        │   │   ├── products/      # Inventory, prices, stock & photo uploads
        │   │   └── orders/        # Order pipeline & status management
        │   └── api/
        │       ├── chat/          # Gemini AI chat route
        │       └── track-order/   # Secure order tracking endpoint
        ├── components/            # Reusable UI components & drawers
        ├── context/               # CartContext (local-first cart state)
        └── lib/                   # Supabase clients, catalog & WhatsApp helpers
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17+` (tested on `v20+` and `v24+`)
- **npm** or **pnpm**
- **Supabase Account**: [supabase.com](https://supabase.com)
- **Google Gemini API Key**: [aistudio.google.com](https://aistudio.google.com/)

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/Adithya0805/aranya-dairy-farm.git
cd aranya-dairy-farm/frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### 3. Environment Variables (`frontend/.env.local`)
```ini
NEXT_PUBLIC_SITE_URL=https://aranyaorganicdairyfarm.com
NEXT_PUBLIC_FARM_EMAIL=info@aranyaorganicdairyfarm.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919944338612

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-3.6-flash

# Optional: Low-Stock Email Alerts
RESEND_API_KEY=re_your_resend_key
ALERT_EMAIL=admin@aranyaorganicdairyfarm.com
```

### 4. Database Setup
Execute the SQL files inside `supabase/migrations/` in order within your Supabase SQL Editor.

### 5. Run Local Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 6. Build & Lint
```bash
# Production Turbopack build
npm run build

# Code linting
npm run lint
```

---

## 📜 License & Ownership

Developed for **Aranya Organic Dairy Farm (அரண்யா இயற்கை பால் பண்ணை)**.  
All rights reserved © 2017–2026.
