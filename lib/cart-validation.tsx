// Validazione per Курьер
export const validateCourierDate = (value: string): boolean => {
    const regex = /^\d{2}[\/.-]\d{2}[\/.-]\d{2,4}\s+\d{2}:\d{2}-\d{2}:\d{2}$/;
    return regex.test(value.trim());
};

// Validazione per Почта России
export const validatePostIndex = (value: string): boolean => {
    const indexRegex = /\b\d{6}\b/;
    const hasCity = value.replace(indexRegex, "").trim().length > 0;
    return indexRegex.test(value) && hasCity;
};

// Validazione per Международная доставка
export const validateInternational = (value: string): boolean => {
    const parts = value.split(',').map(part => part.trim());
    return parts.length >= 2 && parts[0].length > 0 && parts[1].length > 0;
};

// Validazione per СДЭК / Яндекс Маркет
export const validateDeliveryPoint = (regionValue: string, addressValue: string): boolean => {
    return regionValue.trim().length > 0 && addressValue.trim().length > 0;
};

// Validazione email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

// Validazione telefono (deve contenere codice paese come +7 и numero)
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // Formato E.164 internazionale
    return phoneRegex.test(phone.trim());
};

// Validazione per электронный (email o telefono)
export const validateElectronic = (email: string, phone: string): boolean => {
    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.trim().length > 0;

    if (hasEmail && !validateEmail(email)) return false;
    if (hasPhone && !validatePhone(phone)) return false;

    return hasEmail || hasPhone;
};