"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const GiftCertificatesPage = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const [type, setType] = useState<"электронный" | "бланк">("электронный");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const amounts = [
    1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 25000, 30000,
  ];

  const handleAddToCart = () => {
    if (!amount) return alert("Выберите сумму сертификата");
    console.log("Добавить в корзину:", { amount, type });
    alert(`Сертификат на ${amount}₽ (${type}) добавлен в корзину`);
  };

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center md:items-start px-6 py-12 gap-12 max-w-7xl mx-auto">
      {/* FOTO A SINISTRA */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/certificate.jpg"
          alt="Подарочный сертификат"
          width={500}
          height={500}
          className="object-contain h-auto shadow-md"
        />
      </div>

      {/* CONTENUTO A DESTRA */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        {/* Titolo */}
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          ПОДАРОЧНЫЙ СЕРТИФИКАТ
        </h1>

        {/* Importi */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-lg mb-10 w-full">
          {amounts.map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className={`px-4 py-3 border text-gray-700 text-lg font-light transition cursor-pointer ${
                amount === value
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {value.toLocaleString("ru-RU")} ₽
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
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openDropdown ? "rotate-180" : ""
              }`}
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
                <button
                  onClick={() => {
                    setType("электронный");
                    setOpenDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 font-light cursor-pointer"
                >
                  электронный
                </button>
                <button
                  onClick={() => {
                    setType("бланк");
                    setOpenDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 font-light cursor-pointer"
                >
                  бланк
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottone aggiungere al carrello */}
        <button
          onClick={handleAddToCart}
          className="flex gap-x-4 items-center px-6 py-3 bg-black text-white text-lg font-light hover:bg-gray-800 transition mb-12 cursor-pointer"
        >
          В корзину
          <ShoppingBag />
        </button>

        {/* Testo informativo */}
        <div className="max-w-xl text-gray-700 leading-relaxed font-light text-[14px]">
          В нашем магазине Вы можете приобрести электронный сертификат любого
          номинала, срок его использования 365 дней. <br />
          Изготовим и отправим электронный сертификат в течение часа, после
          оплаты. <br />
          Также можем отправить Вам распечатанный сертификат Почтой России или
          СДЭК, доставка для этого варианта сертификата платная.
        </div>
      </div>
    </div>
  );
};

export default GiftCertificatesPage;
