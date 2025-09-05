"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkFromCheckout = async () => {
      try {
        const fromCheckout = sessionStorage.getItem("fromCheckout");
        if (!fromCheckout) {
          setChecking(false);
          return;
        }

        const orderData = JSON.parse(sessionStorage.getItem("currentOrder") || "{}");
        if (orderData.orderId) {
          const failUrl = `/payment/fail?orderId=${orderData.orderId}&amount=${orderData.amount}&email=${encodeURIComponent(orderData.email)}&usedBalance=${orderData.usedBalance}&isPaid=false`;

          // 🔹 Se c’era balance usato → mostra log
          if (orderData.usedBalance && orderData.usedBalance > 0) {
            toast.info(`💰 Вам возвращено ${orderData.usedBalance / 100}₽ на баланс`);
          }

          router.replace(failUrl);
        }
      } catch (err) {
        console.error("Error on checkout guard:", err);
      } finally {
        // 🔹 Pulizia sempre, sia in caso di successo che errore
        sessionStorage.removeItem("fromCheckout");
        sessionStorage.removeItem("currentOrder");
        setChecking(false);
      }
    };

    checkFromCheckout();
  }, [router]);

  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "6px solid #ccc",
            borderTop: "6px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ fontSize: "18px", color: "#333" }}>Загрузка…</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}