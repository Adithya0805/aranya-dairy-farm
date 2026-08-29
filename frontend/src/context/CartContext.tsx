'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Product, formatPrice } from '@/lib/products';

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
    case 'HYDRATE':
      return { items: action.items };

    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
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
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
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
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const totalPriceLabel = formatPrice(totalPrice);

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
   * quantity, per-item price, and the grand total.
   */
  const buildWhatsAppMessage = useCallback((): string => {
    const lines: string[] = [
      '🛒 *New Order — Aranya Organic Dairy Farm*',
      '─────────────────────',
    ];
    state.items.forEach((item) => {
      const lineTotal = formatPrice(item.product.price * item.quantity);
      lines.push(
        `• ${item.product.name}\n  Qty: ${item.quantity} × ${item.product.priceLabel} = ${lineTotal}`
      );
    });
    lines.push('─────────────────────');
    lines.push(`*Total: ${formatPrice(totalPrice)}*`);
    lines.push('');
    lines.push('Please confirm my order and share delivery details. Thank you! 🙏');
    return lines.join('\n');
  }, [state.items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        totalPriceLabel,
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
