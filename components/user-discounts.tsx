// components/user-discount.tsx
"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { Order } from "@/types";

interface UserDiscountProps {
  orders: Order[];
}

const UserDiscount: React.FC<UserDiscountProps> = ({ orders }) => {
  const { user } = useAuth();

  const discount = useMemo(() => {
    if (!user) return 0;

    const today = new Date();
    const birthDate = new Date(user.birthDate);

    // Controllo compleanno
    const isBirthday =
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth();

    if (isBirthday) return 10;

    // Somma totale degli ordini
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    if (totalSpent >= 17000) return 10;
    if (totalSpent >= 12000) return 5;
    if (totalSpent >= 8000) return 3;
    return 0;
  }, [user, orders]);

  if (discount === 0) return null;

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-black text-white text-sm px-4 py-1 rounded-md min-w-max">
      Твоя скидка: {discount}%
    </div>
  );
};

export default UserDiscount;
