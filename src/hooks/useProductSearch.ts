import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listProducts, ProductResponse } from "../services/product";
import { ProductProps } from "../type";

/* eslint-disable @typescript-eslint/no-explicit-any */
const normalizeProducts = (items: ProductResponse[] = []): ProductProps[] =>
  items.map((item) => {
    const secureThumbnail = item.thumbnail
      ? item.thumbnail.replace(/^(http:)?\/\//, "https://")
      : "";

    return {
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1, // Default value
      available_quantity: item.availableQuantity,
      permalink: "", // Not provided by API
      thumbnail: secureThumbnail,
      warranty: item.condition === "NEW" ? "Garantia do Fabricante" : "Sem garantia",
      shipping: {
        free_shipping: false, // Default value
      },
      pictures: [
        {
          id: `${item.id}-thumb`,
          url: secureThumbnail,
        },
      ],
      attributes: [], // Not provided by API list
    } satisfies ProductProps;
  });

export function useProductSearch() {
  const [searchParams, setSearchParams] = useState({
    productName: "",
    categoryId: "",
    page: 1,
    sortChoice: "0",
  });

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: async () => {
      // Passa os parâmetros de busca para o serviço
      const result = await listProducts({
        page: searchParams.page,
        pageSize: 20, // Default pageSize
        categoryId: searchParams.categoryId,
        search: searchParams.productName,
      });

      const normalizedProducts = normalizeProducts(result.results);
      let parsedProducts = [...normalizedProducts];

      // Aplicar ordenação no cliente se o backend não suportar (ou se quisermos garantir)
      // Nota: Idealmente a ordenação deve ser feita no backend
      if (searchParams.sortChoice === "1") {
        parsedProducts.sort((a, b) => a.price - b.price);
      } else if (searchParams.sortChoice === "2") {
        parsedProducts.sort((a, b) => b.price - a.price);
      }

      return {
        results: parsedProducts,
        paging: result.paging,
      };
    },
    // Removido enabled condicional para carregar produtos iniciais se desejado
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const updateSearch = (params: Partial<typeof searchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params, page: 1 }));
  };

  const updatePage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const updateSort = (sortChoice: string) => {
    setSearchParams((prev) => ({ ...prev, sortChoice }));
  };

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
    searchParams,
    updateSearch,
    updatePage,
    updateSort,
  };
}
