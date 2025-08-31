/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // 🔹 importante se le chiami da componenti client

interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginPayload {
  identifier: string;  // email o phone
  password: string;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

// Funzione di utilità per leggere sempre JSON
async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || "Ошибка сервера" };
  }
}

export async function registerUser(data: RegisterPayload) {
  try {
    const res = await fetch(`${CMS_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const json = await parseResponse(res);

    if (!res.ok) {
      return { error: json.message || "Ошибка регистрации" };
    }

    return json;
  } catch (err: any) {
    return { error: err.message || "Ошибка регистрации" };
  }
}

export async function loginUser(data: LoginPayload) {
  try {
    const res = await fetch(`${CMS_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const json = await parseResponse(res);

    if (!res.ok) {
      return { error: json.message || "Ошибка авторизации" };
    }

    return json;
  } catch (err: any) {
    return { error: err.message || "Ошибка авторизации" };
  }
}
