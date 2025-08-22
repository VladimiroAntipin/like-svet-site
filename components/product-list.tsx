'use client';

import { Product, Favorite } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { fetchFavorites } from "@/actions/favorites";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites();
        setFavorites(data);
      } catch (err) {
        console.error("Errore fetchFavorites:", err);
      }
    };

    loadFavorites();
  }, [user]);

  const favoriteIds = new Set(favorites.map(fav => fav.product.id));

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-3xl">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <ProductCard
            key={item.id}
            data={item}
            initialIsFavorite={favoriteIds.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
