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
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();

  // Trasforma i prezzi delle gift card
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((product: any) => {
    if (product.isGiftCard && product.giftPrices) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product.giftPrices = product.giftPrices.map((gp: any) => ({
        value: gp.value,
      }));
      // Rimuove price normale per coerenza
      product.price = null;
    }
    return product;
  });
};

export default getProducts;


