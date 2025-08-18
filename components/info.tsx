'use client';

import { useState } from "react";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const selectedSizeLabel = data.productSizes?.find(ps => ps.size.id === selectedSize)?.size.value;
    const selectedColorObj = data.productColors?.find(pc => pc.color.id === selectedColor)?.color;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 ">{data.name}</h1>

            <div className="mt-3 flex items-end justify-between">
                <div className="text-2xl text-gray-900 ">
                    <Currency data={data?.price} />
                </div>
            </div>

            <hr className="my-4 " />

            {/* Dropdown per scegliere la taglia */}
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Размер:</h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button role="combobox" className="w-[180px] justify-between border border-gray-300 bg-white text-black rounded-md px-3 py-2 font-thin" >
                                {selectedSizeLabel || "Выберите размер"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0">
                            <Command>
                                <CommandInput placeholder="Искать размер..." />
                                <CommandList>
                                    <CommandEmpty>Ничего не найдено.</CommandEmpty>
                                    <CommandGroup>
                                        {data.productSizes?.map((ps) => (
                                            <CommandItem key={ps.size.id} onSelect={() => setSelectedSize(ps.size.id)} >
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

            {/* Dropdown per scegliere il colore */}
            <div className="flex flex-col gap-y-6 mt-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Цвет:</h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button role="combobox" className="w-[180px] justify-between border border-gray-200 bg-white text-black rounded-md px-3 py-2 font-thin" >
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
                                        {data.productColors?.map((pc) => (
                                            <CommandItem key={pc.color.id} onSelect={() => setSelectedColor(pc.color.id)} className="flex items-center gap-x-2" >
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

            {/* Bottone Aggiungi al Carrello */}
            <div className="mt-10 flex items-center gap-x-3">
                <Button
                    className={`bg-black text-white flex items-center gap-x-4 rounded-none ${!selectedSize || !selectedColor ? "opacity-50 hover:opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!selectedSize || !selectedColor}
                    onClick={() => {
                        if (!selectedSize || !selectedColor) return;
                        console.log("Добавить в корзину", {
                            productId: data.id,
                            sizeId: selectedSize,
                            colorId: selectedColor,
                        });
                    }}
                >
                    В корзину
                    <ShoppingBag />
                </Button>
            </div>
        </div>
    );
};

export default Info;