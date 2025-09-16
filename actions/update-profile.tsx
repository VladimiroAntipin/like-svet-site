import { authFetch } from "@/lib/auth-fetch";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  birthDate?: string;
  profileImage?: string;
  balance?: number;
}

export async function updateCustomer(data: UpdateCustomerPayload) {
  const res = await authFetch(`${CMS_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ошибка при обновлении профиля");
  }

  return res.json();
}
