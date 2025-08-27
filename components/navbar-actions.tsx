"use client";

import Button from "@/components/ui/button";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import SidebarNav from "./sidebar-nav";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();
  const router = useRouter();

  if (!isMounted) return null;

  return (
    <>
      {/* Navbar Buttons */}
      <div className="flex items-center justify-between gap-x-4 w-full">
        <div className="flex items-center max-[500px]:flex-row-reverse gap-2">
          <Button className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1">
            <Link href="/favorites">
            <Heart size={24} />
            </Link>
          </Button>
          <Button onClick={() => router.push("/cart")} className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1 relative">
            <ShoppingBag size={24} />
            <span className="text-xs font-medium bg-black text-white px-2 py-1 max-[500px]:px-1.5 max-[500px]:py-0.5 rounded-full absolute top-0 right-0.5">
              {cart.items.length}
            </span>
          </Button>
        </div>

        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center rounded-full px-4 py-2 max-[500px]:px-2 max-[500px]:py-1"
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <SidebarNav onLinkClick={() => setIsSidebarOpen(false)} />
      </Sidebar>
    </>
  );
};

export default NavbarActions;
