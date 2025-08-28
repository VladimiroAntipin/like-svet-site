"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { AnimatePresence, motion } from "framer-motion";

interface ShippingOption {
    name: string;
    price: number;
}

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { user } = useAuth();
    const router = useRouter();

    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [region, setRegion] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [floor, setFloor] = useState("");
    const [entrance, setEntrance] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showShippingPrice, setShowShippingPrice] = useState(false);
    const [invalidCourier, setInvalidCourier] = useState(false);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Заказ оформлен");
            removeAll();
        }
        if (searchParams.get("canceled")) {
            toast.error("Что-то пошло не так");
        }
    }, [searchParams, removeAll]);

    const itemsTotal = items.reduce((total, item) => total + Number(item.product.price), 0);
    const userDiscount = 0.03;
    const discountAmount = Math.round(itemsTotal * userDiscount);

    const moscowOutsideMKAD = [
        "зеленоград", "северный район", "куркино", "новокосино", "косино-ухтомский",
        "митино", "внуково", "некрасовка", "солнцево", "ново-переделкино",
        "бачурино", "газопровод", "зимёнки", "коммунарка", "ларёво", "летово",
        "макарово", "николо-хованское", "прокшино", "сосенки", "столбово",
        "щербинка", "бабенки", "бакланово", "безобразово", "богоявление", "вороново",
        "клёново", "лукошкино", "маврино", "мешково", "никоново", "починки", "сальково",
        "свитино", "старогромово", "товарищево", "чегодаево", "чернецкое", "чириково", "юрово",
        "былово", "варварино", "городок", "колотилово", "красная пахра", "красное",
        "малыгино", "подосинки", "подсобного хозяйства минзаг", "поляны", "раево",
        "романцево", "софьино", "страдань", "шарапово", "шахово",
        "дешино", "дома отдыха «плесково»", "дровнино", "заболотье", "исаково",
        "конаково", "лужки", "михайловского лесничества", "михайловское", "новомихайловское",
        "пудово-сипягино", "секерино", "сенькино-секерино", "терехово", "шишкин лес", "ярцево",
        "алымовка", "архангельское", "белоусово", "голохвастово", "долгино", "зверево",
        "зосимова пустынь", "игнатово", "капустинка", "круги", "кузнецово", "лукино",
        "малеевка", "новиково", "ожигово", "пахо"
    ];

    const normalize = (str: string) => str.toLowerCase().replace(/[ё]/g, "е").trim();

    const getShippingPrice = (name: string): number => {
        const city = normalize(region);
        let price = 0;

        if (name === "СДЭК")
            price = city.includes("москва") || city.includes("московская область") || city.includes("м.о") ? 30000 : 40000;
        else if (name === "Яндекс Маркет")
            price = city.includes("москва") ? 27000 : 37000;
        else if (name === "Почта России")
            price = city.includes("москва") ? 30000 : 40000;
        else if (name === "Курьер")
            price = city.includes("москва")
                ? 70000
                : moscowOutsideMKAD.some(loc => city.includes(normalize(loc))) ? 110000 : 0;
        else if (name === "Самовывоз")
            price = 0;
        else if (name === "Международная доставка") {
            price = 160000;
            if (items.length >= 3) {
                price += 60000;
                const extraItems = items.length - 3;
                const extraBlocks = Math.floor(extraItems / 2);
                price += extraBlocks * 60000;
            }
        }

        if (["СДЭК", "Яндекс Маркет", "Почта России"].includes(name)) {
            const blocks = Math.floor(items.length / 5);
            price += blocks * 10000;
        }

        return price;
    };

    const shippingOptions: ShippingOption[] = [
        { name: "СДЭК", price: getShippingPrice("СДЭК") },
        { name: "Яндекс Маркет", price: getShippingPrice("Яндекс Маркет") },
        { name: "Почта России", price: getShippingPrice("Почта России") },
        { name: "Курьер", price: getShippingPrice("Курьер") },
        { name: "Самовывоз", price: 0 },
        { name: "Международная доставка", price: getShippingPrice("Международная доставка") }
    ];

    const handleRegionBlur = () => {
        if (selectedShipping) {
            setSelectedShipping({
                ...selectedShipping,
                price: getShippingPrice(selectedShipping.name),
            });
        }
        setShowShippingPrice(true);

        if (selectedShipping?.name === "Курьер") {
            const city = normalize(region);
            const available = city.includes("москва") || moscowOutsideMKAD.some(loc => city.includes(normalize(loc)));
            setInvalidCourier(!available);
        } else {
            setInvalidCourier(false);
        }
    };

    const isCourier = selectedShipping?.name === "Курьер";
    const isSelfPickup = selectedShipping?.name === "Самовывоз";
    const isInternational = selectedShipping?.name === "Международная доставка";
    const isCheckoutDisabled = isSubmitting || (isCourier && (extraInfo.trim() === "" || invalidCourier));

    const onCheckout = async () => {
        if (!user) { toast.error("❌ Необходимо авторизоваться"); router.push("/auth"); return; }
        if (!selectedShipping) { toast.error("Выберите способ доставки"); return; }
        if (selectedShipping.name !== "Самовывоз" && !isInternational && (!region.trim() || !address.trim())) {
            toast.error("Введите город / регион и адрес доставки"); return;
        }

        if (isCourier && extraInfo.trim() === "") {
            toast.error("❌ Укажите желаемый интервал доставки для Курьер");
            return;
        }

        const orderItems = items.map(item => ({
            productId: item.product.id,
            sizeId: item.selectedSize.id,
            colorId: item.selectedColor.id,
            quantity: Number(item.quantity) || 1
        }));

        try {
            setIsSubmitting(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                items: orderItems,
                shippingMethod: selectedShipping.name,
                region,
                address,
                apartment,
                floor,
                entrance,
                extraInfo,
                totalPrice: itemsTotal - discountAmount + (selectedShipping ? selectedShipping.price : 0)
            }, { headers: { Authorization: `Bearer ${user?.token}` } });

            toast.success("✅ Заказ успешно оформлен!");
            removeAll();
            router.push("/");
        } catch {
            toast.error("❌ Ошибка при оформлении заказа. Попробуйте снова.");
        } finally { setIsSubmitting(false); }
    };

    const effectiveShipping = selectedShipping && showShippingPrice ? selectedShipping.price : 0;
    const totalPrice = itemsTotal - discountAmount + effectiveShipping;

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-4 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">

            {/* Dropdown spedizione */}
            <div className="flex flex-col mb-4">
                <span className="mb-1 mt-2 font-medium">Выберите способ доставки:</span>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button className="w-full rounded-none border px-3 py-2 text-left mt-2" ref={buttonRef}>
                            <div className="flex justify-between w-full">
                                <span className="text-gray-900 text-base font-medium">
                                    {selectedShipping ? selectedShipping.name : "Служба доставки"}
                                </span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start" style={{ width: buttonRef.current?.offsetWidth }}>
                        <Command className="rounded-none border">
                            <CommandList>
                                {shippingOptions.map(option => (
                                    <CommandItem
                                        key={option.name}
                                        onSelect={() => {
                                            setSelectedShipping(option);
                                            setIsOpen(false);
                                            setShowShippingPrice(false);
                                            if (option.name === "Самовывоз") {
                                                setRegion("г.Москва");
                                                setAddress("105122, Щелковское шоссе, д.19");
                                                setApartment(""); setFloor(""); setEntrance("");
                                            } else {
                                                setRegion(""); setAddress(""); setApartment(""); setFloor(""); setEntrance(""); setExtraInfo("");
                                            }
                                            setInvalidCourier(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.name}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {invalidCourier && <span className="text-red-600 mt-1 text-sm">Доставка Курьер недоступна в этом регионе, выберите другой способ</span>}
            </div>

            {/* Campi indirizzo */}
            {selectedShipping && !isSelfPickup && (
                <div className="flex flex-col mb-6">
                    <span className="mb-1 font-medium">{isInternational ? "Страна и город" : "Город / Регион"}</span>
                    <input
                        type="text"
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        onBlur={handleRegionBlur}
                        onFocus={() => setShowShippingPrice(false)}
                        placeholder={isInternational ? "Germany, Berlin" : "Московская область / г.Москва, ..."}
                        className="border rounded-md px-3 py-2 mb-2"
                    />
                    <span className="mb-1 font-medium">Адрес доставки</span>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Введите адрес" className="border rounded-md px-3 py-2 mb-2" />
                    <div className="flex justify-between gap-2 mb-2 w-full">
                        <input type="text" value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Квартира" className="border rounded-md px-3 py-2 w-[30%]" />
                        <input type="text" value={floor} onChange={e => setFloor(e.target.value)} placeholder="Этаж" className="border rounded-md px-3 py-2 w-[30%]" />
                        <input type="text" value={entrance} onChange={e => setEntrance(e.target.value)} placeholder="Подъезд" className="border rounded-md px-3 py-2 w-[30%]" />
                    </div>
                    <input
                        type="text"
                        value={extraInfo}
                        onChange={e => setExtraInfo(e.target.value)}
                        placeholder={isCourier ? "Укажите желаемый интервал доставки" : "Доп. информация"}
                        className="border rounded-md px-3 py-2 mb-2"
                    />
                </div>
            )}

            {/* Campi Самовывоз */}
            {isSelfPickup && (
                <div className="flex flex-col mb-6">
                    <span className="mb-1 font-medium">Город / Регион</span>
                    <input type="text" value={region} readOnly className="border rounded-md px-3 py-2 mb-2 bg-gray-200" />
                    <span className="mb-1 font-medium">Адрес</span>
                    <input type="text" value={address} readOnly className="border rounded-md px-3 py-2 mb-2 bg-gray-200" />
                </div>
            )}

            {/* Costi */}
            <div className="flex justify-between mb-2">
                <span>Стоимость товаров</span>
                <Currency data={itemsTotal} />
            </div>

            <AnimatePresence>
                {selectedShipping && showShippingPrice && (
                    <motion.div className="flex justify-between mb-2" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}>
                        <span>Стоимость доставки</span>
                        <Currency data={selectedShipping.price} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between mb-2">
                <span>Твоя скидка</span>
                <span className="flex">-<Currency data={discountAmount} /></span>
            </div>

            <div className="flex justify-between font-semibold text-lg mb-4 border-t border-gray-200 pt-4">
                <span>Итого</span>
                <AnimatePresence mode="wait">
                    {selectedShipping && showShippingPrice ? (
                        <motion.div key={totalPrice} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}>
                            <Currency data={totalPrice} />
                        </motion.div>
                    ) : (
                        <motion.div key={totalPrice + "_hidden"} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}>
                            <Currency data={itemsTotal - discountAmount} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Button
                onClick={onCheckout}
                disabled={isCheckoutDisabled}
                className={`w-full mt-2 rounded-none ${isCheckoutDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"}`}
            >
                {isSubmitting ? "Оформление..." : "Оформить заказ"}
            </Button>

        </div>
    );
};

export default Summary;

