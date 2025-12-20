/**
 * Category Service - Serviço de categorias para comunicação com o backend
 *
 * Este serviço gerencia todas as operações relacionadas a categorias:
 * - Listar categorias (público)
 * - Buscar categoria por ID (público)
 * - Criar categoria (ADMIN)
 * - Atualizar categoria (ADMIN)
 * - Deletar categoria (ADMIN)
 *
 * Endpoints disponíveis no CategoryController:
 * - GET /api/v1/categories - Listar todas as categorias
 * - GET /api/v1/categories/{id} - Buscar categoria por ID
 * - POST /api/v1/categories - Criar categoria
 * - PUT /api/v1/categories/{id} - Atualizar categoria
 * - DELETE /api/v1/categories/{id} - Deletar categoria
 */

import { authenticatedFetch } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const CATEGORIES_PATH = "/api/v1/categories";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
  total: number;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Lista todas as categorias
 *
 * Endpoint público - não requer autenticação
 *
 * @returns Lista de categorias
 * @throws Error se houver erro na busca
 */
export async function listCategories(): Promise<CategoryListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${CATEGORIES_PATH}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await handleErrorResponse(response, "listar categorias");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao listar categorias.");
  }
}

/**
 * Busca uma categoria por ID
 *
 * Endpoint público - não requer autenticação
 *
 * @param id - ID da categoria
 * @returns Dados da categoria
 * @throws Error se categoria não for encontrada
 */
export async function getCategoryById(id: number): Promise<CategoryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${CATEGORIES_PATH}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await handleErrorResponse(response, "buscar categoria");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao buscar categoria.");
  }
}

/**
 * Cria uma nova categoria
 *
 * Requer autenticação com role ADMIN
 *
 * @param category - Dados da categoria a ser criada
 * @returns Categoria criada
 * @throws Error se houver erro na criação ou usuário não autorizado
 */
export async function createCategory(
  category: CreateCategoryRequest
): Promise<CategoryResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${CATEGORIES_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "criar categoria");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao criar categoria.");
  }
}

/**
 * Atualiza uma categoria existente
 *
 * Requer autenticação com role ADMIN
 *
 * @param id - ID da categoria a ser atualizada
 * @param category - Dados da categoria a serem atualizados
 * @returns Categoria atualizada
 * @throws Error se houver erro na atualização ou categoria não encontrada
 */
export async function updateCategory(
  id: number,
  category: UpdateCategoryRequest
): Promise<CategoryResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${CATEGORIES_PATH}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "atualizar categoria");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao atualizar categoria.");
  }
}

/**
 * Deleta uma categoria
 *
 * Requer autenticação com role ADMIN
 *
 * @param id - ID da categoria a ser deletada
 * @returns Mensagem de sucesso
 * @throws Error se houver erro na deleção ou categoria não encontrada
 */
export async function deleteCategory(id: number): Promise<MessageResponse> {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}${CATEGORIES_PATH}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response, "deletar categoria");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao deletar categoria.");
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
    // Ignora erro ao parsear JSON
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
      throw new Error("Categoria não encontrada.");
    case 409:
      throw new Error(errorMessage || "Conflito ao processar a requisição.");
    case 500:
      throw new Error("Erro no servidor. Tente novamente mais tarde.");
    default:
      throw new Error(errorMessage);
  }
}
