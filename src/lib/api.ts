import type { ApiResponse } from "./types";
import { ApiError, isApiErrorResponse } from "./errors";

const SERVER_API_URL = process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";
const BROWSER_API_URL = "/api/backend";

function apiUrl() {
  return typeof window === "undefined" ? SERVER_API_URL : BROWSER_API_URL;
}

function isAuthRequest(path: string) {
  return path.startsWith("/auth/");
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiError(response.status, payload.message, payload.errors);
    }
    throw new ApiError(response.status, "The API request failed.");
  }
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
}

async function refreshAccessToken() {
  const response = await fetch(`${apiUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return response.ok;
}

async function request<T>(path: string, options: RequestInit = {}, canRefresh = true): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let response: Response;
  try {
    response = await fetch(`${apiUrl()}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Cannot reach the API. Check API_BASE_URL or the backend service.");
  }
  if (response.status === 401 && canRefresh && !isAuthRequest(path) && typeof window !== "undefined") {
    const refreshed = await refreshAccessToken().catch(() => false);
    if (refreshed) return request<T>(path, options, false);
  }
  return parseResponse<T>(response);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  form: <T>(path: string, body: FormData, method: "PATCH" | "POST" = "POST") => request<T>(path, { method, body }),
};

export const endpoints = {
  health: (test?: string) => api.get(`/health${test ? `?test=${encodeURIComponent(test)}` : ""}`),
  authMe: () => api.get("/auth-test/me"),
  profile: () => api.get("/users/me"),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
};
