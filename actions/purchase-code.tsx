import { authFetch } from "@/lib/auth-fetch";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function purchaseGiftCode(
  amount: number,
  orderItemId: string,
  expiresAt?: string
) {
  const res = await authFetch(`${CMS_URL}/gift-codes/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, orderItemId, expiresAt }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка при покупке сертификата");
  }

  return res.json();
}
