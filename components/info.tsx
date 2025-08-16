'use client';

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 ">{data.name}</h1>
            <div className="mt-3 flex items-end justify-between">
                <div className="text-2xl text-gray-900 ">
                    <Currency data={data?.price} />
                </div>
            </div>
            <hr className="my-4 " />
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Размер: </h3>
                    <div>{data?.size?.value}</div>
                </div>
            </div>
            <div className="mt-10 flex items-center gap-x-3">
                <Button className="bg-black text-white flex items-center gap-x-4 rounded-none">
                    В корзину
                    <ShoppingBag />
                </Button>
            </div>
        </div>
    );
}

export default Info;