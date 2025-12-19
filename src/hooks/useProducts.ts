import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  listMyProducts,
  listAllProductsAdmin,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  deleteProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/services/product";

type ListType = "public" | "seller" | "admin";

export const useProducts = (page: number, pageSize: number, listType: ListType = "public") => {
  const queryClient = useQueryClient();

  const listFn = {
    public: listProducts,
    seller: listMyProducts,
    admin: listAllProductsAdmin,
  }[listType];

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page, pageSize, listType],
    queryFn: () => listFn({ page, pageSize }),
  });

  const createProductMutation = useMutation({
    mutationFn: (product: CreateProductRequest) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const activateProductMutation = useMutation({
    mutationFn: (id: string) => activateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deactivateProductMutation = useMutation({
    mutationFn: (id: string) => deactivateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id, confirmationName }: { id: string; confirmationName: string }) =>
      deleteProduct(id, confirmationName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products: productsData?.results || [],
    paging: productsData?.paging || {
      total: 0,
      page: 1,
      pageSize: 0,
      totalPages: 0,
    },
    isLoading,
    isError,
    error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    activateProduct: activateProductMutation.mutate,
    deactivateProduct: deactivateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    createStatus: createProductMutation.status,
    updateStatus: updateProductMutation.status,
    activateStatus: activateProductMutation.status,
    deactivateStatus: deactivateProductMutation.status,
    deleteStatus: deleteProductMutation.status,
  };
};
