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

export interface InvitedCandidateInvitation {
  id: string;
  status: "PENDING" | "ACCEPTED" | "USED";
  createdAt?: string;
  acceptedAt?: string | null;
  expiresAt?: string | null;
  assessment: {
    id: string;
    title: string;
    passingScore: number;
    durationMinutes: number;
  };
  attempt: {
    id: string;
    status: Attempt["status"];
    startedAt?: string | null;
    submittedAt?: string | null;
    evaluatedAt?: string | null;
    totalScore: number;
    maxScore: number;
    passed: boolean;
  } | null;
}

export interface InvitedCandidate extends User {
  invitations: InvitedCandidateInvitation[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface Problem {
  id: string;
  title: string;
  question: string;
  type: "MCQ" | "WRITTEN";
  options: string[];
  correctAnswer?: string | null;
  expectedAnswer?: string | null;
  points: number;
  createdAt?: string;
}
export interface Assessment {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  status: "DRAFT" | "READY" | "PUBLISHED" | "CLOSED";
  itemCount?: number;
  createdAt?: string;
  items?: AssessmentItem[];
}
export interface AssessmentItem {
  id: string;
  problemId?: string;
  order: number;
  title: string;
  question: string;
  type: "MCQ" | "WRITTEN";
  options: string[];
  points: number;
}
export interface Attempt {
  id: string;
  assessmentId: string;
  assessment?: Assessment;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED" | "CANCELLED";
  score?: number | null;
  totalScore?: number;
  maxScore?: number;
  passed?: boolean | null;
  result?: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    passingScore: number;
    passed: boolean;
  };
  deadline?: string;
  remainingTimeSeconds?: number;
  startedAt?: string;
  submittedAt?: string;
  answers?: { assessmentItemId: string; answer: string; score?: number; status: string }[];
}
export interface Dashboard {
  users: {
    total: number;
    candidates: number;
    recruiters: number;
    admins: number;
    active: number;
    blocked: number;
  };
  assessments: { total: number; published: number };
  attempts: { total: number };
  payments: { total: number; paid: number };
}
