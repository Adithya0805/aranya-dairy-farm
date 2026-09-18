'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Product, formatPrice, getProductPriceLabel } from '@/lib/products';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
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
      // Hardening: strictly reject unavailable products from being added to the cart
      if (action.product.available === false) {
        return state;
      }
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, 99);
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: nextQty }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      };

    case 'UPDATE_QUANTITY': {
      const sanitizedQty = Math.floor(Number(action.quantity) || 0);
      if (sanitizedQty <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      const boundedQty = Math.min(sanitizedQty, 99);
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: boundedQty }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalPriceLabel: string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  buildWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'aranya_cart_v1';

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'HYDRATE', items: parsed });
        }
      }
    } catch {
      // ignore malformed stored data
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore (e.g. private mode storage quota)
    }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
    0
  );
  const hasPendingPrices = state.items.some((i) => i.product.price === null);
  const totalPriceLabel = hasPendingPrices && totalPrice === 0
    ? 'Price updating soon'
    : formatPrice(totalPrice);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  /**
   * Builds a human-readable WhatsApp order message listing each item,
   * quantity, per-item price (or updating status), and the grand total.
   */
  const buildWhatsAppMessage = useCallback((): string => {
    const lines: string[] = [
      '🛒 *New Order / Inquiry — Aranya Organic Dairy Farm*',
      '─────────────────────',
    ];
    state.items.forEach((item) => {
      const priceStr = getProductPriceLabel(item.product);
      const lineTotal = item.product.price !== null
        ? formatPrice(item.product.price * item.quantity)
        : 'Pricing to be confirmed';
      lines.push(
        `• ${item.product.name} (${item.product.nameTamil})\n  Qty: ${item.quantity} × ${priceStr} = ${lineTotal}`
      );
    });
    lines.push('─────────────────────');
    if (totalPrice > 0) {
      lines.push(`*Total: ${formatPrice(totalPrice)}*`);
    } else {
      lines.push('*Total: Final pricing to be shared on WhatsApp*');
    }
    lines.push('');
    lines.push('Please confirm item availability and delivery schedule. Thank you! 🙏');
    return lines.join('\n');
  }, [state.items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        totalPriceLabel,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        buildWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
