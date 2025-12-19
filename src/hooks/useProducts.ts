import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  deleteProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/services/product";

export const useProducts = (page: number, pageSize: number) => {
  const queryClient = useQueryClient();

  // Query para listar produtos
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: () => listProducts({ page, pageSize }),
  });

  // Mutation para criar produto
  const createProductMutation = useMutation({
    mutationFn: (product: CreateProductRequest) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation para atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation para ativar produto
  const activateProductMutation = useMutation({
    mutationFn: (id: string) => activateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation para desativar produto
  const deactivateProductMutation = useMutation({
    mutationFn: (id: string) => deactivateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mutation para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
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
