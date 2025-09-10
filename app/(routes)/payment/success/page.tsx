'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, notFound } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import useCart from "@/hooks/use-cart";
import { purchaseGiftCode } from "@/actions/purchase-code";
import { authFetch } from "@/lib/auth-fetch";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PaymentSuccessPage = ({ onOrderComplete }: any) => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const removeAll = useCart((state) => state.removeAll);
  const hasProcessedRef = useRef(false);

  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const orderId = urlParams.get("orderId");

  useEffect(() => {
    const confirmPayment = async () => {
      if (hasProcessedRef.current || !user || !user.token) return;
      hasProcessedRef.current = true;
      setIsSubmitting(true);

      try {
        // --- Marca l’ordine come pagato
        await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: "PATCH",
          body: JSON.stringify({ isPaid: true }),
          headers: { "Content-Type": "application/json" },
        });

        toast.success("✅ Заказ успешно оплачен!");
        removeAll();

        // --- Recupera i dettagli dell’ordine
        const orderRes = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
        const orderData = (await orderRes.json()) as { orderItems?: any[] };

        const giftCardItems = orderData.orderItems?.filter(
          (item) => item.giftCardAmount && item.giftCardAmount > 0
        ) || [];

        if (giftCardItems.length > 0) {
          await Promise.all(
            giftCardItems.map(async (item) => {
              const amount = (item.giftCardAmount || 0) * 100;
              try {
                await purchaseGiftCode(amount, item.id, user.token);
              } catch {
                toast.error("⚠️ Ошибка при создании подарочного сертификата");
              }
            })
          );
          toast.success("🎁 Подарочный сертификат создан!");
        }

        // --- Pulizia sessionStorage
        sessionStorage.removeItem("currentOrder");
        sessionStorage.removeItem("fromCheckout");

        if (onOrderComplete) onOrderComplete();
      } catch (err) {
        console.error("[CONFIRM_PAYMENT_ERROR]", err);
        toast.error("❌ Ошибка при подтверждении оплаты.");
        router.push("/");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!loading) confirmPayment();
  }, [user, loading, router, removeAll, onOrderComplete, orderId]);

  if (!orderId) return notFound();

  // --- Loader finché non finisce la richiesta
  if (loading || isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Подождите, идет обработка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[90%] max-w-md text-center flex flex-col items-center justify-center gap-6 h-[460px] mt-[-200px]">
        <div className="text-7xl text-green-500">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900">Оплата прошла успешно</h1>
        <p className="text-gray-600 text-lg">
          Ваш заказ был успешно оплачен.<br />
          Спасибо, что выбрали наш магазин!
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Все детали заказа и ваши промокоды доступны в <strong>мой профиль → мой заказы</strong>.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all duration-200"
          disabled={isSubmitting}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
