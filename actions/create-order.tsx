"use server";

interface OrderItem {
  id: string; // productId
}

interface OrderPayload {
  items: OrderItem[];
  region: string;
  address: string;
  totalPrice: number;
  shippingMethod: string;
}

const CMS_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createOrder(data: OrderPayload, token: string) {
  const res = await fetch(`${CMS_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // 👈 aggiunto
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}