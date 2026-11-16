"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const emptyCart = { items: [], itemCount: 0, total: 0 };

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) { setCart(emptyCart); return emptyCart; }
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data.data);
      return response.data.data;
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (user) refreshCart().catch(() => setCart(emptyCart));
    else setCart(emptyCart);
  }, [user, refreshCart]);

  const addItem = useCallback(async (bookId, quantity = 1) => {
    const response = await api.post("/cart/items", { bookId, quantity });
    setCart(response.data.data);
    return response.data.data;
  }, []);
  const updateItem = useCallback(async (itemId, quantity) => {
    const response = await api.patch(`/cart/items/${itemId}`, { quantity });
    setCart(response.data.data);
  }, []);
  const removeItem = useCallback(async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    setCart(response.data.data);
  }, []);

  const value = useMemo(() => ({ cart, loading, refreshCart, addItem, updateItem, removeItem }), [cart, loading, refreshCart, addItem, updateItem, removeItem]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}