import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Create account", robots: { index: false, follow: false } };

export default function RegisterPage() {
  return <AuthShell title="Create your workspace" description="Join Atlas as a candidate or recruiting team."><RegisterForm /></AuthShell>;
}
