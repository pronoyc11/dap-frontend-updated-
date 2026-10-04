export type Role = "CANDIDATE" | "RECRUITER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";
export type RecruiterStatus = "NOT_REQUESTED" | "PENDING" | "APPROVED";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  recruiterStatus: RecruiterStatus;
  status: UserStatus;
  avatarUrl: string | null;
  emailVerified: boolean;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> { success: true; message: string; data: T; }
export interface ApiErrorResponse { success: false; message: string; errors: unknown[]; }
export interface Pagination { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean; }
export interface Paginated<T> { items: T[]; pagination: Pagination; }

export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface LoginResult extends AuthTokens { user: Pick<User, "id" | "email" | "name" | "role" | "emailVerified" | "recruiterStatus">; }

export interface Problem { id: string; title: string; question: string; type: "MCQ" | "WRITTEN"; options: string[]; correctAnswer?: string | null; expectedAnswer?: string | null; points: number; createdAt?: string; }
export interface Assessment { id: string; title: string; description: string; durationMinutes: number; passingScore: number; status: "DRAFT" | "READY" | "PUBLISHED" | "CLOSED"; itemCount?: number; createdAt?: string; items?: AssessmentItem[]; }
export interface AssessmentItem { id: string; order: number; title: string; question: string; type: "MCQ" | "WRITTEN"; options: string[]; points: number; }
export interface Attempt { id: string; assessmentId: string; assessment?: Assessment; status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED"; score?: number | null; maxScore?: number; passed?: boolean | null; deadline?: string; }
export interface Dashboard { users: Record<string, number>; assessments: number; publishedAssessments: number; attempts: number; payments: number; paidPayments: number; }
