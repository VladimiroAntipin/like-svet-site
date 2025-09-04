    export const onCheckout = async () => {
        if (isSubmitting) {
            toast.error("Обрабатываем ваш заказ…");
            return;
        }
        if (!user) {
            toast.error("❌ Необходимо авторизоваться");
            router.push("/auth");
            return;
        }
        if (!selectedShipping) {
            toast.error("Выберите способ доставки");
            return;
        }
        if (isCheckoutDisabled) {
            toast.error("Проверьте правильность заполнения всех полей");
            return;
        }

        try {
            setIsSubmitting(true);

            const giftCardItems = items.filter(item => item.product.isGiftCard);
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
                    quantity: Number(item.quantity) || 1
                };
            });

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                {
                    items: orderItems,
                    shippingMethod: selectedShipping.name,
                    region,
                    address,
                    apartment,
                    floor,
                    entrance,
                    extraInfo,
                    totalPrice: finalTotal,
                    usedBalance: useBalance ? maxBalanceToUse : 0
                },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            // Aggiorna il balance dell'utente lato backend
            if (useBalance && maxBalanceToUse > 0) {
                try {
                    const balanceRes = await axios.patch(
                        `${process.env.NEXT_PUBLIC_API_URL}/customers/${user.id}/balance`,
                        { amount: -maxBalanceToUse }, // sempre in копейках
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );

                    const updatedCustomer = balanceRes.data;

                    // Aggiorna subito il contesto React
                    updateUserBalance(updatedCustomer.balance);
                } catch (balanceErr) {
                    console.error("Errore aggiornando баланс:", balanceErr);
                    toast.error("⚠️ Заказ создан, но баланс не обновлён.");
                }
            }

            toast.success("✅ Заказ успешно оформлен!");
            removeAll();
            if (onOrderComplete) onOrderComplete();
        } catch (err) {
            console.error(err);
            toast.error("❌ Ошибка при оформлении заказа. Попробуйте снова.");
        } finally {
            setIsSubmitting(false);
        }
    };
