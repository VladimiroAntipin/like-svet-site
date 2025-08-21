"use client";

import { useEffect, useState } from "react";
import { loginUser, registerUser } from "@/actions/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  profileImage?: string;
  balance?: number;
  token: string;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera i dati dell'utente se c'è un token
  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${CMS_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const userData = await res.json();
      setUser({ token, ...userData });
    } catch (err) {
      console.error(err);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (credentials: { email: string; password: string }) => {
    const res = await loginUser(credentials);
    if (res?.token && res.user) {
      saveToken(res.token);
      setUser({ token: res.token, ...res.user });
    }
    return res;
  };

  // Register
  const register = async (data: { firstName: string; lastName: string; birthDate: string; email: string; password: string }) => {
    const res = await registerUser(data);
    if (res?.token && res.user) {
      saveToken(res.token);
      setUser({ token: res.token, ...res.user });
    }
    return res;
  };

  // Logout
  const logout = () => {
    removeToken();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
