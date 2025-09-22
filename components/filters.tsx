'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingDots } from "@/components/ui/loading-dots";

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

  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [openColorDropdown, setOpenColorDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sincronizza con URL
  useEffect(() => {
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setColorId(params.get("colorId") || "");
    setSort(params.get("sort") || "");
  }, [params]);

  // Chiudi dropdown se click fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setOpenColorDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setOpenSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFilters = () => {
    setLoadingApply(true);
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
    setTimeout(() => setLoadingApply(false), 500);
  };

  const resetFilters = () => {
    setLoadingReset(true);
    setMinPrice("");
    setMaxPrice("");
    setColorId("");
    setSort("");
    router.push("?", { scroll: false });
    setTimeout(() => setLoadingReset(false), 500);
  };

  return (
    <div className="flex gap-4 py-4 rounded-lg flex-wrap max-[500px]:flex max-[500px]:justify-between max-[500px]:gap-2">

      {/* Prezzo */}
      <div className="flex items-center gap-2 max-[500px]:w-full max-[500px]:justify-between">
        <input
          type="number"
          placeholder="Мин. цена"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-32 border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full text-[14px] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [moz-appearance:textfield]"
        />
        <input
          type="number"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32 border px-2 py-1 rounded font-thin cursor-pointer max-[500px]:w-full text-[14px] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [moz-appearance:textfield]"
        />
      </div>

      {/* Dropdown Colore */}
      <div className="relative w-32 max-[500px]:w-full" ref={colorRef}>
        <button
          className="w-full border px-2 py-1 rounded text-[14px] text-left cursor-pointer text-gray-500 font-thin"
          onClick={() => setOpenColorDropdown(!openColorDropdown)}
        >
          {colorId ? colors.find(c => c.id === colorId)?.name : "Все цвета"}
        </button>
        <AnimatePresence>
          {openColorDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-white border rounded shadow-md z-10 max-h-60 overflow-y-auto"
            >
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 font-thin cursor-pointer text-sm"
                onClick={() => { setColorId(""); setOpenColorDropdown(false); }}
              >
                Все цвета
              </button>
              {colors.map(c => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 font-thin cursor-pointer text-sm"
                  onClick={() => { setColorId(c.id); setOpenColorDropdown(false); }}
                >
                  {c.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown Ordinamento */}
      <div className="relative w-45 max-[500px]:w-full" ref={sortRef}>
        <button
          className="w-full border px-2 py-1 rounded text-[14px] text-left cursor-pointer text-gray-500 font-thin"
          onClick={() => setOpenSortDropdown(!openSortDropdown)}
        >
          {sort === "asc" ? "Цена: по возрастанию" : sort === "desc" ? "Цена: по убыванию" : "Без сортировки"}
        </button>
        <AnimatePresence>
          {openSortDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-white border rounded shadow-md z-10"
            >
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 font-thin cursor-pointer text-sm" onClick={() => { setSort(""); setOpenSortDropdown(false); }}>
                Без сортировки
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 font-thin cursor-pointer text-sm" onClick={() => { setSort("asc"); setOpenSortDropdown(false); }}>
                Цена: по возрастанию
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-500 font-thin cursor-pointer text-sm" onClick={() => { setSort("desc"); setOpenSortDropdown(false); }}>
                Цена: по убыванию
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottoni */}
      <div className="flex items-center gap-2 max-[500px]:flex-col max-[500px]:w-full max-[500px]:gap-2 max-[500px]:mt-4">
        <button
          onClick={applyFilters}
          className={`bg-black text-white px-4 py-1 rounded hover:opacity-80 cursor-pointer flex items-center justify-center gap-2 w-50 max-[500px]:w-full`}
          disabled={loadingApply}
        >
          Применить
          {loadingApply && <LoadingDots />}
        </button>
        <button
          onClick={resetFilters}
          className={`bg-gray-200 text-black px-4 py-1 rounded hover:bg-gray-300 cursor-pointer flex items-center justify-center gap-2 w-50 max-[500px]:w-full`}
          disabled={loadingReset}
        >
          Сбросить
          {loadingReset && <LoadingDots />}
        </button>
      </div>

    </div>
  );
};

export default Filters;