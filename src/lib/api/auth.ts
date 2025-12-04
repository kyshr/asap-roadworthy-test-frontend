import api from "../api";
import Cookies from "js-cookie";
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
    token: string;
    user: IUser;
  };
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    if (response.data.data.token) {
      Cookies.set("token", response.data.data.token, { expires: 7 });
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.data.token) {
      Cookies.set("token", response.data.data.token, { expires: 7 });
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      Cookies.remove("token");
    }
  },

  getMe: async (): Promise<IUser> => {
    const response = await api.get<{ success: boolean; data: { user: IUser } }>("/auth/me");
    return response.data.data.user;
  },
};
