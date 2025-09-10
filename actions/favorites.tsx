import { authFetch } from "@/lib/auth-fetch";
import { Favorite } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getFavorites(): Promise<Favorite[]> {
    const res = await authFetch(`${API_URL}/favorites`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");

    return res.json();
}

export async function addFavorite(productId: string): Promise<Favorite> {
    const res = await authFetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Errore nell'aggiungere il preferito");

    return res.json();
}

export async function removeFavorite(productId: string): Promise<void> {
    const res = await authFetch(`${API_URL}/favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Errore nel rimuovere il preferito");
}