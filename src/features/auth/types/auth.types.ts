import type { LoginResult, Role, User } from "@/lib/types";

export type AuthenticatedUser = Pick<User, "id" | "email" | "name" | "role" | "emailVerified" | "recruiterStatus">;
export type LoginResponse = LoginResult;
export type PublicRegistrationRole = "CANDIDATE" | "RECRUITER";

export interface LoginInput { email: string; password: string; }
export interface GoogleLoginInput { idToken?: string; credential?: string; }
export interface RegisterInput { name: string; email: string; password: string; role: PublicRegistrationRole; }
export interface VerifyEmailInput { email: string; otp: string; }
export interface DemoCredential { role: Role; label: string; email: string; password: string; }
