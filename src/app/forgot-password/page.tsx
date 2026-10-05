"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to send reset link");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] p-6">
      <Card className="w-full max-w-md">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">A</div>
        <h1 className="mt-6 text-3xl font-black text-white">Forgot password?</h1>
        <p className="mt-2 text-slate-400">Enter your email and we’ll send you a secure reset link.</p>
        {sent ? (
          <p className="mt-6 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-200">Check your inbox. The reset link expires in 15 minutes.</p>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <label className="block text-sm font-semibold text-slate-200">Email<input required type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <Button className="w-full" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-400"><Link className="font-semibold text-cyan-300 hover:text-cyan-200" href="/login">Back to sign in</Link></p>
      </Card>
    </main>
  );
}
