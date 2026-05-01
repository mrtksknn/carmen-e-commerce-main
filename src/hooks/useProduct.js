import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/firebaseService";

export const useProduct = (id) => {
  const { data: product, isLoading: loading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return { product, loading, error };
};
