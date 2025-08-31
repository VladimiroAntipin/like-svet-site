// actions/auth.ts
"use server";

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

async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function registerUser(data: RegisterPayload) {
  const res = await fetch(`${CMS_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await parseResponse(res);

  if (!res.ok) {
    throw new Error(json.message || "Ошибка регистрации");
  }

  return json;
}

export async function loginUser(data: LoginPayload) {
  const res = await fetch(`${CMS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await parseResponse(res);

  if (!res.ok) {
    throw new Error(json.message || "Ошибка авторизации");
  }

  return json;
}
