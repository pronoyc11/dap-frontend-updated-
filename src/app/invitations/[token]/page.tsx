"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";

async function digestToken(token: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)); return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(""); }
async function postWithCompatibleToken(token: string, action: "accept" | "start") { try { return await api.post<{ id?: string }>(`/invitations/${token}/${action}`); } catch (firstError) { const hashed = await digestToken(token); if (hashed === token) throw firstError; return api.post<{ id?: string }>(`/invitations/${hashed}/${action}`); } }

export default function InvitationAcceptPage() { const { token } = useParams<{ token: string }>(); const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState(""); async function start() { setPending(true); setError(""); try { await postWithCompatibleToken(token, "accept"); toast.success("Invitation accepted"); const attempt = await postWithCompatibleToken(token, "start"); if (!attempt.id) throw new Error("Assessment attempt could not be started."); toast.success("Assessment started"); router.push(`/attempt/${attempt.id}`); } catch (cause) { const message = cause instanceof Error ? cause.message : "Unable to accept invitation"; setError(message); toast.error(message); } finally { setPending(false); } } return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6"><Card className="w-full max-w-lg"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Assessment invitation</p><h1 className="mt-3 text-3xl font-black text-white">You have been invited</h1><p className="mt-3 text-slate-400">Accept this invitation to start your timed assessment. Once started, your answers are saved only when you submit or cancel.</p>{error && <p role="alert" className="mt-5 text-sm text-rose-300">{error}</p>}<Button className="mt-8 w-full" disabled={pending} onClick={() => void start()}>{pending ? "Starting…" : "Accept and start assessment"}</Button></Card></main>; }
