'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import getProducts from "@/actions/get-products";
import { Product } from "@/types";

interface SidebarNavProps {
  onLinkClick?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [giftProductId, setGiftProductId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  // Fetch prima gift card disponibile usando la categoria "Подарочный сертификат"
  useEffect(() => {
    const fetchGiftProduct = async () => {
      try {
        const products: Product[] = await getProducts({ limit: 50 });
        const giftCard = products.find(
          (p) => p.isGiftCard || p.category?.name === "Подарочный сертификат"
        );
        if (giftCard) setGiftProductId(giftCard.id);
      } catch (err) {
        console.error("Errore fetch gift card:", err);
      }
    };
    fetchGiftProduct();
  }, []);

  const routes = [
    { href: "/account", label: "Мой профиль" },
    { href: "/#products", label: "Каталог" },
    { href: "/#about", label: "О нас" },
    { href: "/#reviews", label: "Отзывы" },
    {
      href: "/customers",
      label: "Покупателям",
      children: [
        {
          href: giftProductId ? `/product/${giftProductId}` : "",
          label: "Подарочные сертификаты",
        },
        { href: "/customers/#packaging", label: "Упаковка" },
        { href: "/customers/#delivery", label: "Доставка" },
        { href: "/customers/#custom-orders", label: "Индивидуальные заказы" },
        { href: "/customers/#loyalty", label: "Система лояльности" },
      ],
    },
    { href: "/#contacts", label: "Контакты" },
    { href: "https://instagram.com/likesvetshop/", label: "Instagram" },
  ];

  const handleLogout = () => {
    logout();
    onLinkClick?.();
  };

  return (
    <nav className="mx-6 flex flex-col gap-3">
      {/* Login / Logout */}
      <div className="mb-10">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white text-sm font-medium py-2 transition-colors hover:bg-neutral-800 cursor-pointer"
          >
            Выйти
          </button>
        ) : (
          <Link
            href="/auth"
            onClick={onLinkClick}
            className={cn(
              "w-full block bg-black text-white text-sm font-medium py-2 text-center transition-colors hover:bg-neutral-800 cursor-pointer",
              pathname === "/auth" ? "bg-neutral-900" : ""
            )}
          >
            Войти
          </Link>
        )}
      </div>

      {/* Links principali */}
      {routes.map((route) => {
        const active = pathname === route.href;

        if (route.children) {
          const isOpen = open === route.href;
          return (
            <div key={route.href}>
              <button
                onClick={() => setOpen(isOpen ? null : route.href)}
                className={cn(
                  "flex items-center justify-between w-full text-sm font-medium transition-colors hover:text-black",
                  active ? "text-black" : "text-neutral-500"
                )}
              >
                {route.label}
                <ChevronDown
                  size={18}
                  className={cn(
                    "ml-2 transition-transform duration-300",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="children"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden ml-2 mt-2"
                  >
                    {route.children.map((child, i) => {
                      const childActive = pathname === child.href;
                      return (
                        <motion.div
                          key={child.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.25, delay: i * 0.05 }}
                        >
                          <Link
                            href={child.href}
                            onClick={onLinkClick}
                            className={cn(
                              "text-sm text-neutral-500 hover:text-black transition-colors",
                              childActive ? "text-black font-medium" : ""
                            )}
                          >
                            {child.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onLinkClick}
            className={cn(
              "text-sm font-medium transition-colors hover:text-black",
              active ? "text-black" : "text-neutral-500"
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;