"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "spirit-cart";

function getItemId(item) {
  return (
    item?.id ||
    `${item?.slug || item?.name || "product"}-${item?.selectedSize || "default"}`
  );
}

function normalizeItem(item) {
  return {
    ...item,
    id: getItemId(item),
    quantity: Math.max(1, Number(item?.quantity) || 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored;

    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    let parsed = null;

    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = null;
      }
    }

    /*
     * Hydrate from localStorage just after mount.
     * State updates are deferred out of the effect
     * body to avoid synchronous cascading renders
     * and to keep server and client output aligned.
     */
    const id = window.setTimeout(() => {
      setMounted(true);

      if (Array.isArray(parsed)) {
        setItems(parsed.map(normalizeItem));
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch {
      // Keep cart functional if storage is unavailable.
    }
  }, [items, mounted]);

  const addToCart = useCallback((item) => {
    if (!item) return;

    const normalized = normalizeItem(item);

    setItems((currentItems) => {
      const existingIndex =
        currentItems.findIndex(
          (currentItem) =>
            currentItem.id === normalized.id
        );

      if (existingIndex === -1) {
        return [
          ...currentItems,
          normalized,
        ];
      }

      return currentItems.map(
        (currentItem, index) =>
          index === existingIndex
            ? {
                ...currentItem,
                quantity:
                  currentItem.quantity +
                  normalized.quantity,
              }
            : currentItem
      );
    });

    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback(
    (item, quantity) => {
      const id = getItemId(item);
      const nextQuantity = Math.max(
        1,
        Number(quantity) || 1
      );

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                quantity: nextQuantity,
              }
            : currentItem
        )
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (item) => {
      const id = getItemId(item);

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) =>
            currentItem.id !== id
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((current) => !current);
  }, []);

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Math.max(
            1,
            Number(item.quantity) || 1
          ),
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price = Number(item.price);

        if (!Number.isFinite(price)) {
          return total;
        }

        return (
          total +
          price *
            Math.max(
              1,
              Number(item.quantity) || 1
            )
        );
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}