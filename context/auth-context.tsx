"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginUser, registerUser } from "@/actions/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";
import { toast } from "sonner";

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
  updateUserBalance: (newBalance: number) => void; // 👈 Aggiunta nuova funzione
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${CMS_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const userData = await res.json();
        setUser({ token, ...userData });
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login: AuthContextType["login"] = async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.token && res.user) {
      saveToken(res.token);
      setUser({ token: res.token, ...res.user });
      toast.success("Вы успешно вошли ✅");
    }
  };

  const register: AuthContextType["register"] = async (data) => {
    const res = await registerUser(data);
    if (res?.token && res.user) {
      saveToken(res.token);
      setUser({ token: res.token, ...res.user });
      toast.success("Регистрация успешна 🎉");
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.info("Вы вышли из аккаунта 👋");
  };

  // 👈 Nuova funzione per aggiornare il balance
  const updateUserBalance = (newBalance: number) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, balance: newBalance };
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUserBalance // 👈 Aggiunta al context
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}