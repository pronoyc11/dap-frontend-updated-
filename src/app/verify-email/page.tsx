"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function VerifyEmail() {
  const email = useSearchParams().get("email") ?? "";
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.post("/auth/verify-email", { email, otp });
      router.replace("/login");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Verification failed");
      setPending(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-black text-white">Verify your email</h1>
        <p className="mt-2 text-slate-400">
          Enter the six-digit code sent to {email || "your inbox"}.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <input
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-3xl tracking-[.5em] text-white"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button className="w-full" disabled={pending}>
            {pending ? "Verifying…" : "Verify account"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
