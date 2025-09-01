"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import useCart from "@/hooks/use-cart";

export default function PaymentCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const removeAll = useCart((state) => state.removeAll);

    useEffect(() => {
        const checkPayment = async () => {
            const orderId = searchParams.get("orderId");
            if (!orderId) return;

            // Recupera i dati dell'ordine salvati prima del pagamento
            const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
            if (!pendingOrder || !user?.token) {
                toast.error("❌ Данные заказа не найдены");
                router.push("/cart");
                return;
            }

            try {
                // Controlla lo stato del pagamento dal tuo backend/banca
                const res = await fetch("/api/payment/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                });

                const data = await res.json();

                if (data.orderStatus === 2) {
                    // ✅ Pagamento riuscito → crea ordine nel DB con isPaid: true
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                        {
                            ...pendingOrder,
                            isPaid: true,
                        },
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );

                    toast.success("✅ Оплата прошла успешно, заказ создан");
                    removeAll();
                    localStorage.removeItem("pendingOrder");
                    router.push("/orders");
                } else {
                    // ❌ Pagamento fallito
                    toast.error("❌ Оплата не прошла");
                    router.push("/cart");
                }
            } catch (err) {
                console.error(err);
                toast.error("⚠️ Ошибка при проверке оплаты");
                router.push("/cart");
            }
        };

        checkPayment();
    }, [searchParams, router, user, removeAll]);

    return <p>Проверка оплаты...</p>;
}