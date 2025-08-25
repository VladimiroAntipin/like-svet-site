import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");

  const data = await res.json();

  // Trasforma i prezzi delle gift card in array di numeri
  if (data.isGiftCard && data.giftPrices) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.giftPrices = data.giftPrices.map((gp: any) => ({
      value: gp.value,
    }));
  }

  return data;
};

export default getProduct;