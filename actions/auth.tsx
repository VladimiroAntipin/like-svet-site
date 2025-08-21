"use server";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function registerUser(data: RegisterPayload) {
  const res = await fetch(`${CMS_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}

export async function loginUser(data: LoginPayload) {
  const res = await fetch(`${CMS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}