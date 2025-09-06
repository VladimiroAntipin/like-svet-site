'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, notFound } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const PaymentFailPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasRun = useRef(false);

  // 🔹 Prendi orderId subito
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const orderId = urlParams.get("orderId");

  useEffect(() => {
    if (hasRun.current || !user) return;
    hasRun.current = true;

    const handleFail = async () => {
      try {
        if (!orderId) return;

        // --- Chiama la route /undo-order
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/undo-order`,
          { orderId },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        // --- Pulizia sessionStorage
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

  if (!orderId) {
    return notFound();
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