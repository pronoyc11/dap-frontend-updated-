"use client";

import { BriefcaseBusiness, LoaderCircle, Shield, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { useLogin } from "../hooks/use-auth";
import { dashboardForRole } from "../utils/auth.utils";
import type { DemoCredential } from "../types/auth.types";

const demos: readonly (DemoCredential & { icon: typeof Shield })[] = [
  { role: "ADMIN", label: "Continue as Admin", email: "admin@example.com", password: "AdminPass123!", icon: Shield },
  { role: "RECRUITER", label: "Continue as Recruiter", email: "recruiter@example.com", password: "RecruiterPass123!", icon: BriefcaseBusiness },
  { role: "CANDIDATE", label: "Continue as Candidate", email: "candidate@example.com", password: "CandidatePass123!", icon: UserRound },
];

export function DemoLoginButtons() {
  const mutation = useLogin();
  const router = useRouter();
  return <div className="grid gap-2">{demos.map(({ label, email, password, icon: Icon }) => <Button key={label} type="button" variant="secondary" disabled={mutation.isPending} className="justify-start" onClick={() => mutation.mutate({ email, password }, { onSuccess: (result) => router.replace(dashboardForRole(result.role)), onError: (error) => toast.error(error instanceof Error ? error.message : "Demo sign-in failed") })}><Icon className="mr-3 size-4 text-cyan-300" />{mutation.isPending && mutation.variables?.email === email ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Signing in…</> : label}</Button>)}</div>;
}
