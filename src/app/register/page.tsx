"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, Card } from "@/components/ui";
import { api } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
});
const recruiterMessage = "Your application application as a recruiter will be forwarded to an admin. Your recruiter status remains pending, and you remain a candidate until an admin approves your application.";

export default function Register() {
  const router = useRouter();
  const [value, setValue] = useState({ name: "", email: "", password: "", role: "CANDIDATE" as "CANDIDATE" | "RECRUITER" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const recruiter = value.role === "RECRUITER";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setPending(true);
    setError("");
    try {
      await api.post("/auth/register", parsed.data);
      router.push(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to register");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-[#07111f] px-4 py-6 sm:items-center sm:px-6 sm:py-10">
      <div className="w-full max-w-lg min-w-0">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
          <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-white"><span className="grid size-8 place-items-center rounded-lg bg-cyan-400 text-sm text-slate-950">A</span>atlas<span className="text-cyan-300">/</span>DAP</Link>
          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm text-slate-400 sm:gap-5"><Link className="hidden hover:text-cyan-300 sm:inline" href="/about">Platform</Link><Link className="hidden hover:text-cyan-300 sm:inline" href="/services">Solutions</Link><Link className="hidden hover:text-cyan-300 sm:inline" href="/pricing">Pricing</Link><Link className="hidden hover:text-cyan-300 sm:inline" href="/contact">Contact</Link><Link className="font-semibold text-cyan-300" href="/login">Sign in</Link></nav>
        </header>
        <Card className="min-w-0 p-4 sm:p-6">
          <h1 className="text-3xl font-black text-white">Create your workspace</h1>
          <p className="mt-2 text-slate-400">Join Atlas as a candidate or recruiting team.</p>
          <form className="mt-7 space-y-4 sm:mt-8" onSubmit={submit}>
            <label className="block text-sm font-semibold text-slate-200">Full name<input required autoComplete="name" className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 text-base text-white outline-none focus:border-cyan-300/60" value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
            <label className="block text-sm font-semibold text-slate-200">Email<input required type="email" autoComplete="email" className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 text-base text-white outline-none focus:border-cyan-300/60" value={value.email} onChange={(event) => setValue({ ...value, email: event.target.value })} /></label>
            <label className="block text-sm font-semibold text-slate-200">Password<input required minLength={8} type="password" autoComplete="new-password" className="mt-2 h-12 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 text-base text-white outline-none focus:border-cyan-300/60" value={value.password} onChange={(event) => setValue({ ...value, password: event.target.value })} /></label>
            <label className="block text-sm font-semibold text-slate-200">Account type<select className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-base text-white" value={value.role} onChange={(event) => setValue({ ...value, role: event.target.value as "CANDIDATE" | "RECRUITER" })}><option value="CANDIDATE">Candidate</option><option value="RECRUITER">Recruiter</option></select></label>
            {recruiter && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Recruiter application review</strong><br />{recruiterMessage}</div>}
            {error && <p role="alert" className="break-anywhere text-sm leading-6 text-rose-300">{error}</p>}
            <Button type="submit" disabled={pending} className="h-12 w-full">{pending ? "Creating account…" : "Continue"}</Button>
          </form>
          <p className="mt-6 text-center text-sm leading-6 text-slate-400">Already have an account? <Link className="font-semibold text-cyan-300 hover:text-cyan-200" href="/login">Sign in</Link></p>
        </Card>
      </div>
    </main>
  );
}
