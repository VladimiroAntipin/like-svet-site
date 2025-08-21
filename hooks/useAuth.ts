"use client";

import { useEffect, useState } from "react";
import { loginUser, registerUser } from "@/actions/auth";
import { getToken, removeToken, saveToken } from "@/lib/token";

interface User {
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await loginUser(credentials);
    if (res?.token) {
      saveToken(res.token);
      setUser({ token: res.token });
    }
    return res;
  };

  const register = async (data: { firstName: string; lastName: string; birthDate: string; email: string; password: string }) => {
    const res = await registerUser(data);
    if (res?.token) {
      saveToken(res.token);
      setUser({ token: res.token });
    }
    return res;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}