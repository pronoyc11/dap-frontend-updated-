export const queryKeys = {
  health: ["health"] as const,
  auth: {
    root: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },
  candidate: {
    root: ["candidate"] as const,
    invitations: (filters = "") => ["candidate", "invitations", filters] as const,
    attempts: (filters = "") => ["candidate", "attempts", filters] as const,
  },
  recruiter: {
    root: ["recruiter"] as const,
    assessments: (filters = "") => ["recruiter", "assessments", filters] as const,
    submissions: (filters = "") => ["recruiter", "submissions", filters] as const,
  },
  admin: {
    root: ["admin"] as const,
    users: (filters = "") => ["admin", "users", filters] as const,
    auditLogs: (filters = "") => ["admin", "audit-logs", filters] as const,
  },
} as const;
