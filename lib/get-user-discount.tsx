import { OrderItem } from "@/actions/get-user-orders";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserDiscount = (user: any, orders: OrderItem[]) => {
  if (!user) return 0;

  const today = new Date();
  const birthDate = new Date(user.birthDate);

  // Calcolo data compleanno di quest'anno
  const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  // Differenza in giorni tra oggi e compleanno
  const diffTime = today.getTime() - thisYearBirthday.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Controllo compleanno ±7 giorni
  if (diffDays >= -7 && diffDays <= 7) return 10;

  // Somma totale degli ordini
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount) / 100,
    0
  );

  if (totalSpent >= 17000) return 10;
  if (totalSpent >= 12000) return 5;
  if (totalSpent >= 8000) return 3;
  return 0;
};
