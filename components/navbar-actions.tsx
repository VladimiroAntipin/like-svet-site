'use client';

import Button from "@/components/ui/button";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const NavbarActions = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div className="flex items-center justify-between gap-x-4 w-full">
            <div className="flex items-center max-[500px]:flex-row-reverse">
                <Button className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1">
                    <Heart size={24} />
                </Button>
                <Button className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1 relative">
                    <ShoppingBag size={24} />
                    <span className="text-xs font-medium bg-black text-white px-2 py-1 max-[500px]:px-1.5 max-[500px]:py-0.5 rounded-full absolute top-0 right-0.5">0</span>
                </Button>
            </div>
            <Button className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1">
                <Menu size={24} />
            </Button>
        </div>
    );
}

export default NavbarActions;