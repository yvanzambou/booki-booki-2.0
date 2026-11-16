"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "booki_booki_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const acceptSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => { setToken(null); setUser(null); };
    window.addEventListener("booki:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("booki:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) { setLoading(false); return; }
    setToken(savedToken);
    api.get("/auth/me", { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((response) => setUser(response.data.data))
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(null); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    acceptSession(response.data.data);
    return response.data.data.user;
  }, [acceptSession]);

  const register = useCallback(async (details) => {
    const response = await api.post("/auth/register", details);
    acceptSession(response.data.data);
    return response.data.data.user;
  }, [acceptSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(user), login, register, logout }), [user, token, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}