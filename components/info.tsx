'use client';

import { useState } from "react";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFavorites } from "@/context/favorite-context";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const selectedSizeLabel = data.productSizes?.find(ps => ps.size.id === selectedSize)?.size.value;
  const selectedColorObj = data.productColors?.find(pc => pc.color.id === selectedColor)?.color;
  const cart = useCart();

  const handleToggleFavorite = async () => {
    if (!user) return toast.error("Необходимо войти в аккаунт");

    try {
      await toggleFavorite(data);
      toast.success(
        isFavorite(data.id)
          ? "Товар удалён из избранного ❤️"
          : "Товар добавлен в избранное 💖"
      );
    } catch (err) {
      console.error(err);
      toast.error("Произошла ошибка, попробуйте снова ❌");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>

      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl text-gray-900">
          <Currency data={data.price} />
        </div>
      </div>

      <hr className="my-4" />

      {/* Dropdown Taglia */}
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Размер:</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                className="w-[180px] justify-between border border-gray-300 bg-white text-black rounded-md px-3 py-2 font-thin"
              >
                {selectedSizeLabel || "Выберите размер"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0">
              <Command>
                <CommandInput placeholder="Искать размер..." />
                <CommandList>
                  <CommandEmpty>Ничего не найдено.</CommandEmpty>
                  <CommandGroup>
                    {data.productSizes?.map(ps => (
                      <CommandItem key={ps.size.id} onSelect={() => setSelectedSize(ps.size.id)}>
                        {ps.size.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Dropdown Colore */}
      <div className="flex flex-col gap-y-6 mt-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Цвет:</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                className="w-[180px] justify-between border border-gray-200 bg-white text-black rounded-md px-3 py-2 font-thin"
              >
                {selectedColorObj ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <span>{selectedColorObj.name}</span>
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: selectedColorObj.value }} />
                  </div>
                ) : (
                  "Выберите цвет"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0">
              <Command>
                <CommandInput placeholder="Искать цвет..." />
                <CommandList>
                  <CommandEmpty>Ничего не найдено.</CommandEmpty>
                  <CommandGroup>
                    {data.productColors?.map(pc => (
                      <CommandItem
                        key={pc.color.id}
                        onSelect={() => setSelectedColor(pc.color.id)}
                        className="flex items-center gap-x-2"
                      >
                        <span>{pc.color.name}</span>
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: pc.color.value }} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bottone Carrello + Preferiti */}
      <div className="mt-10 flex items-center gap-x-3">
        <Button
  className={`bg-black text-white flex items-center gap-x-4 rounded-none ${!selectedSize || !selectedColor ? "opacity-50 cursor-not-allowed" : ""}`}
  disabled={!selectedSize || !selectedColor}
  onClick={() => {
    if (!selectedSize || !selectedColor) return;

    const sizeObj = data.productSizes.find(ps => ps.size.id === selectedSize)?.size;
    const colorObj = data.productColors.find(pc => pc.color.id === selectedColor)?.color;

    if (!sizeObj || !colorObj) {
      toast.error("Выберите размер и цвет");
      return;
    }

    // Passiamo prodotto + size + color al carrello
    cart.addItem(data, sizeObj, colorObj);
  }}
>
          В корзину
          <ShoppingBag />
        </Button>

        <Button
          className={`${isFavorite(data.id) ? "text-red-500 border-red-500" : "text-gray-600 border-gray-300"} flex items-center gap-x-2 rounded-none border`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`${isFavorite(data.id) ? "fill-red-500" : ""}`} />
          {isFavorite(data.id) ? "В избранном" : "В избранное"}
        </Button>
      </div>
    </div>
  );
};

export default Info;
