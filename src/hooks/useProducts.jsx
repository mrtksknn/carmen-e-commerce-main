import { useState, useEffect } from "react";
import { subscribeToProducts } from "../services/firebaseService";
import { sortNewestFirst } from "../lib/seo-data.mjs";
import { registerProducts } from "../lib/artworkPath";

/** The whole catalogue, newest first, kept live. */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (data) => {
        const sorted = sortNewestFirst(data);
        registerProducts(sorted);
        setProducts(sorted);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
};
