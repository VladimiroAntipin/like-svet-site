"use client";

import Image from "next/image";
import { X } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem as CartItemType } from "@/hooks/use-cart";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CartItemProps {
  data: CartItemType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CartItem: React.FC<any> = ({ data }: any) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const imageUrl = data.product.images?.[0]?.url || "/placeholder.png";

  return (
    <li className="flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm">
      {/* Immagine prodotto */}
      <div className="relative h-24 w-24 max-[450px]:h-18 max-[450px]:w-18 rounded-md overflow-hidden flex-shrink-0">
        <Image
          fill
          src={imageUrl}
          alt={data.product.name}
          className="object-cover object-center"
          sizes="(max-width: 450px) 72px, 96px"
        />
      </div>

      {/* Info prodotto */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-lg font-bold text-black max-[450px]:text-sm">{data.product.name}</p>
        <div className="mt-1 text-sm max-[450px]:text-xs text-gray-600 space-y-1">
          <p>{data.product.category.name}</p>

          {data.product.isGiftCard ? (
            <>
              <p>Сумма: {data.giftCardAmount} ₽</p>
              <p>Тип: {data.giftCardType}</p>
            </>
          ) : (
            <>
              <p>{data.selectedSize?.value}</p>
              <p className="flex items-center gap-2">{data.selectedColor?.name}
                <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: data.selectedColor?.value }} />
              </p>
            </>
          )}
        </div>
      </div>

      {/* Prezzo e rimuovi accanto */}
      <div className="flex items-center justify-between gap-12 max-[500px]:gap-6 max-[450px]:text-sm">
        <Currency data={data.product.isGiftCard ? (data.giftCardAmount || 0) * 100 : data.product.price} />
        <IconButton
          onClick={onRemove}
          icon={<X size={16} />}
          aria-label="Rimuovi prodotto"
          className="cursor-pointer"
        />
      </div>
    </li>
  );
};

export default CartItem;