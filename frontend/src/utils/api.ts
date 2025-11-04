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

// Refresh token setup
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });

  failedQueue = [];
};

// Add a request interceptor to attach JWT from zustand store
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthState.getState().accessToken; // hook calls can only be done in React components. Therefore, we use .getState() from Zustand    
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh token resend logic
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await api.post("/auth/refresh");
          const newToken = data.data.accessToken;

          useAuthState.getState().setJwtToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);

          return api(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          useAuthState.getState().logout();
          window.location.href = "/login";
          throw refreshErr;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    return Promise.reject(err);
  }
);
