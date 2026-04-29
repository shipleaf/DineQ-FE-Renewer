import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});

export const apiClient = {
  get: <T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ) => instance.get<T>(url, { params, headers }),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ) => instance.post<T>(url, data, { headers }),

  put: <T = unknown>(url: string, data?: unknown) => instance.put<T>(url, data),

  delete: <T = unknown>(url: string) => instance.delete<T>(url),
};

export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
