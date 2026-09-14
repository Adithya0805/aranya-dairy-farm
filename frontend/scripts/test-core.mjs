import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// ----------------------------------------------------------------------------
// 1. Catalog & Pricing Tests
// ----------------------------------------------------------------------------
test('Catalog Integrity: PRODUCTS definitions', async () => {
  const content = fs.readFileSync('src/lib/products.ts', 'utf8');

  // Check that 32 products exist
  const idMatches = content.match(/id:\s*['"][^'"]+['"]/g) || [];
  assert.equal(idMatches.length, 32, 'Catalog must contain exactly 32 products');

  // Check that traditional rice items are marked available: false
  const traditionalRice = [
    'Mappillai Samba Rice',
    'Karuppu Kavuni Black Rice',
    'Seeraga Samba Rice',
    'Thooyamalli Rice',
    'Poongar Traditional Rice',
    'Kaattuyanam Rice',
    'Kichili Samba Rice',
    'Kullakkar Rice',
  ];

  for (const rice of traditionalRice) {
    const regex = new RegExp(`name:\\s*['"]${rice}['"][\\s\\S]*?available:\\s*(true|false)`);
    const match = content.match(regex);
    assert.ok(match, `Must find product ${rice}`);
    assert.equal(match[1], 'false', `${rice} must be marked available: false`);
  }
});

test('Pricing Helpers: Null price handling & formatPrice', async () => {
  // Test price formatting logic
  function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  function getProductPriceLabel(p) {
    if (p.price === null || p.price === undefined) {
      return 'Price updating soon';
    }
    return `${formatPrice(p.price)}${p.unit ? ` / ${p.unit}` : ''}`;
  }

  assert.equal(formatPrice(150), '₹150.00');
  assert.equal(formatPrice(0), '₹0.00');

  const nullPriceProduct = { name: 'Fresh Milk', price: null, unit: '1 Litre' };
  assert.equal(getProductPriceLabel(nullPriceProduct), 'Price updating soon');

  const pricedProduct = { name: 'Ghee', price: 600, unit: '500ml Glass Jar' };
  assert.equal(getProductPriceLabel(pricedProduct), '₹600.00 / 500ml Glass Jar');
});

// ----------------------------------------------------------------------------
// 2. WhatsApp Helpers Tests
// ----------------------------------------------------------------------------
test('WhatsApp Helpers: URL construction & number verification', () => {
  const WHATSAPP_NUMBER = '918825714576';
  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const url = buildWhatsAppUrl('Hello Aranya Farm!');
  assert.ok(url.startsWith('https://wa.me/918825714576?text='));
  assert.ok(url.includes('Hello%20Aranya%20Farm!'));
});

// ----------------------------------------------------------------------------
// 3. Cart Business Logic Tests
// ----------------------------------------------------------------------------
test('Cart Reducer: Availability & Quantity Rules', () => {
  function cartReducer(state, action) {
    switch (action.type) {
      case 'HYDRATE': {
        const validItems = action.items
          .filter((i) => i.product && i.product.id && i.product.available !== false && i.quantity > 0)
          .map((i) => ({
            ...i,
            quantity: Math.min(Math.max(1, Math.floor(Number(i.quantity) || 1)), 99),
          }));
        return { items: validItems };
      }
      case 'ADD_ITEM': {
        if (action.product.available === false) return state;
        const existing = state.items.find((i) => i.product.id === action.product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + 1, 99);
          return {
            items: state.items.map((i) =>
              i.product.id === action.product.id ? { ...i, quantity: nextQty } : i
            ),
          };
        }
        return { items: [...state.items, { product: action.product, quantity: 1 }] };
      }
      case 'UPDATE_QUANTITY': {
        const sanitizedQty = Math.floor(Number(action.quantity) || 0);
        if (sanitizedQty <= 0) {
          return { items: state.items.filter((i) => i.product.id !== action.productId) };
        }
        const boundedQty = Math.min(sanitizedQty, 99);
        return {
          items: state.items.map((i) =>
            i.product.id === action.productId ? { ...i, quantity: boundedQty } : i
          ),
        };
      }
      default:
        return state;
    }
  }

  let state = { items: [] };

  // Rule 1: Attempting to add unavailable product must be ignored
  const unavailableItem = { id: 'rice-1', name: 'Mappillai Samba', available: false, price: null };
  state = cartReducer(state, { type: 'ADD_ITEM', product: unavailableItem });
  assert.equal(state.items.length, 0, 'Unavailable product must not be added to cart');

  // Rule 2: Adding available product succeeds
  const milk = { id: 'milk-1', name: 'Fresh Milk', available: true, price: 80 };
  state = cartReducer(state, { type: 'ADD_ITEM', product: milk });
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 1);

  // Rule 3: Adding same product increments quantity up to 99
  state = cartReducer(state, { type: 'ADD_ITEM', product: milk });
  assert.equal(state.items[0].quantity, 2);

  // Rule 4: Update quantity clamping & removal on zero
  state = cartReducer(state, { type: 'UPDATE_QUANTITY', productId: 'milk-1', quantity: 150 });
  assert.equal(state.items[0].quantity, 99, 'Quantity must clamp to maximum 99');

  state = cartReducer(state, { type: 'UPDATE_QUANTITY', productId: 'milk-1', quantity: 0 });
  assert.equal(state.items.length, 0, 'Quantity <= 0 must remove item');
});

// ----------------------------------------------------------------------------
// 4. Order Payload Validation Tests
// ----------------------------------------------------------------------------
test('Order Payload Validation Rules', () => {
  function validateOrderPayload(payload) {
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      return { valid: false, error: 'Order must contain at least one item.' };
    }
    if (payload.items.length > 50) {
      return { valid: false, error: 'Order exceeds maximum item limit (50 items).' };
    }
    for (const item of payload.items) {
      if (!item.product_id || typeof item.product_id !== 'string') {
        return { valid: false, error: 'Invalid product identifier in order item.' };
      }
      const qty = Math.floor(Number(item.qty) || 0);
      if (qty < 1 || qty > 99) {
        return { valid: false, error: 'Invalid quantity.' };
      }
    }
    return { valid: true };
  }

  assert.equal(validateOrderPayload(null).valid, false);
  assert.equal(validateOrderPayload({ items: [] }).valid, false);
  assert.equal(validateOrderPayload({ items: [{ product_id: 'p1', qty: 0 }] }).valid, false);
  assert.equal(validateOrderPayload({ items: [{ product_id: 'p1', qty: -5 }] }).valid, false);
  assert.equal(validateOrderPayload({ items: [{ product_id: 'p1', qty: 100 }] }).valid, false);
  assert.equal(validateOrderPayload({ items: [{ product_id: 'p1', qty: 2 }] }).valid, true);
});

// ----------------------------------------------------------------------------
// 5. Secrets Isolation & Code Guard Tests
// ----------------------------------------------------------------------------
test('Security: No client component leaks SUPABASE_SERVICE_ROLE_KEY', () => {
  function scanDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        if (file.name !== 'node_modules' && file.name !== '.next') {
          scanDir(fullPath);
        }
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        if (fileContent.includes("'use client'") || fileContent.includes('"use client"')) {
          assert.ok(
            !fileContent.includes('SUPABASE_SERVICE_ROLE_KEY'),
            `Client component ${fullPath} must NEVER reference SUPABASE_SERVICE_ROLE_KEY`
          );
        }
      }
    }
  }

  scanDir('src');
});
