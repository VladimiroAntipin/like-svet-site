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
import Container from "@/components/ui/container";

interface OrderItem {
  id: string;
  createdAt: string;
  totalAmount: number;
  shippingMethod?: string | null;
  region?: string | null;
  address?: string | null;
  apartment?: string | null;
  floor?: string | null;
  entrance?: string | null;
  extraInfo?: string | null;
  products: {
    id: string;
    name: string;
    price: number;
    images: { id: string; url: string }[];
    category: { id: string; name: string };
    giftCardAmount?: number;
  }[];
}

const MyOrdersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

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
  }, [user, authLoading, router]);

  if (authLoading || loading) return <Loader />;

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
    <Container>
      <main className="p-4 flex flex-col gap-6 mb-16">
        {/* Bottone indietro */}
        <div className="flex items-center mb-4">
          <Link
            href="/account"
            className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold"
          >
            <ArrowLeft size={16} />
            Вернуться в профиль
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>

        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg shadow-sm bg-white flex flex-col">

            {/* Riga principale: prodotti + info ordine */}
            <div className="flex flex-row justify-between p-4 max-[895px]:flex-col max-[895px]:gap-4">

              {/* Prodotti */}
              <div className="flex flex-col gap-3 w-1/2 max-[895px]:w-full">
                {order.products.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex items-center gap-3 border rounded-md p-2 bg-gray-50"
                  >
                    <Image
                      src={product.images[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      width={60}
                      height={60}
                      style={{ width: "auto" }}
                      priority
                      className="object-cover rounded"
                    />
                    <div className="flex flex-col justify-center max-[895px]:gap-2">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category.name}</p>
                      {product.giftCardAmount && (
                        <span className="text-xs text-green-600">Gift Card</span>
                      )}
                      <Currency data={product.giftCardAmount ?? product.price} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Info ordine (senza indirizzo) */}
              <div className="flex flex-col gap-1 w-[30%] text-sm text-gray-700 text-right max-[895px]:w-full max-[895px]:text-left">
                <p><span className="font-semibold">Заказ от:</span> {new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                <p><span className="font-semibold">Способ доставки:</span> {order.shippingMethod ?? "Не указан"}</p>
              </div>

            </div>

            {/* Riga totale + indirizzo */}
            <div className="border-t p-4 flex justify-between items-center max-[895px]:flex-col max-[895px]:items-start max-[895px]:gap-5">
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Адрес доставки: <br /></span>
                  {order.region ?? "-"} {order.address ?? "-"}
                  {(order.apartment || order.floor || order.entrance) && <br />}
                </p>
                {(order.apartment || order.floor || order.entrance) && (
                  <p>
                    {order.apartment && <>кв: {order.apartment} </>}
                    {order.floor && <>этаж: {order.floor} </>}
                    {order.entrance && <>подъезд: {order.entrance}</>}
                  </p>
                )}
                {order.extraInfo && (
                  <>
                    <p><span className="font-semibold">Дополнительно:</span> {order.extraInfo}</p>
                  </>
                )}
              </div>
              <div className="text-xl font-bold flex gap-2">
                Итого: <Currency data={order.totalAmount} />
              </div>
            </div>

          </div>
        ))}
      </main>
    </Container>
  );
};

export default MyOrdersPage;
