"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FiltersProps {
  colors: { id: string; name: string; value: string }[];
}

const Filters: React.FC<FiltersProps> = ({ colors }) => {
  const router = useRouter();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [colorId, setColorId] = useState(params.get("colorId") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  // 🔄 Sincronizza lo stato con i parametri dell'URL
  useEffect(() => {
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setColorId(params.get("colorId") || "");
    setSort(params.get("sort") || "");
  }, [params]);

  const applyFilters = () => {
    const query = new URLSearchParams(params.toString());

    if (minPrice) query.set("minPrice", minPrice);
    else query.delete("minPrice");

    if (maxPrice) query.set("maxPrice", maxPrice);
    else query.delete("maxPrice");

    if (colorId) query.set("colorId", colorId);
    else query.delete("colorId");

    if (sort) query.set("sort", sort);
    else query.delete("sort");

    router.push(`?${query.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setColorId("");
    setSort("");

    router.push("?", { scroll: false });
  };

  return (
    <div
      className="
        flex gap-4 py-4 rounded-lg flex-wrap
        max-[500px]:flex max-[500px]:justify-between max-[500px]:gap-2
      "
    >
      {/* Prezzo */}
      <div className="flex items-center gap-2 max-[500px]:w-full max-[500px]:justify-between">
        <input
          type="number"
          placeholder="Мин. цена"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-32 border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full"
        />
        <input
          type="number"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32 border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full"
        />
      </div>

      {/* Colore */}
      <div className="flex items-center gap-2 cursor-pointer max-[500px]:w-full">
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          className="border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full"
        >
          <option value="">Все цвета</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ordinamento */}
      <div className="flex items-center gap-2 cursor-pointer max-[500px]:w-full">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full"
        >
          <option value="">Без сортировки</option>
          <option value="asc">Цена: по возрастанию</option>
          <option value="desc">Цена: по убыванию</option>
        </select>
      </div>

      {/* Bottoni */}
      <div className="
        flex items-center gap-2
        max-[500px]:flex-col max-[500px]:w-full max-[500px]:gap-2
      ">
        <button
          onClick={applyFilters}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-80 cursor-pointer max-[500px]:w-full max-[500px]:text-xs"
        >
          Применить фильтры
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer max-[500px]:w-full max-[500px]:text-xs"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};

export default Filters;