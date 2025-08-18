import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: number;
  minPrice?: string;
  maxPrice?: string;
  colorId?: string;
  sort?: "asc" | "desc";
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      limit: query.limit,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      colorId: query.colorId,
      sort: query.sort,
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getProducts;
