import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../utils";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  dob: string; // backend sends ISO string; convert to Date if needed
  profileImage?: string | null;
  createdAt: string;
}

interface AuthResponse {
  isAuth: boolean;
  user: User;
}

interface AuthState {
  user: User | null;
  jwtToken: string | null;
  login: (user: User, jwtToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isLoggedIn: () => boolean;
}

export const useAuthState = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, // set user to null default
      jwtToken: null, // set jwt token to null default
      login: (user, jwtToken) => set({ user, jwtToken }), // log user in at login page

      logout: () => set({ user: null, jwtToken: null }), // log user out at profile page

      checkAuth: async () => {
        // check if current user is authenticated
        const token = get().jwtToken;
        if (!token) return get().logout();
        try {
          const { data } = await api.get<AuthResponse>("/auth"); // call the get /auth with headers from api.ts (localStorage)
          if (data.isAuth) {
            set({ user: data.user });
          } else {
            get().logout();
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          get().logout();
        }
      },

      isLoggedIn: () => !!get().user && !!get().jwtToken, // check if the user is logged in by two conditions:
      // we have the user && the token
    }),
    {
      name: "auth-storage",  // name in localStorage
    }
  )
);
