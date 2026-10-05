"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { BriefcaseBusiness, KeyRound, Shield, UserRound } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from "@/components/google-login";
import { Button, Card } from "@/components/ui";
import { api } from "@/lib/api";
import { markSession } from "@/lib/session";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const demos = [
  { label: "Admin", email: "pothikc11@gmail.com", password: "CandidatePass123!", icon: Shield },
  { label: "Recruiter", email: "pagolrevai@gmail.com", password: "CandidatePass456!", icon: BriefcaseBusiness },
  { label: "Candidate", email: "latifislamch76@gmail.com", password: "TestPass123!", icon: UserRound },
] as const;

function destination(role: string) {
  return role === "ADMIN" ? "/admin" : role === "RECRUITER" ? "/recruiter" : "/dashboard";
}

export default function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const form = useForm({
    defaultValues: credentials,
    onSubmit: async () => {
      const result = schema.safeParse(credentials);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Check your details";
        setError(message);
        toast.error(message);
        return;
      }
      await authenticate(result.data.email, result.data.password);
    },
  });

  async function authenticate(email: string, password: string) {
    setPending(true);
    setError("");
    queryClient.clear();
    try {
      const response = await api.post<{ user: import("@/lib/types").User }>("/auth/login", { email, password });
      markSession(response.user.role);
      setUser(response.user);
      toast.success("Signed in successfully");
      router.push(destination(response.user.role));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to sign in";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-[#07111f] px-4 py-8 sm:items-center sm:px-6 sm:py-12">
      <div className="w-full max-w-5xl min-w-0">
        <div className="mb-7 text-center sm:mb-8">
          <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950 sm:size-12">A</div>
          <h1 className="mt-4 text-3xl font-black text-white sm:mt-5 sm:text-4xl">Welcome back</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400 sm:text-base">Sign in to your assessment workspace.</p>
        </div>

        <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Card className="min-w-0 p-4 sm:p-6">
            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
              }}
            >
              <label className="block text-sm font-semibold text-slate-200">
                Email
                <input
                  autoComplete="email"
                  type="email"
                  className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 text-base text-white outline-none focus:border-cyan-300/60"
                  value={credentials.email}
                  onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                />
              </label>
              <label className="block text-sm font-semibold text-slate-200">
                Password
                <input
                  autoComplete="current-password"
                  type="password"
                  className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 text-base text-white outline-none focus:border-cyan-300/60"
                  value={credentials.password}
                  onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                />
              </label>
              <div className="-mt-1 text-right">
                <Link className="text-sm font-semibold text-cyan-300 hover:text-cyan-200" href="/forgot-password">Forgot password?</Link>
              </div>
              {error && <p role="alert" className="break-anywhere text-sm leading-6 text-rose-300">{error}</p>}
              <Button disabled={pending} className="h-12 w-full">
                {pending ? "Signing in…" : <><KeyRound className="mr-2 size-4" />Sign in</>}
              </Button>
            </form>

            <div className="my-5 sm:my-6"><GoogleLogin onSuccess={(role) => { queryClient.clear(); markSession(role as import("@/lib/types").Role); toast.success("Signed in with Google"); router.push(destination(role)); }} onError={(message) => { setError(message); toast.error(message); }} /></div>
            <p className="text-center text-sm leading-6 text-slate-500">No account? <Link className="font-semibold text-cyan-300" href="/register">Create one</Link></p>
          </Card>

          <Card className="min-w-0 p-4 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-cyan-300 sm:tracking-[.2em]">Quick demo login</p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">Use seeded accounts to inspect the complete role-based experience.</p>
            <div className="mt-5 grid gap-2.5 sm:mt-6 sm:gap-3">
              {demos.map(({ label, email, password, icon: Icon }) => (
                <button key={label} type="button" disabled={pending} onClick={() => void authenticate(email, password)} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3 text-left transition hover:border-cyan-300/50 sm:gap-4 sm:p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 sm:size-11"><Icon className="size-5" /></span>
                  <span className="min-w-0"><span className="block truncate font-bold text-white">Continue as {label}</span><span className="block truncate text-xs text-slate-500">{email}</span></span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
