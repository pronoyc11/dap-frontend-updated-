import type { Assessment, Attempt, Dashboard, Paginated, Pagination, Problem, User } from "./types";
import { api } from "./api";

export const queries = {
  me: () => api.get<User>("/users/me"),
  adminDashboard: () => api.get<Dashboard>("/admin/dashboard"),
  adminUsers: (params = "") => listQuery<User>(`/admin/users${params}`, "users"),
  applications: (params = "") => listQuery<User>(`/admin/recruiter-applications${params}`, "applications"),
  auditLogs: (params = "") => listQuery<Record<string, unknown>>(`/admin/audit-logs${params}`, "logs"),
  problems: (params = "") => listQuery<Problem>(`/problems${params}`, "problems"),
  problem: (id: string) => api.get<Problem>(`/problems/${id}`),
  assessments: (params = "") => listQuery<Assessment>(`/assessments${params}`, "assessments"),
  assessment: (id: string) => api.get<Assessment>(`/assessments/${id}`),
  attempts: async (params = "") => { const response = await api.get<{ attempts?: Attempt[]; items?: Attempt[]; pagination: Pagination }>(`/attempts${params}`); return { items: response.attempts ?? response.items ?? [], pagination: response.pagination }; },
  attempt: (id: string) => api.get<Attempt>(`/attempts/${id}`),
  invitations: (params = "") => listQuery<Record<string, unknown>>(`/invitations/candidate-invitations${params}`, "invitations"),
  recruiterProfile: () => api.get<Record<string, unknown>>("/recruiters/me/profile"),
};

async function listQuery<T>(path: string, key: string): Promise<Paginated<T>> {
  const response = await api.get<Record<string, unknown> & { pagination?: Paginated<T>["pagination"] }>(path);
  const values = response[key];
  return { items: Array.isArray(values) ? values as T[] : [], pagination: response.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 } };
}
