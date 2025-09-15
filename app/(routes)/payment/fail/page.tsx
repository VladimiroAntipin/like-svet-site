'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { authFetch } from "@/lib/auth-fetch";

export const dynamic = 'force-dynamic'

const PaymentFailPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  // 🔹 Prendi orderId lato client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("orderId"));
  }, []);

  // 🔹 Effettua undo-order
  useEffect(() => {
    if (!user || !orderId) return;

    const handleFail = async () => {
      try {
        await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/undo-order`, {
          method: "POST",
          body: JSON.stringify({ orderId }),
        });

        sessionStorage.removeItem("currentOrder");
        sessionStorage.removeItem("fromCheckout");

        toast.error("❌ Платеж не выполнен. Заказ отменён.");
      } catch (err) {
        console.error("Error undoing order:", err);
        toast.error("⚠️ Ошибка при обработке платежа. Попробуйте снова.");
      } finally {
        setIsProcessing(false);
      }
    };

    handleFail();
  }, [user, orderId]);

  // 🔹 Loader finché non abbiamo orderId o richiesta in corso
  if (!orderId || isProcessing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Обработка заказа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[90%] max-w-md text-center flex flex-col items-center justify-center gap-6 mt-[50px] h-[460px]">
        <div className="text-7xl text-red-600">❌</div>
        <h1 className="text-3xl font-bold text-gray-900">Ошибка оплаты</h1>
        <p className="text-gray-600 text-lg">
          К сожалению, платеж не был выполнен. Попробуйте ещё раз или выберите другой способ оплаты.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all duration-200 cursor-pointer"
          disabled={isProcessing}
        >
          Вернуться в магазин
        </button>
      </div>
    </div>
  );
};

export default PaymentFailPage;
