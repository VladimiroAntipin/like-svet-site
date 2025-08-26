"use server";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function redeemPromoCode(code: string, token: string) {

    const res = await fetch(`${CMS_URL}/gift-codes/redeem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈 qui usiamo il token preso dal context/localStorage
        },
        body: JSON.stringify({ code }),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Нет такого промокода");
    }

    return res.json();
}
