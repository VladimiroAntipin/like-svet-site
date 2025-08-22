import { getToken } from "@/lib/token";
import { Favorite } from "@/types";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchFavorites(): Promise<Favorite[]> {
    const token = getToken();
    if (!token) return [];

    const res = await fetch(`${API_URL}/favorites`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");

    const data: Favorite[] = await res.json();
    return data;
}

export async function addFavorite(productId: string): Promise<Favorite> {
    const token = getToken();
    if (!token) throw new Error("Utente non autenticato");

    const res = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Errore nell'aggiungere il preferito");

    const data: Favorite = await res.json();
    return data;
}

export async function removeFavorite(productId: string): Promise<void> {
    const token = getToken();
    if (!token) throw new Error("Utente non autenticato");

    const res = await fetch(`${API_URL}/favorites`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Errore nel rimuovere il preferito");
}
