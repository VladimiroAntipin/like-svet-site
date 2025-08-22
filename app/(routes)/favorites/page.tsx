'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import ProductCard from "@/components/ui/product-card";
import { fetchFavorites } from "@/actions/favorites";
import { Favorite, Product } from "@/types";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import Loader from "@/components/loader";

const FavoritePage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites();
        setFavorites(data);
      } catch (err) {
        console.error("Errore fetchFavorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleFavoriteRemoved = (productId: string) => {
    setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
  };

  if (loading) return <Loader />;

  if (!user)
  return (
    <main className="flex flex-col gap-y-4 items-center justify-center h-screen text-center">
      <p className="text-lg md:text-xl text-gray-600">
        Необходимо войти в аккаунт, чтобы просматривать избранное
      </p>
      <Button className="flex items-center gap-2 bg-black text-white rounded-none">
        <Link href="/auth" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Войти в аккаунт
        </Link>
      </Button>
    </main>
  );

  if (!favorites.length)
    return (
      <main className="flex flex-col gap-y-4 items-center justify-center h-screen text-center">
        <p className="text-lg md:text-xl text-gray-600">
          В данный момент нет товаров в избранном ❤️
        </p>
        <Button className="flex items-center gap-2 bg-black text-white rounded-none">
          <Link href="/#products" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Вернуться в каталог
          </Link>
        </Button>
      </main>
    );

  return (
    <main className="p-4 h-screen">
      {/* Titolo */}
      <h1 className="text-3xl font-bold mb-4">Избранное</h1>

      {/* Bottone ritorna al catalogo */}
      <div className="mb-6">
        <Button className="flex items-center gap-2 bg-transparent text-grey-900 rounded-none">
          <Link href="/#products" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Вернуться в каталог
          </Link>
        </Button>
      </div>

      {/* Grid delle cards */}
      <div className="grid grid-cols-1 max-[500px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map(fav => (
          <ProductCard
            key={fav.id}
            data={fav.product as Product}
            initialIsFavorite={true}
            onToggleFavorite={() => handleFavoriteRemoved(fav.product.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default FavoritePage;
