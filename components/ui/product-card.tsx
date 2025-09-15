'use client';

import { Product } from "@/types";
import Image from "next/image";
import IconButton from "@/components/ui/icon-button";
import { Heart } from "lucide-react";
import Currency from "@/components/ui/currency";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { useFavorites } from "@/context/favorite-context";

export const dynamic = 'force-dynamic'

interface ProductCardProps {
  data: Product;
  onToggleFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, onToggleFavorite }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      await toggleFavorite(data);
      toast.success(
        isFavorite(data.id)
          ? "Товар удалён из избранного ❤️"
          : "Товар добавлен в избранное 💖"
      );
      onToggleFavorite?.();
    } catch (err) {
      console.error(err);
      toast.error("Произошла ошибка, попробуйте снова ❌");
    }
  };

  return (
    <div
      className="bg-white group cursor-pointer border-none p-0 space-y-4"
      onClick={() => router.push(`/product/${data.id}`)}
    >
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={data.images[0]?.url || "/placeholder.png"}
          alt={data.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute w-full px-6 top-5 flex justify-end gap-6">
          <IconButton
            icon={
              <Heart
                size={20}
                className={isFavorite(data.id) ? "text-red-500 fill-red-500 cursor-pointer" : "text-grey-600 cursor-pointer"}
              />
            }
            onClick={handleToggleFavorite}
          />
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        {!data.isGiftCard && <Currency data={data.price} />}
      </div>
    </div>
  );
};

export default ProductCard;






