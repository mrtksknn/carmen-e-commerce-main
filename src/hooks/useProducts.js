import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/firebaseService";

export const useProducts = () => {
  const { data: products = [], isLoading: loading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return { products, loading, error };
};
