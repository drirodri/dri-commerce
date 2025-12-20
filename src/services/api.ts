import queryMock from "../__mocks__/query";
import { listCategories as fetchCategories } from "./category";

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
  _categoryId: string,
  _query: string,
  paging: number
) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    ...queryMock,
    paging: {
      ...queryMock.paging,
      offset: paging,
    },
  };
}

export async function getProduct(id: string | undefined) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const mockProduct =
    queryMock.results.find((p: any) => p.id === id) || queryMock.results[0];

  return {
    ...mockProduct,
    pictures: [
      {
        id: "1",
        url: mockProduct.thumbnail,
      },
      {
        id: "2",
        url: mockProduct.thumbnail,
      },
    ],
    warranty: "Garantia de 90 dias",
    description: `Descrição detalhada do produto: ${mockProduct.title}`,
  };
}
