import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as api from "../services/api";
import { ProductProps } from "../type";

/* eslint-disable @typescript-eslint/no-explicit-any */
const normalizeProducts = (items: any[] = []): ProductProps[] =>
  items.map((item: any) => {
    const secureThumbnail = item.thumbnail
      ? item.thumbnail.replace(/^(http:)?\/\//, "https://")
      : "";

    const fallbackId =
      item.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

    return {
      id: item.id ?? fallbackId,
      title: item.title ?? "Produto sem título",
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      available_quantity: item.available_quantity ?? 0,
      permalink: item.permalink ?? "",
      thumbnail: secureThumbnail,
      warranty: item.warranty ?? "",
      shipping: {
        free_shipping: Boolean(item.shipping?.free_shipping),
      },
      pictures: item.pictures?.length
        ? item.pictures.map((picture: any, pictureIndex: number) => ({
            id:
              picture.id ?? `${fallbackId}-picture-${pictureIndex.toString()}`,
            url:
              picture.url?.replace(/^(http:)?\/\//, "https://") ??
              picture.secure_url?.replace(/^(http:)?\/\//, "https://") ??
              secureThumbnail,
          }))
        : secureThumbnail
        ? [
            {
              id: `${fallbackId}-thumb`,
              url: secureThumbnail,
            },
          ]
        : [],
      attributes: Array.isArray(item.attributes)
        ? item.attributes.map((attribute: any) => ({
            id: attribute.id ?? `${fallbackId}-${attribute.name ?? "attr"}`,
            name: attribute.name ?? "",
            value_name: attribute.value_name ?? "",
          }))
        : [],
    } satisfies ProductProps;
  });

export function useProductSearch() {
  const [searchParams, setSearchParams] = useState({
    productName: "",
    categoryId: "",
    page: 0,
    sortChoice: "0",
  });

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", searchParams],
    queryFn: async () => {
      if (!searchParams.productName && !searchParams.categoryId) {
        return [];
      }

      const result = await api.getProductsFromCategoryAndQuery(
        searchParams.categoryId,
        searchParams.productName,
        searchParams.page
      );

      const normalizedProducts = normalizeProducts(result?.results ?? []);

      // Aplicar ordenação
      if (searchParams.sortChoice === "1") {
        return [...normalizedProducts].sort((a, b) => a.price - b.price);
      } else if (searchParams.sortChoice === "2") {
        return [...normalizedProducts].sort((a, b) => b.price - a.price);
      }

      return normalizedProducts;
    },
    enabled: !!(searchParams.productName || searchParams.categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const updateSearch = (params: Partial<typeof searchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params, page: 0 }));
  };

  const updatePage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const updateSort = (sortChoice: string) => {
    setSearchParams((prev) => ({ ...prev, sortChoice }));
  };

  return {
    products: products ?? [],
    isLoading,
    isError,
    searchParams,
    updateSearch,
    updatePage,
    updateSort,
  };
}
