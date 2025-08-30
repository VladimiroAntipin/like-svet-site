/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types";
import { useFavorites } from "@/context/favorite-context";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GiftCertificatesProps {
  product: Product;
}

const GiftCertificatesPage: React.FC<any> = ({ product }: any) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [type, setType] = useState<"электронный" | "бланк">("электронный");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cart = useCart();
  const router = useRouter();

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const amounts = (product.giftPrices || []).map((gp: any) => ({
    ...gp,
    value: gp.value / 100,
  }));

  const handleAddToCart = () => {
    if (!amount) return toast.error("Выберите сумму сертификата");
    cart.addItem(product, undefined, undefined, amount, type);
  };

  const handleToggleFavorite = async () => {
    if (!user) return toast.error("Необходимо войти в аккаунт");
    try {
      await toggleFavorite(product);
      toast.success(
        isFavorite(product.id)
          ? "Сертификат удалён из избранного ❤️"
          : "Сертификат добавлен в избранное 💖"
      );
    } catch (err) {
      console.error(err);
      toast.error("Произошла ошибка, попробуйте снова ❌");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center md:items-start px-6 py-12 max-[500px]:py-6 gap-12 max-w-7xl mx-auto relative">

      {/* FOTO */}
      <div className="w-full md:w-1/2 flex flex-col justify-center ">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 p-2 rounded bg-transparent mb-10 cursor-pointer"
      >
        <FiArrowLeft className="text-gray-700 text-lg" />
        <span className="text-gray-700 font-medium text-medium">На главную</span>
      </button>
        <Image
          src={product.images?.[0]?.url || "/certificate.jpg"}
          alt={product.name || "Подарочный сертификат"}
          width={450}
          height={450}
          className="object-contain h-auto shadow-md"
        />
      </div>

      {/* CONTENUTO */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          {product.name || "ПОДАРОЧНЫЙ СЕРТИФИКАТ"}
        </h1>

        {/* Importi */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 max-w-lg mb-10 w-full">
          {amounts.map((price: any, index: any) => (
            <button
              key={price.id || index}
              onClick={() => setAmount(price.value)}
              className={`px-4 py-3 border text-gray-700 text-medium font-light transition cursor-pointer ${amount === price.value ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"
                }`}
            >
              {price.value.toLocaleString("ru-RU")} ₽
            </button>
          ))}
        </div>

        {/* Dropdown per tipo */}
        <div className="w-full max-w-md mb-10 relative" ref={dropdownRef}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            ВЫБЕРИТЕ ВАРИАНТ ИСПОЛНЕНИЯ
          </h2>

          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="w-full border px-3 py-2 bg-white flex items-center justify-between text-gray-700 font-light hover:bg-gray-100 focus:ring-2 focus:ring-black focus:outline-none cursor-pointer"
          >
            {type}
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${openDropdown ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-1 bg-white border shadow-md z-10 rounded cursor-pointer"
              >
                {["электронный", "бланк"].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setType(option as "электронный" | "бланк");
                      setOpenDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 font-light cursor-pointer"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottoni */}
        <div className="flex gap-x-4 mb-12 max-[770px]:flex-col max-[770px]:gap-3 max-[770px]:w-full">
          <button
            onClick={handleAddToCart}
            className="flex gap-x-4 items-center px-6 py-3 bg-black text-white text-lg font-light hover:bg-gray-800 transition cursor-pointer max-[770px]:justify-center"
          >
            В корзину
            <ShoppingBag />
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`flex gap-x-2 items-center px-4 py-3 border cursor-pointer max-[770px]:justify-center ${isFavorite(product.id) ? "text-red-500 border-red-500" : "text-gray-600 border-gray-300"
              }`}
          >
            <Heart className={isFavorite(product.id) ? "fill-red-500" : ""} />
            {isFavorite(product.id) ? "В избранном" : "В избранное"}
          </button>
        </div>

        {/* Testo informativo */}
        <div className="max-w-xl text-gray-700 leading-relaxed font-light text-[14px]">
          В нашем магазине Вы можете приобрести электронный сертификат любого
          номинала, срок его использования 365 дней. <br />
          Изготовим и отправим электронный сертификат в течение часа, после
          оплаты. <br />
          Также можем отправить Вам распечатанный сертификат Почтой России или
          СДЭК, доставка для этого варианта сертификата платная. <br />
          <span className="font-semibold text-[12px]">* Скидки по программе лояльности не распространяются на подарочные карты.</span>
        </div>
      </div>
    </div>
  );
};

export default GiftCertificatesPage;
