import axios from "axios";
import type { AxiosInstance } from "axios";
import { useAuthState } from "../store";

// Collect the environment of the React project
const ENVIRONMENT: string = import.meta.env.VITE_ENVIRONMENT || "development";

// Finalize the API base URL
const API_BASE: string =
  ENVIRONMENT === "development"
    ? (import.meta.env.VITE_API_URL_LOCAL as string)
    : (import.meta.env.VITE_API_URL_PROD as string);

// Create API instance for backend calls
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add a request interceptor to attach JWT from zustand store

api.interceptors.request.use(
  (config) => {
    const jwtToken = useAuthState.getState().jwtToken; // hook calls can only be done in React components. Therefore, we use .getState() from Zustand    
    if (jwtToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
