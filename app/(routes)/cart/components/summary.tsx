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
import { purchaseGiftCode } from "@/actions/purchase-code";

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
    const [extraInfoError, setExtraInfoError] = useState("");
    const [regionError, setRegionError] = useState("");
    const [addressError, setAddressError] = useState("");
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

    // Verifica se ci sono solo gift card elettroniche nel carrello
    const onlyElectronicGiftCards = items.length > 0 &&
        items.every(item =>
            item.product.isGiftCard &&
            item.giftCardType === "электронный"
        );

    const itemsTotal = items.reduce((total, item) => {
        if (item.product.isGiftCard) return total + ((item.giftCardAmount || 0) * 100);
        return total + Number(item.product.price);
    }, 0);

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
        else if (name === "электронный")
            price = 0;

        if (["СДЭК", "Яндекс Маркет", "Почта России"].includes(name)) {
            const blocks = Math.floor(items.length / 5);
            price += blocks * 10000;
        }

        return price;
    };

    // Opzioni di spedizione standard
    const standardShippingOptions: ShippingOption[] = [
        { name: "СДЭК", price: getShippingPrice("СДЭК") },
        { name: "Яндекс Маркет", price: getShippingPrice("Яндекс Маркет") },
        { name: "Почта России", price: getShippingPrice("Почта России") },
        { name: "Курьер", price: getShippingPrice("Курьер") },
        { name: "Самовывоз", price: 0 },
        { name: "Международная доставка", price: getShippingPrice("Международная доставка") }
    ];

    // Opzioni di spedizione solo per gift card elettroniche
    const electronicShippingOptions: ShippingOption[] = [
        { name: "электронный", price: 0 }
    ];

    // Seleziona le opzioni di spedizione in base al contenuto del carrello
    const shippingOptions = onlyElectronicGiftCards ? electronicShippingOptions : standardShippingOptions;

    // Gestione del cambio automatico della consegna
    useEffect(() => {
        // Se ci sono solo gift card elettroniche e non è già selezionata la consegna elettronica
        if (onlyElectronicGiftCards && selectedShipping?.name !== "электронный") {
            setSelectedShipping(electronicShippingOptions[0]);
            // Reset dei campi per la nuova modalità di consegna
            setRegion("");
            setAddress("");
            setApartment("");
            setFloor("");
            setEntrance("");
            setExtraInfo("");
            setExtraInfoError("");
            setRegionError("");
            setAddressError("");
        }
        // Se NON ci sono solo gift card elettroniche ma è selezionata la consegna elettronica
        else if (!onlyElectronicGiftCards && selectedShipping?.name === "электронный") {
            setSelectedShipping(null);
            // Reset dei campi
            setRegion("");
            setAddress("");
            setApartment("");
            setFloor("");
            setEntrance("");
            setExtraInfo("");
            setExtraInfoError("");
            setRegionError("");
            setAddressError("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onlyElectronicGiftCards, items]); // Aggiunto items come dipendenza

    // Validazione per Курьер
    const validateCourierDate = (value: string): boolean => {
        const regex = /^\d{2}[\/.-]\d{2}[\/.-]\d{2,4}\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
        return regex.test(value.trim());
    };

    // Validazione per Почта России
    const validatePostIndex = (value: string): boolean => {
        const indexRegex = /\b\d{6}\b/;
        const hasCity = value.replace(indexRegex, "").trim().length > 0;
        return indexRegex.test(value) && hasCity;
    };

    // Validazione per Международная доставка
    const validateInternational = (value: string): boolean => {
        const parts = value.split(',').map(part => part.trim());
        return parts.length >= 2 && parts[0].length > 0 && parts[1].length > 0;
    };

    // Validazione per СДЭК / Яндекс Маркет
    const validateDeliveryPoint = (regionValue: string, addressValue: string): boolean => {
        return regionValue.trim().length > 0 && addressValue.trim().length > 0;
    };

    // Validazione email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    // Validazione telefono (deve contenere codice paese come +7 e numero)
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\+[1-9]\d{1,14}$/; // Formato E.164 internazionale
        return phoneRegex.test(phone.trim());
    };

    // Validazione per электронный (email o telefono)
    const validateElectronic = (email: string, phone: string): boolean => {
        const hasEmail = email.trim().length > 0;
        const hasPhone = phone.trim().length > 0;

        if (hasEmail && !validateEmail(email)) return false;
        if (hasPhone && !validatePhone(phone)) return false;

        return hasEmail || hasPhone;
    };

    const handleRegionBlur = () => {
        if (selectedShipping) {
            setSelectedShipping({
                ...selectedShipping,
                price: getShippingPrice(selectedShipping.name),
            });
        }
        setShowShippingPrice(true);

        // Validazioni specifiche per ogni metodo di spedizione
        if (selectedShipping?.name === "Курьер") {
            const city = normalize(region);
            const available = city.includes("москва") || moscowOutsideMKAD.some(loc => city.includes(normalize(loc)));
            setInvalidCourier(!available);

            // Validazione extraInfo per Курьер
            if (!validateCourierDate(extraInfo)) {
                setExtraInfoError("Укажите корректную дату и интервал (dd/mm/yy hh:mm-hh:mm)");
            } else {
                setExtraInfoError("");
            }
        } else {
            setInvalidCourier(false);
        }

        // Validazione Почта России
        if (selectedShipping?.name === "Почта России") {
            if (!validatePostIndex(region)) {
                setRegionError("Укажите город и индекс из 6 цифр");
            } else {
                setRegionError("");
            }
        } else {
            setRegionError("");
        }

        // Validazione Международная доставка
        if (selectedShipping?.name === "Международная доставка") {
            if (!validateInternational(region)) {
                setRegionError("Укажите страну и город через запятую (например: Germany, Berlin)");
            } else {
                setRegionError("");
            }
        }

        // Validazione СДЭК / Яндекс Маркет
        if (selectedShipping?.name === "СДЭК" || selectedShipping?.name === "Яндекс Маркет") {
            if (!validateDeliveryPoint(region, address)) {
                setRegionError(region.trim() === "" ? "Укажите регион" : "");
                setAddressError(address.trim() === "" ? "Укажите адрес" : "");
            } else {
                setRegionError("");
                setAddressError("");
            }
        }

        // Validazione электронный
        if (selectedShipping?.name === "электронный") {
            const hasEmail = region.trim().length > 0;
            const hasPhone = address.trim().length > 0;

            if (!validateElectronic(region, address)) {
                if (hasEmail && !validateEmail(region)) {
                    setRegionError("Укажите корректный email");
                } else if (hasPhone && !validatePhone(address)) {
                    setAddressError("Укажите телефон в формате +7XXXXXXXXXX");
                } else {
                    setRegionError("Укажите email или телефон");
                }
            } else {
                setRegionError("");
                setAddressError("");
            }
        }
    };

    const handleAddressBlur = () => {
        // Validazione СДЭК / Яндекс Маркет
        if (selectedShipping?.name === "СДЭК" || selectedShipping?.name === "Яндекс Маркет") {
            if (address.trim() === "") {
                setAddressError("Укажите адрес");
            } else {
                setAddressError("");
            }
        }

        // Validazione электронный
        if (selectedShipping?.name === "электронный") {
            const hasEmail = region.trim().length > 0;
            const hasPhone = address.trim().length > 0;

            if (!validateElectronic(region, address)) {
                if (hasEmail && !validateEmail(region)) {
                    setRegionError("Укажите корректный email");
                } else if (hasPhone && !validatePhone(address)) {
                    setAddressError("Укажите телефон в формате +7XXXXXXXXXX");
                } else {
                    setAddressError("Укажите email или телефон");
                }
            } else {
                setRegionError("");
                setAddressError("");
            }
        }
    };

    const isCourier = selectedShipping?.name === "Курьер";
    const isSelfPickup = selectedShipping?.name === "Самовывоз";
    const isInternational = selectedShipping?.name === "Международная доставка";
    const isDeliveryPoint = selectedShipping?.name === "СДЭК" || selectedShipping?.name === "Яндекс Маркет";
    const isPostRussia = selectedShipping?.name === "Почта России";
    const isElectronic = selectedShipping?.name === "электронный";

    const isCheckoutDisabled = isSubmitting ||
        !selectedShipping ||
        (isSelfPickup ? false : !region.trim()) ||
        (isSelfPickup ? false : !address.trim()) ||
        (isCourier && (extraInfo.trim() === "" || invalidCourier || !!extraInfoError)) ||
        (isElectronic && !validateElectronic(region, address)) ||
        !!regionError ||
        !!addressError ||
        (isInternational && !validateInternational(region)) ||
        (isPostRussia && !validatePostIndex(region)) ||
        ((isDeliveryPoint || isPostRussia) && !address.trim());

    const onCheckout = async () => {
        if (!user) {
            toast.error("❌ Необходимо авторизоваться");
            router.push("/auth");
            return;
        }
        if (!selectedShipping) {
            toast.error("Выберите способ доставки");
            return;
        }
        if (isCheckoutDisabled) {
            toast.error("Проверьте правильность заполнения всех полей");
            return;
        }

        try {
            setIsSubmitting(true);

            const giftCardItems = items.filter(item => item.product.isGiftCard);
            const giftCodeResults = await Promise.all(
                giftCardItems.map(async (item) => {
                    const res = await purchaseGiftCode((item.giftCardAmount || 0) * 100, user.token);
                    return { itemId: item.id, giftCodeId: res.giftCode.id };
                })
            );

            const orderItems = items.map(item => {
                if (item.product.isGiftCard) {
                    const giftCode = giftCodeResults.find(gc => gc.itemId === item.id);
                    return {
                        productId: item.product.id,
                        quantity: Number(item.quantity) || 1,
                        giftCardAmount: item.giftCardAmount,
                        giftCardType: item.giftCardType,
                        giftCodeId: giftCode?.giftCodeId,
                    };
                }
                return {
                    productId: item.product.id,
                    sizeId: item.selectedSize?.id,
                    colorId: item.selectedColor?.id,
                    quantity: Number(item.quantity) || 1
                };
            });

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                {
                    items: orderItems,
                    shippingMethod: selectedShipping.name,
                    region,
                    address,
                    apartment,
                    floor,
                    entrance,
                    extraInfo,
                    totalPrice: itemsTotal - discountAmount + (selectedShipping ? selectedShipping.price : 0)
                },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            toast.success("✅ Заказ успешно оформлен!");
            removeAll();
            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error("❌ Ошибка при оформлении заказа. Попробуйте снова.");
        } finally {
            setIsSubmitting(false);
        }
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
                        <Button
                            className="w-full rounded-none border px-3 py-2 text-left mt-2"
                            ref={buttonRef}
                            disabled={onlyElectronicGiftCards}
                        >
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
                                                setApartment(""); setFloor(""); setEntrance(""); setExtraInfo(""); setExtraInfoError(""); setRegionError("");
                                            } else if (option.name === "электронный") {
                                                setRegion("");
                                                setAddress("");
                                                setApartment(""); setFloor(""); setEntrance(""); setExtraInfo(""); setExtraInfoError(""); setRegionError("");
                                            } else {
                                                setRegion(""); setAddress(""); setApartment(""); setFloor(""); setEntrance(""); setExtraInfo(""); setExtraInfoError(""); setRegionError("");
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
                {onlyElectronicGiftCards && (
                    <span className="text-xs text-gray-500 mt-1">
                        Для электронных подарочных карт доступна только электронная доставка
                    </span>
                )}
                {invalidCourier && <span className="text-red-600 mt-1 text-sm">Доставка Курьер недоступна в этом регионе, выберите другой способ</span>}
            </div>

            {/* Campi indirizzo */}
            {selectedShipping && !isSelfPickup && (
                <div className="flex flex-col mb-6">
                    <span className="mb-1 font-medium">
                        {isInternational ? "Страна и город" :
                            isElectronic ? "Контакты" :
                                "Город / Регион"}
                    </span>
                    <input
                        type="text"
                        value={region}
                        onChange={e => {
                            setRegion(e.target.value);
                            // Reset error when user starts typing
                            if (regionError) setRegionError("");
                        }}
                        onBlur={handleRegionBlur}
                        onFocus={() => setShowShippingPrice(false)}
                        placeholder={
                            isInternational ? "Germany, Berlin" :
                                isPostRussia ? "Москва, 101000" :
                                    isElectronic ? "Email (например: example@mail.ru)" :
                                        "г.Москва"
                        }
                        className={`border rounded-md px-3 py-2 mb-2 ${regionError ? "border-red-500" : ""}`}
                    />
                    {regionError && <span className="text-red-600 text-sm mb-2">{regionError}</span>}

                    <span className="mb-1 font-medium">
                        {isDeliveryPoint ? "Адрес пункт выдачи" :
                            isElectronic ? "Телефон" :
                                "Адрес доставки"}
                    </span>
                    <input
                        type="text"
                        value={address}
                        onChange={e => {
                            setAddress(e.target.value);
                            // Reset error when user starts typing
                            if (addressError) setAddressError("");
                        }}
                        onBlur={handleAddressBlur}
                        placeholder={
                            isDeliveryPoint ? "Введите адрес пункта выдачи" :
                                isElectronic ? "Телефон (например: +79123456789)" :
                                    "Введите адрес"
                        }
                        className={`border rounded-md px-3 py-2 mb-2 ${addressError ? "border-red-500" : ""}`}
                    />
                    {addressError && <span className="text-red-600 text-sm mb-2">{addressError}</span>}

                    {isElectronic && (
                        <span className="text-xs text-gray-500 mt-1">
                            Укажите email и телефон
                        </span>
                    )}

                    {/* Mostra solo per Kurier */}
                    {!isDeliveryPoint && !isSelfPickup && !isElectronic && (
                        <>
                            <div className="flex justify-between gap-2 mb-2 w-full">
                                <input type="text" value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Квартира" className="border rounded-md px-3 py-2 w-[30%]" />
                                <input type="text" value={floor} onChange={e => setFloor(e.target.value)} placeholder="Этаж" className="border rounded-md px-3 py-2 w-[30%]" />
                                <input type="text" value={entrance} onChange={e => setEntrance(e.target.value)} placeholder="Подъезд" className="border rounded-md px-3 py-2 w-[30%]" />
                            </div>
                            {isCourier && (
                                <>
                                    <input
                                        type="text"
                                        value={extraInfo}
                                        onChange={e => {
                                            setExtraInfo(e.target.value);
                                            if (!validateCourierDate(e.target.value)) {
                                                setExtraInfoError("Укажите корректную дату и интервал (dd/mm/yy hh:mm-hh:mm)");
                                            } else {
                                                setExtraInfoError("");
                                            }
                                        }}
                                        placeholder="дата и интервал доставки например: 01/01/25 10:00-13:00"
                                        className={`border rounded-md px-3 py-2 mb-2 ${extraInfoError ? "border-red-500" : ""}`}
                                    />
                                    {extraInfoError && <span className="text-red-600 text-sm mb-2">{extraInfoError}</span>}
                                </>
                            )}
                        </>
                    )}
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
                className={`w-full mt-2 rounded-none ${isCheckoutDisabled ? "bg-gray-400 cursor-auto text-gray-200" : "bg-black text-white"}`}
            >
                {isSubmitting ? "Оформление..." : "Оформить заказ"}
            </Button>
        </div>
    );
};

export default Summary;