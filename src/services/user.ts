export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole["value"];
}

export interface UserRole {
  value: "ADMIN" | "SELLER" | "CUSTOMER";
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole["value"];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const USERS_PATH = "/api/v1/users";

export async function createUser(user: User): Promise<CreateUserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${USERS_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Dados inválidos. Verifique os campos obrigatórios.");
      }

      if (response.status === 409) {
        throw new Error(
          "Email ou senha inválidos. Verifique os dados e tente novamente."
        );
      }

      if (response.status === 500) {
        throw new Error("Erro no servidor. Tente novamente mais tarde.");
      }

      throw new Error("Erro ao criar usuário. Tente novamente.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido ao criar usuário.");
  }
}
