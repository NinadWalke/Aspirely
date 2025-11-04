import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  dob: string;
  profileImage?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setJwtToken: (token: string) => void;
  isLoggedIn: () => boolean;
}

export const useAuthState = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      
      login: (user, accessToken) =>
        set({ user, accessToken }),

      logout: () => set({ user: null, accessToken: null }),

      setJwtToken: (token) => set({ accessToken: token }),

      isLoggedIn: () =>
        Boolean(get().user && get().accessToken),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
