import type { ApiResponse } from "./types";

const API_URL = process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";
const BROWSER_API_URL = "/api/backend";

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = typeof window === "undefined" ? API_URL : BROWSER_API_URL;
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, credentials: "include", headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers }, cache: "no-store" });
  } catch {
    throw new ApiError(0, "Cannot reach the API. Check API_BASE_URL or the backend service.");
  }
  const payload = (await response.json().catch(() => ({}))) as Partial<ApiResponse<T>> & { message?: string };
  if (!response.ok) throw new ApiError(response.status, payload.message ?? "Request failed");
  return (payload.data ?? payload) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  form: <T>(path: string, body: FormData, method: "PATCH" | "POST" = "POST") => requestForm<T>(path, body, method),
};

// Complete backend contract map. UI modules call these through the same
// credentialed client, so new screens do not need to duplicate fetch logic.
export const endpoints = {
  health: (test?: string) => api.get(`/health${test ? `?test=${encodeURIComponent(test)}` : ""}`), register: (body: unknown) => api.post("/auth/register", body), verifyEmail: (body: unknown) => api.post("/auth/verify-email", body), resendVerification: (body: unknown) => api.post("/auth/resend-verification", body), forgotPassword: (body: unknown) => api.post("/auth/forgot-password", body), resetPassword: (body: unknown) => api.post("/auth/reset-password", body), login: (body: unknown) => api.post("/auth/login", body), googleLogin: (body: unknown) => api.post("/auth/google", body), refresh: (body?: unknown) => api.post("/auth/refresh", body), logout: (body?: unknown) => api.post("/auth/logout", body), authMe: () => api.get("/auth-test/me"), profile: () => api.get("/users/me"), updateProfile: (body: unknown) => api.patch("/users/me", body), changePassword: (body: unknown) => api.patch("/users/me/password", body), uploadAvatar: (body: FormData) => requestForm("/users/me/avatar", body, "PATCH"), recruiterProfile: () => api.get("/recruiters/me/profile"), updateRecruiterProfile: (body: unknown) => api.patch("/recruiters/me/profile", body), uploadCompanyLogo: (body: FormData) => requestForm("/recruiters/me/profile/logo", body, "PATCH"),
  problems: (params = "") => api.get(`/problems${params}`), problem: (id: string) => api.get(`/problems/${id}`), createProblem: (body: unknown) => api.post("/problems", body), updateProblem: (id: string, body: unknown) => api.patch(`/problems/${id}`, body), deleteProblem: (id: string) => api.del(`/problems/${id}`), assessments: (params = "") => api.get(`/assessments${params}`), assessment: (id: string) => api.get(`/assessments/${id}`), createAssessment: (body: unknown) => api.post("/assessments", body), updateAssessment: (id: string, body: unknown) => api.patch(`/assessments/${id}`, body), deleteAssessment: (id: string) => api.del(`/assessments/${id}`), addItem: (id: string, body: unknown) => api.post(`/assessments/${id}/items`, body), addItemsBulk: (id: string, body: unknown) => api.post(`/assessments/${id}/items/bulk`, body), reorderItems: (id: string, body: unknown) => api.patch(`/assessments/${id}/items/reorder`, body), updateItem: (assessmentId: string, itemId: string, body: unknown) => api.patch(`/assessments/${assessmentId}/items/${itemId}`, body), deleteItem: (assessmentId: string, itemId: string) => api.del(`/assessments/${assessmentId}/items/${itemId}`), markReady: (id: string) => api.post(`/assessments/${id}/ready`), payment: (id: string) => api.post(`/assessments/${id}/payment`), createInvitation: (assessmentId: string, body: unknown) => api.post(`/assessments/${assessmentId}/invitations`, body), assessmentInvitations: (id: string, params = "") => api.get(`/assessments/${id}/invitations${params}`), assessmentSubmissions: (id: string, params = "") => api.get(`/assessments/${id}/submissions${params}`), invitation: (id: string) => api.get(`/invitations/${id}`), acceptInvitation: (token: string) => api.post(`/invitations/${token}/accept`), startInvitation: (token: string) => api.post(`/invitations/${token}/start`), deleteInvitation: (id: string) => api.del(`/invitations/${id}`), attempts: (params = "") => api.get(`/attempts${params}`), attempt: (id: string) => api.get(`/attempts/${id}`), submitAttempt: (id: string, body: unknown) => api.post(`/attempts/${id}/submit`, body), evaluateSubmission: (id: string, body: unknown) => api.patch(`/submissions/${id}/evaluate`, body), adminDashboard: () => api.get("/admin/dashboard"), adminUsers: (params = "") => api.get(`/admin/users${params}`), adminUser: (id: string) => api.get(`/admin/users/${id}`), updateUserStatus: (id: string, body: unknown) => api.patch(`/admin/users/${id}/status`, body), auditLogs: (params = "") => api.get(`/admin/audit-logs${params}`), auditLog: (id: string) => api.get(`/admin/audit-logs/${id}`), recruiterApplications: (params = "") => api.get(`/admin/recruiter-applications${params}`), approveRecruiter: (id: string) => api.patch(`/admin/recruiter-applications/${id}/approve`),
};

async function requestForm<T>(path: string, body: FormData, method: "PATCH" | "POST") { const baseUrl = typeof window === "undefined" ? API_URL : BROWSER_API_URL; let response: Response; try { response = await fetch(`${baseUrl}${path}`, { method, body, credentials: "include", cache: "no-store" }); } catch { throw new ApiError(0, "Cannot reach the API. Start Assingment6 on port 5000 or check NEXT_PUBLIC_API_URL."); } const payload = (await response.json().catch(() => ({}))) as Partial<ApiResponse<T>> & { message?: string }; if (!response.ok) throw new ApiError(response.status, payload.message ?? "Request failed"); return (payload.data ?? payload) as T; }

export { API_URL };
