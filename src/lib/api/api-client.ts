import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { createClient } from "@/lib/supabase/client";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const supabase = createClient();
        await supabase.auth.signOut();

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      return Promise.reject({
        status: error.response.status,
        message,
        data: error.response.data,
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message:
          "Cannot connect to server. Please check your internet connection.",
      });
    }

    return Promise.reject({
      status: 0,
      message: error.message || "An unexpected error occurred",
    });
  },
);

export default axiosInstance;
