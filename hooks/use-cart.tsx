import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Size, Color } from "@/types";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: Size;
  selectedColor: Color;
  quantity: number;
}

interface CartStoreProps {
  items: CartItem[];
  addItem: (product: Product, size: Size, color: Color) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStoreProps>(
    (set, get) => ({
      items: [],
      addItem: (product: Product, size: Size, color: Color) => {
        const id = `${product.id}-${size.id}-${color.id}-${Date.now()}`;

        const currentItems = get().items;
        const newItem: CartItem = {
          id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
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
        // Se non ci sono items validi, ritorna solo un array vuoto
        const items: CartItem[] = persistedState?.state?.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.filter((item: any) => item?.product && item?.selectedSize && item?.selectedColor)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((item: any) => ({
            id: `${item.product.id}-${item.selectedSize.id}-${item.selectedColor.id}`,
            product: item.product,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            quantity: item.quantity || 1,
          })) || [];

        // Restituiamo uno stato completo valido
        return {
          items,
          addItem: () => { },
          removeItem: () => { },
          removeAll: () => { },
        } as CartStoreProps;
      },
    }
  )
);

export default useCart;

