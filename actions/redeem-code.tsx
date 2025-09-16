import { authFetch } from "@/lib/auth-fetch";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function redeemPromoCode(code: string) {
  const res = await authFetch(`${CMS_URL}/gift-codes/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Нет такого промокода");
  }

  return res.json();
}
