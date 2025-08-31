"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

const CustomerPage = () => {
    const router = useRouter()

    return (
        <div className="min-h-screen w-full flex flex-col items-center">
            {/* HEADER */}
            <header className="w-full py-6 bg-black text-white text-center text-2xl font-bold tracking-wide mb-4 relative max-[750px]:flex max-[750px]:justify-between max-[750px]:px-6 max-[420px]:flex-col max-[420px]:gap-6 ">
                <button
                    onClick={() => router.push("/")}
                    className="absolute top-6 left-8 flex gap-1 p-2 rounded-none bg-transparent cursor-pointer max-[750px]:static max-[420px]:mx-auto"
                >
                    <FiArrowLeft className="text-white text-lg" />
                    <span className="text-white font-medium text-sm">На главную</span>
                </button>
                Покупателям
            </header>

            {/* УПАКОВКА */}
            <section
                id="packaging"
                className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-16 bg-white gap-12 mx-auto scroll-mt-50"
            >
                {/* Testo a sinistra */}
                <div className="flex-1 text-center md:text-left max-w-lg mx-auto md:mx-0">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                        Упаковка
                    </h2>
                    <hr className="border-gray-300 mb-6 w-24 mx-auto md:mx-0" />
                    <p className="text-lg mb-8 leading-relaxed text-black">
                        Все украшения упаковываются в фирменную упаковку.
                        В комплекте инструкции по уходу, салфетка, открытка и/или шоколад.
                    </p>
                    <Link
                        href="/#products"
                        className="inline-block px-6 py-3 bg-black text-white text-lg font-medium hover:bg-gray-800 transition rounded"
                    >
                        Перейти к товарам
                    </Link>
                </div>

                {/* Immagine a destra */}
                <div className="flex-shrink-0 flex justify-center md:justify-end">
                    <Image
                        src="/packaging.jpg"
                        alt="Упаковка"
                        width={350}
                        height={300}
                        className="w-full h-auto max-w-sm object-contain shadow-md"
                    />
                </div>
            </section>


            {/* ДОСТАВКА */}
            <section className="px-6 py-8 max-w-6xl mx-auto text-center scroll-mt-35 mb-10" id="delivery">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">Доставка</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">Яндекс Маркет</h3>
                        <div className="text-gray-700 text-[15px] space-y-3">
                            <div>
                                <div className="font-medium">По Москве:</div>
                                <div>3-4 дня от <strong>270₽</strong></div>
                            </div>
                            <div>
                                <div className="font-medium">По России:</div>
                                <div>4-8 дней от <strong>370₽</strong></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">Почта России</h3>
                        <div className="text-gray-700 text-[15px] space-y-3">
                            <div>
                                <div className="font-medium">По Москве:</div>
                                <div>1-3 дня от <strong>300₽</strong></div>
                            </div>
                            <div>
                                <div className="font-medium">По России:</div>
                                <div>3-10 дней от <strong>400₽</strong></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">СДЭК</h3>
                        <div className="text-gray-700 text-[15px] space-y-3">
                            <div>
                                <div className="font-medium">По Москве:</div>
                                <div>1-3 дня от <strong>300₽</strong></div>
                            </div>
                            <div>
                                <div className="font-medium">По России:</div>
                                <div>3-8 дней от <strong>400₽</strong></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">Курьер по Москве</h3>
                        <div className="text-gray-700 text-[15px] space-y-3">
                            <div className="text-center py-1">
                                <div className="text-lg font-bold">от 700₽</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                                Быстрая доставка до двери
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">Cамовывоз</h3>
                        <div className="text-gray-700 text-[15px] space-y-3">
                            <div className="text-center py-1">
                                <div className="font-medium">По договоренности!<br />Адрес доставки:</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                                Москва, Щелковское шоссе, дом 19
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ИНДИВИДУАЛЬНЫЕ ЗАКАЗЫ */}
            <section className="px-6 py-16 bg-gray-50 text-center w-full scroll-mt-35" id="custom-orders">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Индивидуальные заказы</h2>
                <hr className="border-gray-300 mb-6 w-20 mx-auto" />
                <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                    Мы готовы воплотить ваши идей в жизни. <br /> Для этого напишите нам в
                    мессенджеры и пришлите пожелания и фото украшения (если есть). <br />
                    Совместными усилиями создадим Ваше идеальное украшение.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="https://wa.me/79057612327" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition" >
                        <FaWhatsapp size={20} />
                        WhatsApp
                    </a>
                    <a href="https://t.me/likesvet" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-2xl shadow hover:bg-sky-600 transition" >
                        <FaTelegramPlane size={20} />
                        Telegram
                    </a>
                    <a href="https://www.instagram.com/likesvetshop/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-white rounded-2xl shadow hover:opacity-90 transition" >
                        <FaInstagram size={20} />
                        Instagram
                    </a>
                </div>
            </section>

            {/* СИСТЕМА ЛОЯЛЬНОСТИ */}
            <section className="px-6 py-16 max-w-6xl mx-auto text-center scroll-mt-20 mb-10" id="loyalty">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">Система лояльности</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Скидка 3%</h3>
                        <p className="text-gray-700">
                            При сумме заказов от 8.000₽. Суммы заказов суммируются для повышения уровня.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Скидка 5%</h3>
                        <p className="text-gray-700">
                            При сумме заказов от 12.000₽. Суммы заказов суммируются для повышения уровня.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Скидка 10%</h3>
                        <p className="text-gray-700">
                            При сумме заказов от 17.000₽. Суммы заказов суммируются для повышения уровня.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">День Рождения</h3>
                        <p className="text-gray-700">
                            Скидка 10% в День Рождения (скидка действует за 7 дней до и после
                            Дня Рождения)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerPage;