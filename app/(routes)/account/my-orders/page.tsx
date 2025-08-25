'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Image from "next/image";
import Currency from "@/components/ui/currency";
import { getUserOrders } from "@/actions/get-user-orders";

interface OrderItem {
  id: string;
  createdAt: string;
  totalAmount: number;
  products: {
    id: string;
    name: string;
    price: number;
    images: { id: string; url: string }[];
    category: { id: string; name: string };
  }[];
}

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      router.push("/auth");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (loading) return <Loader />;

  if (!orders.length) {
    return (
      <main className="flex flex-col gap-y-4 items-center justify-center h-screen text-center mt-[-200px]">
        <p className="text-lg md:text-xl text-gray-600">
          У вас пока нет заказов
        </p>
        <Button className="flex items-center gap-2 bg-black text-white font-thin rounded-none">
          <Link href="/account" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Вернуться в профиль
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded-md mb-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Заказ от:</span>
            <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {order.products.map((product) => (
              <div key={product.id} className="border p-2 rounded-md flex flex-col items-center">
                <Image
                  src={product.images[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover mb-2 rounded"
                />
                <p className="font-semibold text-center">{product.name}</p>
                <p className="text-sm text-gray-500 text-center">{product.category.name}</p>
                <Currency data={product.price} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end font-bold text-lg">
            Общая сумма: <Currency data={order.totalAmount} />
          </div>
        </div>
      ))}
    </main>
  );
};

export default MyOrdersPage;