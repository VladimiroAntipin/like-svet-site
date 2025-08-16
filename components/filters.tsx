"use client";

import { Category } from "@/types";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface FiltersProps {
  data: Category[];
  name: string;
  valueKey: string;
}

const Filters: React.FC<FiltersProps> = ({ data, valueKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    // Costruisci la query SOLO con il categoryId scelto
    const query: Record<string, string | null> = {
      [valueKey]: id,
    };

    // Se la categoria è già selezionata, la rimuovi
    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const pathname = window.location.pathname;
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true }
    );

    router.push(url, { scroll: false });
  };

  return (
    <div className="w-full flex gap-6 overflow-x-auto">
      {data.map((category) => {
        const isSelected = category.id === selectedValue;

        return (
          <button
            key={category.id}
            onClick={() => onClick(category.id)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <div
              className={`flex items-center justify-center rounded-full w-20 h-20 p-1 overflow-hidden border-2 transition ${
                isSelected ? "border-black" : "border-gray-300"
              }`}
            >
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={80}
                height={80}
                className="rounded-full w-17 h-17"
              />
            </div>
            <span
              className={`mt-2 text-sm text-center whitespace-pre-line ${
                isSelected ? "font-bold" : "font-normal"
              }`}
            >
              {category.name.split(" ").join("\n")}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Filters;