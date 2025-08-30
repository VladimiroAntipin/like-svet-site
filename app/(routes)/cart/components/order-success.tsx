"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OrderSuccessProps {
  onHome?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderSuccess: React.FC<any> = ({ onHome }) => {
  const router = useRouter();

  const goHome = () => {
    if (onHome) onHome();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-white border border-gray-200 shadow-sm rounded-2xl p-8 space-y-4 mt-16">
      <div className="text-4xl mb-2">🎉</div>
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Заказ успешно оформлен
      </h2>
      <p className="text-gray-600 text-center max-w-xs">
        Спасибо за ваш заказ! Вы можете вернуться на главную страницу и продолжить покупки.
      </p>
      <Button
        onClick={goHome}
        className="bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors duration-200 mt-6"
      >
        На главную
      </Button>
    </div>
  );
};

export default OrderSuccess;

