import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "../services/firebaseService";

export const useProduct = (id) => {
  const queryClient = useQueryClient();

  const { data: product, isLoading: loading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    // Optimization: Populate from the list cache if available to save a network request
    initialData: () => {
      return queryClient.getQueryData(["products"])?.find((p) => p.id === id);
    },
    // If the data is found in the list cache, we don't need to refetch immediately
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(["products"])?.dataUpdatedAt;
    }
  });

  return { product, loading, error };
};
