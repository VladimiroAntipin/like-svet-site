import { getToken } from "@/lib/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
}

export interface OrderItem {
  id: string;
  createdAt: string;
  totalAmount: number;
  products: OrderProduct[];
}

export async function getUserOrders(): Promise<OrderItem[]> {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API_URL}/orders-by-client`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Ошибка при получении заказов");

  const data = await res.json();

  // Convertiamo eventuali price in number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: OrderItem[] = data.map((order: any) => ({
    id: order.id,
    createdAt: order.createdAt,
    totalAmount: Number(order.totalAmount),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: order.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      images: p.images,
      category: p.category,
    })),
  }));

  return orders;
}

