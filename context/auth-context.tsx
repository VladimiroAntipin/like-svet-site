/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginUser, registerUser, logoutUser } from "@/actions/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";
import { decodeJwt } from "jose";
import { toast } from "sonner";
import { authFetch } from "@/lib/auth-fetch";

// ---- User model ----
interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  profileImage?: string;
  balance?: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;
const REFRESH_THRESHOLD = 2 * 60; // 2 minuti prima della scadenza

// ---- Funzioni globali accessibili da authFetch ----
let refreshTokenFunc: (() => Promise<string | null>) | null = null;
let logoutFunc: (() => void) | null = null;

// Singleton per refresh token
let refreshingPromise: Promise<string | null> | null = null;

// Flag per prevenire logout multipli
let isLoggingOut = false;

export async function refreshTokenFromProvider() {
  if (refreshingPromise) return refreshingPromise; // evita refresh paralleli

  refreshingPromise = (async () => {
    if (!refreshTokenFunc) return null;
    try {
      const newToken = await refreshTokenFunc();
      return newToken;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

export function logoutFromProvider() {
  if (logoutFunc) logoutFunc();
}

// ---- Provider ----
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  let refreshTimeout: NodeJS.Timeout;

  // Multi-tab sync
  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");

    bc.onmessage = (e) => {
      if (e.data.type === "LOGOUT") handleLogout(false, false);
      if (e.data.type === "LOGIN" && e.data.token) fetchUser(e.data.token);
    };

    return () => bc.close();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUser(token);
    return () => clearTimeout(refreshTimeout);
  }, []);

  const scheduleRefresh = (token: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = decodeJwt(token);
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      const msUntilRefresh = (expiresIn - REFRESH_THRESHOLD) * 1000;

      if (msUntilRefresh <= 0) {
        refreshToken();
      } else {
        refreshTimeout = setTimeout(() => refreshToken(), msUntilRefresh);
      }
    } catch (err) {
      console.error("[SCHEDULE_REFRESH_ERROR]", err);
      handleLogout(true, false);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${CMS_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      if (data?.token && data.user) {
        saveToken(data.token);
        setUser({ token: data.token, ...data.user });
        scheduleRefresh(data.token);
        return data.token;
      } else {
        handleLogout(true, false);
        return null;
      }
    } catch (err) {
      console.error("[REFRESH_TOKEN_ERROR]", err);
      handleLogout(true, false);
      return null;
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await authFetch(`${CMS_URL}/auth/me`, { method: "GET", cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch user");

      const userData = await res.json();
      setUser({ token, ...userData });
      scheduleRefresh(token);
    } catch (err) {
      console.error("[FETCH_USER_ERROR]", err);
      handleLogout(false, false);
    } finally {
      setLoading(false);
    }
  };

  const login: AuthContextType["login"] = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      if (res?.token && res.user) {
        saveToken(res.token);
        setUser({ token: res.token, ...res.user });
        toast.success("Вы успешно вошли ✅");
        scheduleRefresh(res.token);

        new BroadcastChannel("auth_channel").postMessage({ type: "LOGIN", token: res.token });
      } else {
        toast.error("Неверный логин или пароль ❌");
      }
    } catch (err) {
      console.error("[LOGIN_ERROR]", err);
      toast.error("Неверный логин или пароль ❌");
    }
  };

  const register: AuthContextType["register"] = async (data) => {
    const res = await registerUser(data);
    if (res?.token && res.user) {
      saveToken(res.token);
      setUser({ token: res.token, ...res.user });
      toast.success("Регистрация успешна 🎉");
      scheduleRefresh(res.token);

      new BroadcastChannel("auth_channel").postMessage({ type: "LOGIN", token: res.token });
    }
  };

  /**
   * Logout globale
   * @param broadcast sync con altre tab
   * @param showToast mostra o no il messaggio
   */
  const handleLogout = async (broadcast = true, showToast = true) => {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
      await logoutUser();
    } catch (err) {
      console.error("[LOGOUT_ERROR]", err);
    } finally {
      removeToken();
      setUser(null);
      clearTimeout(refreshTimeout);

      if (broadcast) new BroadcastChannel("auth_channel").postMessage({ type: "LOGOUT" });
      if (showToast) toast.info("Вы вышли из аккаунта 👋");

      isLoggingOut = false;
    }
  };

  const updateUserBalance = (newBalance: number) => {
    setUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
  };

  // Espone le funzioni globali
  useEffect(() => {
    refreshTokenFunc = refreshToken;
    logoutFunc = handleLogout;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout: handleLogout, updateUserBalance }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}