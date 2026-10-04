import type { Assessment, Attempt, Dashboard, Paginated, Problem, User } from "./types";
import { api } from "./api";

export const queries = {
  me: () => api.get<User>("/users/me"),
  adminDashboard: () => api.get<Dashboard>("/admin/dashboard"),
  adminUsers: (params = "") => api.get<Paginated<User>>(`/admin/users${params}`),
  applications: (params = "") => api.get<Paginated<User>>(`/admin/recruiter-applications${params}`),
  auditLogs: (params = "") => api.get<Paginated<Record<string, unknown>>>(`/admin/audit-logs${params}`),
  problems: (params = "") => api.get<Paginated<Problem>>(`/problems${params}`),
  problem: (id: string) => api.get<Problem>(`/problems/${id}`),
  assessments: (params = "") => api.get<Paginated<Assessment>>(`/assessments${params}`),
  assessment: (id: string) => api.get<Assessment>(`/assessments/${id}`),
  attempts: (params = "") => api.get<Paginated<Attempt>>(`/attempts${params}`),
  attempt: (id: string) => api.get<Attempt>(`/attempts/${id}`),
  invitations: (params = "") => api.get<Paginated<Record<string, unknown>>>(`/invitations/candidate-invitations${params}`),
  recruiterProfile: () => api.get<Record<string, unknown>>("/recruiters/me/profile"),
};
