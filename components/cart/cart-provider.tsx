"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { CartItem, Product } from "@/lib/commerce/types";

const STORAGE_KEY = "betta-freaks-cart-v1";
const subscribeToHydration = () => () => undefined;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  hydrated: boolean;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addProduct = useCallback((product: Product) => {
    setItems((current) => {
      if (current.some((item) => item.productId === product.id)) {
        return current;
      }

      return [
        ...current,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          image: product.image,
          imageAlt: product.imageAlt,
          quantity: 1,
          isExactFish: product.isExactFish,
        },
      ];
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => {
      const visibleItems = hydrated ? items : [];
      return {
      items: visibleItems,
      itemCount: visibleItems.reduce((total, item) => total + item.quantity, 0),
      hydrated,
      addProduct,
      removeProduct,
      clearCart,
      };
    },
    [items, hydrated, addProduct, removeProduct, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return value;
};
