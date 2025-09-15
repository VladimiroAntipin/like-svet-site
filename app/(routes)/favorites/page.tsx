'use client';

import ProductCard from "@/components/ui/product-card";
import Button from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/loader";
import { useFavorites } from "@/context/favorite-context";
import { useAuth } from "@/context/auth-context";

export const dynamic = 'force-dynamic'

const FavoritePage: React.FC = () => {
  const { favorites, loading } = useFavorites();
  const { user } = useAuth();

  if (loading) return <Loader />;

  if (!user)
    return (
      <main className="flex flex-col gap-y-4 items-center justify-center h-screen text-center mt-[-200px]">
        <p className="text-lg md:text-xl text-gray-600">
          Необходимо войти в аккаунт, чтобы просматривать избранное
        </p>
        <Link href="/auth" className="flex items-center gap-2  bg-black text-white rounded-none p-5">
          <ArrowLeft size={16} />
          Войти в аккаунт
        </Link>
      </main>
    );

  if (!favorites.length)
    return (
      <main className="flex flex-col gap-y-4 items-center justify-center h-screen text-center mt-[-200px]">
        <p className="text-lg md:text-xl text-gray-600">
          В данный момент нет товаров в избранном ❤️
        </p>
        <Link href="/#products" className="flex items-center gap-2 bg-black text-white rounded-none p-5">
          <ArrowLeft size={16} />
          Вернуться в каталог
        </Link>
      </main>
    );

  return (
    <main className="w-full flex justify-center p-4 h-screen">
      <div className="w-[80vw] max-[500px]:w-full">
        <h1 className="text-3xl font-bold mb-4">Избранное</h1>

        <div className="mb-6">
          <Button className="flex items-center gap-2 bg-transparent text-grey-900 rounded-none">
            <Link href="/#products" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Вернуться в каталог
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map(product => (
            <ProductCard
              key={product.id}
              data={product}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default FavoritePage;


