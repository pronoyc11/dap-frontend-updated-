"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { api } from "@/lib/api";
import { markSession } from "@/lib/session";

declare global { interface Window { google?: { accounts: { id: { initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, string | number>) => void; cancel: () => void } } } } }
const googleScript = "https://accounts.google.com/gsi/client";

export function GoogleLogin({ onSuccess, onError }: { onSuccess: (role: string) => void; onError: (message: string) => void }) {
  const target = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false); const [pending, setPending] = useState(false); const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  useEffect(() => { if (!clientId || !target.current) return; let script = document.querySelector<HTMLScriptElement>(`script[src="${googleScript}"]`); const render = () => { if (!window.google || !target.current) return; window.google.accounts.id.initialize({ client_id: clientId, callback: (response) => { setPending(true); void api.post<{ user: { role: string } }>("/auth/google", { credential: response.credential }).then((result) => { markSession(result.user.role as import("@/lib/types").Role); onSuccess(result.user.role); }).catch((error: unknown) => onError(error instanceof Error ? error.message : "Google sign-in failed")).finally(() => setPending(false)); } }); target.current.replaceChildren(); window.google.accounts.id.renderButton(target.current, { theme: "outline", size: "large", width: Math.min(360, target.current.clientWidth), shape: "pill" }); setReady(true); }; if (window.google) render(); else { script ??= document.createElement("script"); script.src = googleScript; script.async = true; script.defer = true; script.addEventListener("load", render, { once: true }); if (!script.parentNode) document.head.appendChild(script); } return () => { script?.removeEventListener("load", render); window.google?.accounts.id.cancel(); }; }, [clientId, onError, onSuccess]);
  if (!clientId) return <p className="text-center text-xs text-slate-500">Google sign-in is not configured.</p>;
  return <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.08] to-white/[.02] p-3 shadow-lg shadow-cyan-950/10"><p className="mb-3 text-center text-xs font-semibold uppercase tracking-[.18em] text-slate-400">Continue securely with Google</p><div className="relative min-h-10"><div ref={target} className={ready && !pending ? "flex justify-center" : "pointer-events-none opacity-0"} />{(!ready || pending) && <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">{pending ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Signing in…</> : "Loading Google sign-in…"}</div>}</div></div>;
}
