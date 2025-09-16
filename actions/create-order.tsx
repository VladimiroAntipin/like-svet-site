import { authFetch } from "@/lib/auth-fetch";

interface OrderItem {
  id: string; // productId
}

interface OrderPayload {
  items: OrderItem[];
  region: string;
  address: string;
  totalPrice: number;
  shippingMethod: string;
  isPaid?: boolean;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function createOrder(data: OrderPayload) {
  const res = await authFetch(`${CMS_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Order creation failed");
  }

  return res.json();
}