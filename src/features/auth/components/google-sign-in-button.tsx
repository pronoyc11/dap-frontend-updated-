"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from "../hooks/use-auth";
import { dashboardForRole } from "../utils/auth.utils";
import { useRouter } from "next/navigation";

declare global {
  interface Window { google?: { accounts: { id: { initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, string | number>) => void; cancel: () => void } } }; }
}

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

export function GoogleSignInButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const mutation = useGoogleLogin();
  const { mutate, isPending } = mutation;
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !containerRef.current) return;
    let script = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`);
    const render = () => {
      if (!window.google || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          mutate(response, {
            onSuccess: (result) => router.replace(dashboardForRole(result.role)),
            onError: (error) => toast.error(error instanceof Error ? error.message : "Google sign-in failed"),
          });
        },
      });
      containerRef.current.replaceChildren();
      window.google.accounts.id.renderButton(containerRef.current, { theme: "outline", size: "large", width: 360 });
      setReady(true);
    };
    if (script) {
      if (window.google) render();
      else script.addEventListener("load", render, { once: true });
    } else {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }
    return () => { script?.removeEventListener("load", render); window.google?.accounts.id.cancel(); };
  }, [clientId, mutate, router]);

  if (!clientId) return <p className="text-center text-xs text-slate-500">Google sign-in is not configured.</p>;
  return <div className="relative min-h-10"><div ref={containerRef} className={ready && !isPending ? "flex justify-center" : "pointer-events-none opacity-0"} />{(!ready || isPending) && <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">{isPending ? <><LoaderCircle className="mr-2 size-4 animate-spin" />Signing in…</> : "Loading Google sign-in…"}</div>}</div>;
}
