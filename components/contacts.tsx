"use client";

import { FaWhatsapp, FaTelegramPlane, FaInstagram } from "react-icons/fa";

const Contacts = () => {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto text-center px-4">
        {/* Titolo */}
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Контакты
        </h2>

        {/* Bottoni */}
        <div className="flex max-[500px]:flex-col justify-center gap-8">
          <a
            href="https://wa.me/79057612327"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
          >
            <FaWhatsapp size={20} />
            WhatsApp
          </a>

          <a
            href="https://t.me/likesvet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-2xl shadow hover:bg-sky-600 transition"
          >
            <FaTelegramPlane size={20} />
            Telegram
          </a>

          <a
            href="https://www.instagram.com/likesvetshop/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-white rounded-2xl shadow hover:opacity-90 transition"
          >
            <FaInstagram size={20} />
            Instagram
          </a>
        </div>
        <p className="font-bold text-xs text-gray-400 mt-4">Соцсеть Instagram принадлежит компании Meta, признанной экстремистской в РФ</p>
      </div>
    </section>
  );
};

export default Contacts;