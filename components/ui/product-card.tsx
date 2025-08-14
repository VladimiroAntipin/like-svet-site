'use client';

import { Product } from "@/types";
import Image from "next/image";
import IconButton from "@/components/ui/icon-button";
import { Expand, Heart, ShoppingBag } from "lucide-react";
import Currency from "@/components/ui/currency";

interface ProductCardProps {
    data: Product;

}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    return (
        <div className="bg-white group cursor-pointer border-none p-0 space-y-4">
            <div className="aspect-square bg-gray-100 relative">
                <Image src={data?.images?.[0]?.url} alt="image" fill className="aspect-square object-cover" />
                <div className="absolute w-full px-6 top-5">
                    <div className="flex gap-x-6 justify-end">
                        <IconButton onClick={() => { }} icon={<Expand size={20} className="text-grey-600" />} />
                        <IconButton onClick={() => { }} icon={<ShoppingBag size={20} className="text-grey-600" />} />
                        <IconButton onClick={() => { }} icon={<Heart size={20} className="text-grey-600" />} />
                    </div>
                </div>
            </div>
            <div>
                <p className="font-semibold text-lg">{data.name}</p>
                <p className="text-sm text-gray-500">{data.category?.name}</p>
            </div>
            <div className="flex items-center justify-between">
                <Currency data={data?.price} />
            </div>
        </div>
    );
}

export default ProductCard;