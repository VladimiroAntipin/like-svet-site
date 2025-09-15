'use client';

import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { useFavorites } from "@/context/favorite-context";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const { favorites } = useFavorites();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const favoriteIds = new Set(favorites.map(f => f.id));

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-3xl">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <ProductCard
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

