"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return toast.error("This reset link is missing its token.");
    if (password !== confirmation) return toast.error("Passwords do not match.");
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    setPending(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setComplete(true);
      toast.success("Password reset successfully.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to reset password");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] p-6">
      <Card className="w-full max-w-md">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">A</div>
        <h1 className="mt-6 text-3xl font-black text-white">Set a new password</h1>
        {complete ? <><p className="mt-2 text-slate-400">Your password has been changed. You can now sign in with the new password.</p><Link className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950" href="/login">Go to sign in</Link></> : <form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-semibold text-slate-200">New password<input required minLength={8} type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="block text-sm font-semibold text-slate-200">Confirm password<input required minLength={8} type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label><Button className="w-full" disabled={pending || !token}>{pending ? "Updating…" : "Reset password"}</Button></form>}
        {!complete && <p className="mt-6 text-center text-sm text-slate-400"><Link className="font-semibold text-cyan-300 hover:text-cyan-200" href="/login">Back to sign in</Link></p>}
      </Card>
    </main>
  );
}
