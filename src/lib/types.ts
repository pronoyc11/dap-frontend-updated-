export type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";
export type Status = "ACTIVE" | "BLOCKED" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  emailVerified?: boolean;
  recruiterStatus?: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface ApiResponse<T> { success: boolean; message: string; data: T; }
export interface Pagination { page: number; limit: number; total: number; totalPages: number; }
export interface Paginated<T> { items: T[]; pagination: Pagination; }

export interface Problem { id: string; title: string; question: string; type: "MCQ" | "WRITTEN"; options: string[]; correctAnswer?: string | null; expectedAnswer?: string | null; points: number; createdAt?: string; }
export interface Assessment { id: string; title: string; description: string; durationMinutes: number; passingScore: number; status: "DRAFT" | "READY" | "PUBLISHED" | "CLOSED"; itemCount?: number; createdAt?: string; items?: AssessmentItem[]; }
export interface AssessmentItem { id: string; order: number; title: string; question: string; type: "MCQ" | "WRITTEN"; options: string[]; points: number; }
export interface Attempt { id: string; assessmentId: string; assessment?: Assessment; status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED"; score?: number | null; maxScore?: number; passed?: boolean | null; deadline?: string; }
export interface Dashboard { users: Record<string, number>; assessments: number; publishedAssessments: number; attempts: number; payments: number; paidPayments: number; }
