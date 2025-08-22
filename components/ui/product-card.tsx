'use client';

import { Product } from "@/types";
import Image from "next/image";
import IconButton from "@/components/ui/icon-button";
import { Heart, ShoppingBag } from "lucide-react";
import Currency from "@/components/ui/currency";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { addFavorite, removeFavorite } from "@/actions/favorites";
import { toast } from "sonner";

interface ProductCardProps {
  data: Product;
  initialIsFavorite?: boolean;
  onToggleFavorite?: () => void; // callback opzionale per la pagina
}

const ProductCard: React.FC<ProductCardProps> = ({ data, initialIsFavorite = false, onToggleFavorite }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert("Devi essere loggato per aggiungere ai preferiti");

    try {
      if (isFavorite) {
        await removeFavorite(data.id);  
        setIsFavorite(false);
        toast.success("Товар удалён из избранного ❤️");
      } else {
        await addFavorite(data.id);     
        setIsFavorite(true);
        toast.success("Товар добавлен в избранное 💖");
      }

      if (onToggleFavorite) onToggleFavorite();
    } catch (err) {
      console.error("Errore toggle favorite:", err);
      toast.error("Произошла ошибка, попробуйте снова ❌");
    }
  };

  return (
    <div className="bg-white group cursor-pointer border-none p-0 space-y-4" onClick={() => router.push(`/product/${data.id}`)}>
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={data.images[0]?.url || "/placeholder.png"}
          alt={data.name}
          fill
          className="object-cover"
        />
        <div className="absolute w-full px-6 top-5 flex justify-end gap-6">
          <IconButton
            icon={<ShoppingBag size={20} className="text-grey-600" />}
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            icon={<Heart size={20} className={isFavorite ? "text-red-500 fill-red-500 cursor-pointer" : "text-grey-600 cursor-pointer"} />}
            onClick={toggleFavorite}
          />
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <Currency data={data.price} />
      </div>
    </div>
  );
};

export default ProductCard;




