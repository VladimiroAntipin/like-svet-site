/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Prepara ordine ma non invia
export const validateAndPrepareOrder = async ({
  user,
  items,
  selectedShipping,
  region,
  address,
  apartment,
  floor,
  entrance,
  extraInfo,
  useBalance,
  maxBalanceToUse,
  finalTotal,
  purchaseGiftCode,
  toast,
  router,
  setIsSubmitting,
  isSubmitting,
  isCheckoutDisabled,
}: {
  user: any;
  items: any[];
  selectedShipping: any;
  region: string;
  address: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  extraInfo?: string;
  useBalance: boolean;
  maxBalanceToUse: number;
  finalTotal: number;
  purchaseGiftCode: (amount: number, token: string) => Promise<any>;
  toast: any;
  router: any;
  setIsSubmitting: (v: boolean) => void;
  isSubmitting: boolean;
  isCheckoutDisabled: boolean;
}) => {
  if (isSubmitting) {
    toast.error("Обрабатываем ваш заказ…");
    return null;
  }
  if (!user) {
    toast.error("❌ Необходимо авторизоваться");
    router.push("/auth");
    return null;
  }
  if (!selectedShipping) {
    toast.error("Выберите способ доставки");
    return null;
  }
  if (isCheckoutDisabled) {
    toast.error("Проверьте правильность заполнения всех полей");
    return null;
  }

  setIsSubmitting(true);

  try {
    const giftCardItems = items.filter(i => i.product.isGiftCard);
    const giftCodeResults = await Promise.all(
      giftCardItems.map(async (item) => {
        const res = await purchaseGiftCode((item.giftCardAmount || 0) * 100, user.token);
        return { itemId: item.id, giftCodeId: res.giftCode.id };
      })
    );

    const orderItems = items.map(item => {
      if (item.product.isGiftCard) {
        const giftCode = giftCodeResults.find(gc => gc.itemId === item.id);
        return {
          productId: item.product.id,
          quantity: Number(item.quantity) || 1,
          giftCardAmount: item.giftCardAmount,
          giftCardType: item.giftCardType,
          giftCodeId: giftCode?.giftCodeId,
        };
      }
      return {
        productId: item.product.id,
        sizeId: item.selectedSize?.id,
        colorId: item.selectedColor?.id,
        quantity: Number(item.quantity) || 1,
      };
    });

    return {
      items: orderItems,
      shippingMethod: selectedShipping.name,
      region,
      address,
      apartment,
      floor,
      entrance,
      extraInfo,
      isPaid: true,
      totalPrice: finalTotal,
      usedBalance: useBalance ? maxBalanceToUse : 0,
    };
  } catch (err) {
    console.error(err);
    toast.error("❌ Ошибка при подготовке заказа");
    return null;
  } finally {
    setIsSubmitting(false);
  }
};

// Invio ordine al backend
export const submitOrder = async (
  orderData: any,
  user: any,
  updateUserBalance: (balance: number) => void,
  toast: any,
  removeAll: () => void
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      orderData,
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    if (orderData.usedBalance > 0) {
      try {
        const balanceRes = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${user.id}/balance`,
          { amount: -orderData.usedBalance },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        updateUserBalance(balanceRes.data.balance);
      } catch (balanceErr) {
        console.error("Errore aggiornando баланс:", balanceErr);
        toast.error("⚠️ Заказ создан, но баланс не обновлён.");
      }
    }

    toast.success("✅ Заказ успешно оформлен!");
    removeAll();
  } catch (err) {
    console.error(err);
    toast.error("❌ Ошибка при оформлении заказа. Попробуйте снова.");
  }
};
