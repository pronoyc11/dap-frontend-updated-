"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Script from "next/script";
import { api } from "@/lib/api";
import { markSession } from "@/lib/session";
import type { Role } from "@/lib/types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
          cancel: () => void;
        };
      };
    };
    __atlasGoogleAuth?: {
      clientId: string;
      onCredential: (credential: string) => void;
    };
  }
}

const googleScript = "https://accounts.google.com/gsi/client";

type GoogleLoginProps = {
  onSuccess: (role: Role) => void;
  onError: (message: string) => void;
};

export function GoogleLogin({ onSuccess, onError }: GoogleLoginProps) {
  const target = useRef<HTMLDivElement>(null);
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.google),
  );
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [onError, onSuccess]);

  useEffect(() => {
    if (!clientId || !target.current) return;

    let cancelled = false;

    const signIn = (credential: string) => {
      setPending(true);
      void api
        .post<{ user: { role: Role } }>("/auth/google", { credential })
        .then((result) => {
          markSession(result.user.role);
          successRef.current(result.user.role);
        })
        .catch((error: unknown) =>
          errorRef.current(error instanceof Error ? error.message : "Google sign-in failed"),
        )
        .finally(() => setPending(false));
    };

    const render = () => {
      if (cancelled || !window.google || !target.current) return;

      const existingAuth = window.__atlasGoogleAuth;
      window.__atlasGoogleAuth = { clientId, onCredential: signIn };
      if (!existingAuth || existingAuth.clientId !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => window.__atlasGoogleAuth?.onCredential(response.credential),
        });
      }

      target.current.replaceChildren();
      window.google.accounts.id.renderButton(target.current, {
        theme: "outline",
        size: "large",
        width: Math.min(360, target.current.clientWidth),
        shape: "pill",
      });
      setReady(true);
    };

    if (window.google) render();

    return () => {
      cancelled = true;
      window.google?.accounts.id.cancel();
    };
  }, [clientId, scriptReady]);

  if (!clientId) {
    return <p className="text-center text-xs text-slate-500">Google sign-in is not configured.</p>;
  }

  return (
    <>
      <Script src={googleScript} strategy="lazyOnload" onLoad={() => setScriptReady(true)} />
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.08] to-white/[.02] p-3 shadow-lg shadow-cyan-950/10">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[.18em] text-slate-400">
          Continue securely with Google
        </p>
        <div className="relative min-h-10">
          <div
            ref={target}
            className={ready && !pending ? "flex justify-center" : "pointer-events-none opacity-0"}
          />
          {(!ready || pending) && (
            <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">
              {pending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Loading Google sign-in…"
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
