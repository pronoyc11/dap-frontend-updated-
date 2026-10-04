"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { KeyRound, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { loginSchema } from "../schemas/auth.schemas";
import { useLogin } from "../hooks/use-auth";
import { dashboardForRole, safeNextPath } from "../utils/auth.utils";
import { GoogleSignInButton } from "./google-sign-in-button";
import { DemoLoginButtons } from "./demo-login-buttons";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"), "");
  const mutation = useLogin();
  const [formError, setFormError] = useState("");
  const form = useForm({ defaultValues: { email: "", password: "" }, onSubmit: async ({ value }) => { const result = loginSchema.safeParse(value); if (!result.success) { setFormError(result.error.issues[0]?.message ?? "Check your details"); return; } setFormError(""); mutation.mutate(result.data, { onSuccess: (data) => { toast.success("Welcome back"); router.replace(next || dashboardForRole(data.role)); }, onError: (error) => setFormError(error instanceof Error ? error.message : "Unable to sign in") }); } });
  return <>
    <form className="mt-8 space-y-5" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}>
      <label className="block text-sm font-semibold text-slate-200" htmlFor="email">Email<input id="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("email")} onChange={(event) => form.setFieldValue("email", event.target.value)} /></label>
      <label className="block text-sm font-semibold text-slate-200" htmlFor="password">Password<input id="password" name="password" autoComplete="current-password" type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("password")} onChange={(event) => form.setFieldValue("password", event.target.value)} /></label>
      {formError && <p role="alert" className="text-sm text-rose-300">{formError}</p>}
      <Button disabled={mutation.isPending} className="w-full">{mutation.isPending ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Signing in…</> : <><KeyRound className="mr-2 size-4" />Sign in</>}</Button>
    </form>
    <div className="my-7 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" /></div>
    <GoogleSignInButton />
    <div className="mt-8 border-t border-white/10 pt-6"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">Development demos</p><p className="mt-2 text-sm text-slate-400">These use the seeded Assignment 6 accounts.</p><div className="mt-4"><DemoLoginButtons /></div></div>
    <p className="mt-6 text-center text-sm text-slate-500">No account? <Link className="text-cyan-300" href="/register">Create one</Link></p>
  </>;
}
