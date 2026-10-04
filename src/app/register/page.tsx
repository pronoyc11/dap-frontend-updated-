"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

const schema = z.object({ name: z.string().trim().min(2), email: z.string().trim().email(), password: z.string().min(8), role: z.enum(["CANDIDATE", "RECRUITER"]) });

export default function Register() {
  const router = useRouter();
  const [value, setValue] = useState({ name: "", email: "", password: "", role: "CANDIDATE" as "CANDIDATE" | "RECRUITER" });
  const [error, setError] = useState("");
  const recruiter = value.role === "RECRUITER";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(value);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check the form"); return; }
    try { await api.post("/auth/register", parsed.data); router.push(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to register"); }
  }

  return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6"><Card className="w-full max-w-lg"><h1 className="text-3xl font-black text-white">Create your workspace</h1><p className="mt-2 text-slate-400">Join Atlas as a candidate or recruiting team.</p><form className="mt-8 space-y-4" onSubmit={submit}>
    <label className="block text-sm font-semibold text-slate-200">Full name<input required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /></label>
    <label className="block text-sm font-semibold text-slate-200">Email<input required type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={value.email} onChange={(event) => setValue({ ...value, email: event.target.value })} /></label>
    <label className="block text-sm font-semibold text-slate-200">Password<input required type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white" value={value.password} onChange={(event) => setValue({ ...value, password: event.target.value })} /></label>
    <label className="block text-sm font-semibold text-slate-200">Account type<select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" value={value.role} onChange={(event) => setValue({ ...value, role: event.target.value as "CANDIDATE" | "RECRUITER" })}><option value="CANDIDATE">Candidate</option><option value="RECRUITER">Recruiter</option></select></label>
    {recruiter && <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100"><strong>Recruiter application review</strong><br />Your application is forwarded to an admin. Your recruiter status remains pending, and you remain a candidate until an admin approves your application.</div>}
    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}<Button type="submit" className="w-full">Continue</Button>
  </form></Card></main>;
}
