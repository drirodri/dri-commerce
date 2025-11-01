import { getAccessToken } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "SELLER";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const USERS_PATH = "/api/v1/users";

function getAuthHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function fetchUsers(
  page = 1,
  pageSize = 10
): Promise<UserListResponse> {
  const response = await fetch(
    `${API_BASE_URL}${USERS_PATH}?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(getAuthHeaders() ?? {}),
      },
    }
  );
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return await response.json();
}

export async function deactivateUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeaders() ?? {}),
    },
  });
  if (!response.ok) throw new Error("Erro ao desativar usuário");
}

export async function activateUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${id}/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeaders() ?? {}),
    },
  });
  if (!response.ok) throw new Error("Erro ao ativar usuário");
}

export async function updateUser(
  id: string,
  data: Partial<AdminUser>
): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeaders() ?? {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return await response.json();
}

export interface AdminUpdateUserData {
  name?: string;
  email?: string;
  role?: "ADMIN" | "CUSTOMER" | "SELLER";
  active?: boolean;
}

export async function adminUpdateUser(
  id: string,
  data: AdminUpdateUserData
): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${id}/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeaders() ?? {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return await response.json();
}
