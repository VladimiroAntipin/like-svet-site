'use client';

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { addFavorite, removeFavorite, getFavorites } from "@/actions/favorites";
import { Product } from "@/types";
import { useAuth } from "./auth-context";

interface FavoritesContextType {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const favs = await getFavorites();
      setFavorites(favs.map(f => f.product));
    } catch (err) {
      console.error("Errore caricamento favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carica i preferiti al mount o quando cambia l'utente
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some(p => p.id === productId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (product: Product) => {
      if (!user) return;

      if (isFavorite(product.id)) {
        await removeFavorite(product.id);
        setFavorites(prev => prev.filter(p => p.id !== product.id));
      } else {
        await addFavorite(product.id);
        setFavorites(prev => [...prev, product]);
      }
    },
    [user, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
