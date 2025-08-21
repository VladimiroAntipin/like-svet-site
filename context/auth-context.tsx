"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginUser, registerUser } from "@/actions/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";

interface AuthContextType {
  user: { token: string } | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { firstName: string; lastName: string; birthDate: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login: AuthContextType["login"] = async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.token) {
      saveToken(res.token);
      setUser({ token: res.token });
    }
  };

  const register: AuthContextType["register"] = async (data) => {
    const res = await registerUser(data);
    if (res?.token) {
      saveToken(res.token);
      setUser({ token: res.token });
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}