import type { Role, User } from "@/lib/types";

export const dashboardByRole: Record<Role, string> = {
  ADMIN: "/admin",
  RECRUITER: "/recruiter",
  CANDIDATE: "/dashboard",
};

export function dashboardForRole(role: Role) {
  return dashboardByRole[role];
}

export function dashboardForUser(user: Pick<User, "role">) {
  return dashboardForRole(user.role);
}

export function hasRole(user: Pick<User, "role"> | null | undefined, role: Role) {
  return user?.role === role;
}

export function canAccessRole(user: Pick<User, "role"> | null | undefined, roles: readonly Role[]) {
  return Boolean(user && roles.includes(user.role));
}

export function safeNextPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
