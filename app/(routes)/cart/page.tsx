"use client";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";

const CartPage = () => {
    const cart = useCart();

    return (
        <div className="bg-white min-h-screen">
            <Container>
                <div className="px-4 pt-5 pb-16 sm:px-6 lg:px-8 max-[500px]:px-0 h-full">
                    <div className="lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                        {/* Blocco sinistro: titolo + cart items */}
                        <div className="lg:col-span-7">
                            <h1 className="text-3xl font-bold text-black mb-6">Корзина</h1>
                            {cart.items.length === 0 ? (
                                <p className="text-neutral-500">Нет товаров в корзине</p>
                            ) : (
                                <ul className="space-y-4">
                                    {cart.items.map((item) => (
                                        <CartItem key={item.id} data={item} />
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Blocco destro: summary (solo se ci sono prodotti) */}
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