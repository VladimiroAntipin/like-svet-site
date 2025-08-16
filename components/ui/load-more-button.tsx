"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface LoadMoreButtonProps {
  limit: number;
  categoryId?: string;
  basePath?: string; // 👈 nuovo: serve a specificare su che pagina restare
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ limit, categoryId, basePath }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const newLimit = limit + 8;
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", newLimit.toString());

    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

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



