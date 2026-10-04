"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { registerSchema } from "../schemas/auth.schemas";
import { useRegister } from "../hooks/use-auth";

export function RegisterForm() {
  const router = useRouter();
  const mutation = useRegister();
  const [formError, setFormError] = useState("");
  const form = useForm({ defaultValues: { name: "", email: "", password: "", role: "CANDIDATE" as "CANDIDATE" | "RECRUITER" }, onSubmit: async ({ value }) => { const result = registerSchema.safeParse(value); if (!result.success) { setFormError(result.error.issues[0]?.message ?? "Check your details"); return; } setFormError(""); mutation.mutate(result.data, { onSuccess: (data) => router.push(`/verify-email?email=${encodeURIComponent(data.email)}`), onError: (error) => setFormError(error instanceof Error ? error.message : "Unable to register") }); } });
  return <><form className="mt-8 space-y-4" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="name">Full name<input id="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("name")} onChange={(event) => form.setFieldValue("name", event.target.value)} /></label>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="register-email">Email<input id="register-email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("email")} onChange={(event) => form.setFieldValue("email", event.target.value)} /></label>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="register-password">Password<input id="register-password" autoComplete="new-password" type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("password")} onChange={(event) => form.setFieldValue("password", event.target.value)} /></label>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="role">Account type<select id="role" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" value={form.getFieldValue("role")} onChange={(event) => form.setFieldValue("role", event.target.value as "CANDIDATE" | "RECRUITER")}><option value="CANDIDATE">Candidate</option><option value="RECRUITER">Recruiter</option></select></label>
    {formError && <p role="alert" className="text-sm text-rose-300">{formError}</p>}
    <Button disabled={mutation.isPending} className="w-full">{mutation.isPending ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Creating account…</> : "Continue"}</Button>
  </form><p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link className="text-cyan-300" href="/login">Sign in</Link></p></>;
}
