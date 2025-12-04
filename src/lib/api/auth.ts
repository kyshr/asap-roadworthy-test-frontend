import api from "../api";
import { IUser } from "@/types";

interface LoginRequest {
  email?: string;
  phoneNumber?: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role?: "user" | "admin";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
  };
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<IUser> => {
    const response = await api.get<{ success: boolean; data: { user: IUser } }>("/auth/me");
    return response.data.data.user;
  },
};
