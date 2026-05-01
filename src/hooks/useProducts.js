import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/firebaseService";

export const useProducts = () => {
  const { data: products = [], isLoading: loading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return { products, loading, error };
};
