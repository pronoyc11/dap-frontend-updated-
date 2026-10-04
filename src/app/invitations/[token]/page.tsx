"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function InvitationAcceptPage() { const { token } = useParams<{ token: string }>(); const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState(""); async function start() { setPending(true); setError(""); try { await api.post(`/invitations/${token}/accept`); toast.success("Invitation accepted"); const attempt = await api.post<{ id: string }>(`/invitations/${token}/start`); toast.success("Assessment started"); router.push(`/attempt/${attempt.id}`); } catch (cause) { const message = cause instanceof Error ? cause.message : "Unable to accept invitation"; setError(message); toast.error(message); } finally { setPending(false); } } return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6"><Card className="w-full max-w-lg"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Assessment invitation</p><h1 className="mt-3 text-3xl font-black text-white">You have been invited</h1><p className="mt-3 text-slate-400">Accept this invitation to start your timed assessment. Once started, your answers are saved only when you submit or cancel.</p>{error && <p role="alert" className="mt-5 text-sm text-rose-300">{error}</p>}<Button className="mt-8 w-full" disabled={pending} onClick={() => void start()}>{pending ? "Starting…" : "Accept and start assessment"}</Button></Card></main>; }
