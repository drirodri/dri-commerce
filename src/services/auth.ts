/**
 * Auth Service - Serviço de autenticação para comunicação com o backend
 *
 * Estratégia de autenticação:
 * - Access token armazenado no localStorage (fácil acesso, mas vulnerável a XSS)
 * - Refresh token armazenado no localStorage
 * - Tokens enviados via header Authorization: Bearer <token>
 *
 * Endpoints:
 * - POST /api/v1/auth/login - Autentica usuário e retorna tokens JWT
 * - POST /api/v1/auth/refresh - Renova o access token
 * - POST /api/v1/auth/logout - Limpa tokens
 * - GET /api/v1/auth/me - Retorna dados do usuário autenticado
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const AUTH_PATH = "/api/v1/auth";

/**
 * Realiza login do usuário
 *
 * @param credentials - Email e senha do usuário
 * @returns Tokens de autenticação
 * @throws Error se as credenciais forem inválidas ou houver erro na API
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${AUTH_PATH}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erro ao fazer login" }));
    throw new Error(error.message || "Credenciais inválidas");
  }

  const data: LoginResponse = await response.json();

  saveTokens(data.token, data.refreshToken);

  return data;
}

/**
 * Renova o access token usando o refresh token
 *
 * @returns Novo access token
 * @throws Error se o refresh token for inválido ou expirado
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_PATH}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    const error = await response
      .json()
      .catch(() => ({ message: "Erro ao renovar token" }));
    throw new Error(error.message || "Token inválido ou expirado");
  }

  const data: RefreshTokenResponse = await response.json();

  // Atualiza apenas o access token
  localStorage.setItem(ACCESS_TOKEN_KEY, data.token);

  return data;
}

/**
 * Busca os dados do usuário autenticado
 *
 * @returns Dados do usuário atual
 * @throws Error se o token for inválido ou expirado
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Token não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_PATH}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erro ao buscar usuário" }));
    throw new Error(error.message || "Não autorizado");
  }

  return response.json();
}

/**
 * Realiza logout do usuário
 *
 * Remove os tokens do localStorage
 */
export async function logout(): Promise<void> {
  // Limpa os tokens localmente
  clearTokens();

  // Opcionalmente, pode chamar o endpoint de logout no backend
  try {
    await fetch(`${API_BASE_URL}${AUTH_PATH}/logout`, {
      method: "POST",
    });
  } catch (error) {
    // Ignora erros do backend no logout
    console.warn("Erro ao notificar logout no backend:", error);
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/**
 * Helper para fazer requisições autenticadas
 *
 * Adiciona automaticamente o token de autorização do localStorage
 * Use esta função para qualquer requisição que precise de autenticação
 *
 * @param url - URL da requisição
 * @param options - Opções do fetch
 * @returns Response do fetch
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Salva os tokens no localStorage
 */
function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Obtém o access token do localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Obtém o refresh token do localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Remove os tokens do localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
