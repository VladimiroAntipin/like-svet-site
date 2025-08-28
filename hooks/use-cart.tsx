import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Size, Color } from "@/types";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  product: Product;
  selectedSize?: Size;
  selectedColor?: Color;
  quantity: number;
  giftCardAmount?: number; // importo della gift card
  giftCardType?: "электронный" | "бланк"; // tipo di consegna
}

interface CartStoreProps {
  items: CartItem[];
  addItem: (
    product: Product,
    size?: Size,
    color?: Color,
    giftCardAmount?: number,
    giftCardType?: "электронный" | "бланк"
  ) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStoreProps>(
    (set, get) => ({
      items: [],
      addItem: (product: Product, size?: Size, color?: Color, giftCardAmount?: number, giftCardType?: "электронный" | "бланк") => {
        const id = product.isGiftCard
          ? `${product.id}-${giftCardAmount}-${giftCardType}-${Date.now()}`
          : `${product.id}-${size?.id}-${color?.id}-${Date.now()}`;

        const currentItems = get().items;
        const newItem: CartItem = {
          id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
          giftCardAmount,
          giftCardType
        };

        set({ items: [...currentItems, newItem] });
        toast.success("Товар добавлен в корзину");
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Товар удален из корзины");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      migrate: (persistedState: any, version: number) => {
        const items: CartItem[] =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          persistedState?.state?.items?.map((item: any) => ({
            id: item.id,
            product: item.product,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            quantity: item.quantity || 1,
            giftCardAmount: item.giftCardAmount,
            giftCardType: item.giftCardType,
          })) || [];

        return {
          items,
          addItem: () => { },
          removeItem: () => { },
          removeAll: () => { },
        } as CartStoreProps;
      }
    }
  )
);

export default useCart;

