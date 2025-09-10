import { authFetch } from "@/lib/auth-fetch";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginPayload {
  identifier: string;
  password: string;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function registerUser(data: RegisterPayload) {
  const res = await authFetch(`${CMS_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data: LoginPayload) {
  const res = await authFetch(`${CMS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json();
}

export async function logoutUser() {
  const res = await authFetch(`${CMS_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Logout failed");
  }

  return res.json();
}
