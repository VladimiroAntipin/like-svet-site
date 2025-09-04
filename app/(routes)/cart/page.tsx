"use client";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CartPage = () => {
    const cart = useCart();
    const router = useRouter();

    const goHome = () => router.push("/");

    return (
        <div className="bg-white min-h-screen">
            <Container>
                <div className="px-4 pt-5 pb-16 sm:px-6 lg:px-8 max-[500px]:px-0 h-full">
                        <div className="lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                            <div className="lg:col-span-7">
                                <h1 className="text-3xl font-bold text-black mb-6">Корзина</h1>
                                {cart.items.length === 0 ? (
                                    <div className="flex flex-col items-start gap-4">
                                        <p className="text-neutral-500">Нет товаров в корзине</p>
                                        <Button
                                            onClick={goHome}
                                            className="bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition mt-6 font-thin flex items-center gap-3"
                                        >
                                            <ArrowLeft size={16}/>
                                            На главную
                                        </Button>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {cart.items.map((item) => (
                                            <CartItem key={item.id} data={item} />
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {cart.items.length > 0 && (
                                <div className="lg:col-span-5 mt-10 lg:mt-0">
                                    <Summary />
                                </div>
                            )}
                        </div>
                </div>
            </Container>
        </div>
    );
};

export default CartPage;
