/**
 * Product Service - Serviço de produtos para comunicação com o backend
 *
 * Este serviço gerencia todas as operações relacionadas a produtos:
 * - Criar produto (SELLER, ADMIN)
 * - Atualizar produto (SELLER, ADMIN)
 * - Buscar produto por ID (público)
 * - Listar produtos com paginação (público)
 * - Ativar produto (SELLER, ADMIN)
 * - Desativar produto (SELLER, ADMIN)
 * - Deletar produto (ADMIN)
 *
 * Endpoints disponíveis no ProductController:
 * - POST /api/v1/products - Criar produto
 * - PUT /api/v1/products/{id} - Atualizar produto
 * - GET /api/v1/products/{id} - Buscar produto por ID
 * - GET /api/v1/products - Listar produtos com paginação
 * - PATCH /api/v1/products/{id}/activate - Ativar produto
 * - PATCH /api/v1/products/{id}/deactivate - Desativar produto
 * - DELETE /api/v1/products/{id} - Deletar produto
 */

import { authenticatedFetch } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const PRODUCTS_PATH = "/api/v1/products";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CreateProductRequest {
  title: string;
  price: number;
  thumbnail: string;
  availableQuantity: number;
  condition: "NEW" | "USED";
  categoryId: string;
}

export interface UpdateProductRequest {
  title?: string;
  price?: number;
  thumbnail?: string;
  availableQuantity?: number;
  condition?: "NEW" | "USED";
  categoryId?: string;
}

export interface ProductResponse {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  availableQuantity: number;
  condition: "NEW" | "USED";
  categoryId: string;
  sellerId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageRequest {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
}

export interface PageResponse<T> {
  content: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListResponse {
  results: ProductResponse[];
  paging: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Cria um novo produto
 *
 * Requer autenticação com role SELLER ou ADMIN
 *
 * @param product - Dados do produto a ser criado
 * @returns Produto criado
 * @throws Error se houver erro na criação ou usuário não autorizado
 */
export async function createProduct(
  product: CreateProductRequest
): Promise<ProductResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${PRODUCTS_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "criar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao criar produto.");
  }
}

/**
 * Atualiza um produto existente
 *
 * Requer autenticação com role SELLER ou ADMIN
 *
 * @param id - ID do produto a ser atualizado
 * @param product - Dados do produto a serem atualizados
 * @returns Produto atualizado
 * @throws Error se houver erro na atualização ou produto não encontrado
 */
export async function updateProduct(
  id: string,
  product: UpdateProductRequest
): Promise<ProductResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${PRODUCTS_PATH}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "atualizar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao atualizar produto.");
  }
}

/**
 * Busca um produto por ID
 *
 * Endpoint público - não requer autenticação
 *
 * @param id - ID do produto
 * @returns Dados do produto
 * @throws Error se produto não for encontrado
 */
export async function getProductById(id: string): Promise<ProductResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${PRODUCTS_PATH}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await handleErrorResponse(response, "buscar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao buscar produto.");
  }
}

/**
 * Lista todos os produtos com paginação
 *
 * Endpoint público - não requer autenticação
 *
 * @param params - Parâmetros de paginação (page, pageSize) e filtros (categoryId, search)
 * @returns Lista de produtos paginada
 * @throws Error se houver erro na busca
 */
export async function listProducts(
  params: PageRequest = {}
): Promise<ProductListResponse> {
  try {
    const { page = 0, pageSize = 20, categoryId, search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (categoryId) {
      queryParams.append("categoryId", categoryId);
    }

    if (search) {
      queryParams.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}${PRODUCTS_PATH}?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "listar produtos");
    }

    // Backend retorna com estrutura diferente, precisamos mapear
    const data = await response.json();

    // Mapeia a resposta do backend para o formato esperado pelo frontend
    return {
      results: data.products || [],
      paging: {
        total: data.totalElements || 0,
        page: data.currentPage || 0,
        pageSize: data.pageSize || 0,
        totalPages: data.totalPages || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao listar produtos.");
  }
}

/**
 * Ativa um produto
 *
 * Requer autenticação com role SELLER ou ADMIN
 *
 * @param id - ID do produto a ser ativado
 * @returns Produto ativado
 * @throws Error se houver erro na ativação ou produto não encontrado
 */
export async function activateProduct(id: string): Promise<ProductResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${PRODUCTS_PATH}/${id}/activate`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "ativar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao ativar produto.");
  }
}

/**
 * Desativa um produto
 *
 * Requer autenticação com role SELLER ou ADMIN
 *
 * @param id - ID do produto a ser desativado
 * @returns Produto desativado
 * @throws Error se houver erro na desativação ou produto não encontrado
 */
export async function deactivateProduct(id: string): Promise<ProductResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${PRODUCTS_PATH}/${id}/deactivate`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "desativar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao desativar produto.");
  }
}

/**
 * Deleta um produto (soft delete via desativação)
 *
 * Requer autenticação com role ADMIN
 *
 * @param id - ID do produto a ser deletado
 * @returns Mensagem de sucesso
 * @throws Error se houver erro na deleção ou usuário não autorizado
 */
export async function deleteProduct(id: string): Promise<MessageResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${PRODUCTS_PATH}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "deletar produto");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao deletar produto.");
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Trata erros de resposta HTTP
 *
 * @param response - Resposta HTTP
 * @param action - Ação sendo executada (para mensagem de erro)
 * @throws Error com mensagem apropriada
 */
async function handleErrorResponse(
  response: Response,
  action: string
): Promise<never> {
  let errorMessage = `Erro ao ${action}.`;

  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    // Se não conseguir parsear o JSON, usa mensagens padrão
  }

  switch (response.status) {
    case 400:
      throw new Error(
        errorMessage || "Dados inválidos. Verifique os campos obrigatórios."
      );
    case 401:
      throw new Error("Não autorizado. Faça login novamente para continuar.");
    case 403:
      throw new Error(
        "Acesso negado. Você não tem permissão para esta operação."
      );
    case 404:
      throw new Error("Produto não encontrado.");
    case 409:
      throw new Error(errorMessage || "Conflito ao processar a requisição.");
    case 500:
      throw new Error("Erro no servidor. Tente novamente mais tarde.");
    default:
      throw new Error(errorMessage);
  }
}
