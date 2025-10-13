/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock data imports
import categoriesMock from "../__mocks__/categories";
import queryMock from "../__mocks__/query";

export async function getCategories() {
  // Simulando delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  return categoriesMock;
}

export async function getProductsFromCategoryAndQuery(
  _categoryId: string,
  _query: string,
  paging: number
) {
  // Simulando delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Retornando o mock com paging ajustado
  return {
    ...queryMock,
    paging: {
      ...queryMock.paging,
      offset: paging,
    },
  };
}

export async function getProduct(id: string | undefined) {
  // Simulando delay de rede
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Retornando um produto mock baseado no id
  const mockProduct =
    queryMock.results.find((p: any) => p.id === id) || queryMock.results[0];

  return {
    ...mockProduct,
    // Adicionando campos extras que podem estar na resposta de produto individual
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
