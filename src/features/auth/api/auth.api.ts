import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import type { GoogleLoginInput, LoginInput, LoginResponse, RegisterInput, VerifyEmailInput } from "../types/auth.types";

export const authApi = {
  login: async (input: LoginInput) => (await api.post<LoginResponse>("/auth/login", input)).user,
  googleLogin: async (input: GoogleLoginInput) => (await api.post<LoginResponse>("/auth/google", input)).user,
  register: (input: RegisterInput) => api.post<{ email: string; emailVerified: false; message: string }>("/auth/register", input),
  verifyEmail: (input: VerifyEmailInput) => api.post<unknown>("/auth/verify-email", input),
  currentUser: () => api.get<User>("/users/me"),
  authenticatedIdentity: () => api.get<User>("/auth-test/me"),
  logout: () => api.post<null>("/auth/logout"),
};
