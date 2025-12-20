import { useQuery } from "@tanstack/react-query";
import { listCategories, CategoryResponse } from "@/services/category";

export function useCategories() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await listCategories();
      return result.categories;
    },
    staleTime: 1000 * 60 * 10,
  });

  return {
    categories: data || [] as CategoryResponse[],
    isLoading,
    isError,
    error,
  };
}
