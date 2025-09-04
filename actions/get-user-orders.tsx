/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/lib/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface GiftPrice {
  id: string;
  value: number;
}

export interface OrderProduct {
  id: string;
  name: string;
  price: number; // in rubli
  images: { id: string; url: string }[];
  category: { id: string; name: string };
  giftPrices?: GiftPrice[]; 
  giftCardAmount?: number;
  giftCode?: string | null;
}

export interface OrderItem {
  id: string;
  createdAt: string;
  totalAmount: number; // in rubli
  region: string | null;
  address: string | null;
  apartment?: string | null;
  floor?: string | null;
  entrance?: string | null;
  extraInfo?: string | null;
  shippingMethod: string | null;
  products: OrderProduct[];
}

export async function getUserOrders(): Promise<OrderItem[]> {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API_URL}/orders-by-client`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка при получении заказов");
  }

  const data = await res.json();

  const orders: OrderItem[] = data.map((order: any) => ({
    id: order.id,
    createdAt: order.createdAt,
    totalAmount: Number(order.totalAmount),
    region: order.region ?? null,
    address: order.address ?? null,
    apartment: order.apartment ?? null,
    floor: order.floor ?? null,
    entrance: order.entrance ?? null,
    extraInfo: order.extraInfo ?? null,
    shippingMethod: order.shippingMethod ?? null,
    products: order.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.giftCardAmount ? Number(p.giftCardAmount) : Number(p.price),
      images: p.images,
      category: p.category,
      giftCardAmount: p.giftCardAmount,
      giftCode: p.giftCode ?? null,
    })),
  }));

  return orders;
}
