"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface LoadMoreButtonProps {
  limit: number;
  categoryId?: string;
  basePath?: string;
  minPrice?: string;
  maxPrice?: string;
  colorId?: string;
  sort?: "asc" | "desc";
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  limit,
  categoryId,
  basePath,
  minPrice,
  maxPrice,
  colorId,
  sort,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const newLimit = limit + 8;
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", newLimit.toString());

    if (categoryId) params.set("categoryId", categoryId);
    else params.delete("categoryId");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (colorId) params.set("colorId", colorId);
    else params.delete("colorId");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    router.push(`${basePath || "/"}?${params.toString()}`, { scroll: false });
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-black hover:bg-gray-800 text-white cursor-pointer w-full"
    >
      Показать еще
    </button>
  );
};

export default LoadMoreButton;




