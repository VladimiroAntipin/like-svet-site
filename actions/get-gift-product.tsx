import getProducts from "./get-products";

export const getGiftProductId = async (): Promise<string | null> => {
  try {
    const products = await getProducts({ limit: 50 });
    const giftCard = products.find(
      (p) => p.isGiftCard || p.category?.name === "Подарочный сертификат"
    );
    return giftCard ? giftCard.id : null;
  } catch (err) {
    console.error("Errore fetch gift card:", err);
    return null;
  }
};