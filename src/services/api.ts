import { listCategories as fetchCategories } from "./category";
import { listProducts, getProductById, ProductResponse } from "./product";

export async function getCategories() {
  try {
    const response = await fetchCategories();
    return response.categories;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export async function getProductsFromCategoryAndQuery(
  categoryId: string,
  query: string,
  paging: number
) {
  try {
    const response = await listProducts({
      page: paging + 1,
      pageSize: 20,
      categoryId: categoryId || undefined,
      search: query || undefined,
    });

    return {
      results: response.results.map((product: ProductResponse) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        available_quantity: product.availableQuantity,
        thumbnail: product.thumbnail,
        condition: product.condition?.toLowerCase() || "new",
        permalink: "",
        shipping: {
          free_shipping: false,
        },
        pictures: product.thumbnail
          ? [{ id: "1", url: product.thumbnail }]
          : [],
        attributes: [],
      })),
      paging: {
        total: response.paging.total,
        offset: paging,
        limit: response.paging.pageSize,
        primary_results: response.paging.total,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return {
      results: [],
      paging: {
        total: 0,
        offset: paging,
        limit: 20,
        primary_results: 0,
      },
    };
  }
}

export async function getProduct(id: string | undefined) {
  if (!id) {
    throw new Error("ID do produto é obrigatório");
  }

  try {
    const product = await getProductById(id);

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      available_quantity: product.availableQuantity,
      thumbnail: product.thumbnail,
      condition: product.condition?.toLowerCase() || "new",
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      createdAt: product.createdAt,
      permalink: "",
      shipping: {
        free_shipping: false,
      },
      pictures: product.thumbnail
        ? [{ id: "1", url: product.thumbnail }]
        : [],
      // Dynamic attributes from backend (empty for now, will be populated when backend implements it)
      attributes: [],
      warranty: "Garantia de 90 dias",
      description: `Descrição detalhada do produto: ${product.title}`,
    };
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
}
