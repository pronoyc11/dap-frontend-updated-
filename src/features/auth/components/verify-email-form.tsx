"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { verifyEmailSchema } from "../schemas/auth.schemas";
import { useVerifyEmail } from "../hooks/use-auth";
import { toast } from "sonner";

export function VerifyEmailForm() {
  const email = useSearchParams().get("email") ?? "";
  const router = useRouter();
  const mutation = useVerifyEmail();
  const [formError, setFormError] = useState("");
  const form = useForm({ defaultValues: { email, otp: "" }, onSubmit: async ({ value }) => { const result = verifyEmailSchema.safeParse(value); if (!result.success) { setFormError(result.error.issues[0]?.message ?? "Check the code"); return; } setFormError(""); mutation.mutate(result.data, { onSuccess: () => { toast.success("Email verified"); router.push("/login"); }, onError: (error) => setFormError(error instanceof Error ? error.message : "Verification failed") }); } });
  return <><form className="mt-8 space-y-5" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit(); }}>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="verify-email">Email<input id="verify-email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400" value={form.getFieldValue("email")} onChange={(event) => form.setFieldValue("email", event.target.value)} /></label>
    <label className="block text-sm font-semibold text-slate-200" htmlFor="otp">Verification code<input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-3xl tracking-[.5em] text-white outline-none focus:border-cyan-400" value={form.getFieldValue("otp")} onChange={(event) => form.setFieldValue("otp", event.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
    {formError && <p role="alert" className="text-sm text-rose-300">{formError}</p>}
    <Button disabled={mutation.isPending} className="w-full">{mutation.isPending ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Verifying…</> : "Verify account"}</Button>
  </form><p className="mt-6 text-center text-sm text-slate-500"><Link className="text-cyan-300" href="/login">Return to sign in</Link></p></>;
}
