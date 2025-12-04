import { create } from "zustand";
import { IUser } from "@/types";
import { authApi } from "@/lib/api/auth";

interface AuthStore {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  checkAuth: async () => {
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If getMe fails, user is not authenticated
      // httpOnly cookies are managed server-side
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails, clear local state
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
