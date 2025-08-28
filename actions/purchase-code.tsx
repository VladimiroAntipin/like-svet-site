"use server";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function purchaseGiftCode(amount: number, token: string, expiresAt?: string) {
    const res = await fetch(`${CMS_URL}/gift-codes/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, expiresAt }),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Ошибка при покупке сертификата");
    }

    return res.json(); // ti torna sia giftCode che purchase
}
