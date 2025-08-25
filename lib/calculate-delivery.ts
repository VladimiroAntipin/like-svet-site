interface DeliveryOptions {
  orderAmount: number;      // Сумма заказа в ₽
  isRepeatCustomer?: boolean; // true если повторный заказ
  birthday?: Date;           // Дата рождения пользователя
  today?: Date;              // Дата текущего дня (для тест o override)
}

interface DeliveryResult {
  deliveryCost: number; // Стоимость доставки в ₽
  discount: number;     // Процент скидки (0-100)
  messages: string[];   // Сообщения о скидках/доставке
}

/**
 * Calcola il costo della consegna e applica gli sconti secondo le regole fornite
 */
export function calculateDelivery({ orderAmount, isRepeatCustomer = false, birthday, today = new Date() }: DeliveryOptions): DeliveryResult {
  const messages: string[] = [];
  let discount = 0;
  let deliveryCost = 500; // costo standard (ipotetico) in ₽

  // Бесплатная доставка
  if (orderAmount > 8000) {
    deliveryCost = 0;
    messages.push("Бесплатная доставка до отделения Почты/СДЭК при заказе более 8000₽");
  }

  // Скидка по сумме заказа
  if (orderAmount > 15000) {
    discount = Math.max(discount, 10);
    messages.push("Скидка 10% при заказе более 15.000₽");
  } else if (orderAmount > 10000) {
    discount = Math.max(discount, 5);
    messages.push("Скидка 5% при заказе более 10.000₽");
  } else if (orderAmount > 8000) {
    discount = Math.max(discount, 3);
    messages.push("Скидка 3% при заказе более 8000₽");
  }

  // Скидка для повторного заказа
  if (isRepeatCustomer) {
    discount = Math.max(discount, 10);
    messages.push("Скидка 10% на весь ассортимент при повторном заказе");
  }

  // Скидка на День Рождения
  if (birthday) {
    const birthdayStart = new Date(birthday);
    birthdayStart.setDate(birthdayStart.getDate() - 7);
    const birthdayEnd = new Date(birthday);
    birthdayEnd.setDate(birthdayEnd.getDate() + 7);

    if (today >= birthdayStart && today <= birthdayEnd) {
      discount = Math.max(discount, 10);
      messages.push("Скидка 10% в День Рождения (7 дней до и после)");
    }
  }

  return { deliveryCost, discount, messages };
}