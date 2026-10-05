"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, Skeleton } from "@/components/ui";
import { api } from "@/lib/api";
import type { Assessment } from "@/lib/types";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 20;

export default function PaymentSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pollCount = 0;

    async function waitForPublication() {
      try {
        const assessment = await api.get<Assessment>(`/assessments/${id}`);

        if (cancelled) return;

        if (assessment.status === "PUBLISHED") {
          toast.success("Payment confirmed and assessment published.");
          router.replace("/recruiter");
          return;
        }
      } catch {
        if (cancelled) return;
      }

      if (cancelled) return;
      pollCount += 1;
      if (pollCount >= MAX_POLLS) {
        setTimedOut(true);
        return;
      }

      window.setTimeout(() => void waitForPublication(), POLL_INTERVAL_MS);
    }

    void waitForPublication();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-lg text-center">
        {timedOut ? (
          <>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-300">Payment received</p>
            <h1 className="mt-4 text-2xl font-black text-white">Publication is still processing</h1>
            <p className="mt-3 text-sm text-slate-400">
              Stripe has confirmed the payment, but the backend webhook has not finished updating the assessment yet.
            </p>
            <button
              type="button"
              className="mt-6 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              onClick={() => router.replace("/recruiter")}
            >
              Go to recruiter dashboard
            </button>
          </>
        ) : (
          <>
            <Skeleton className="mx-auto h-3 w-32" />
            <h1 className="mt-5 text-2xl font-black text-white">Confirming your payment</h1>
            <p className="mt-3 text-sm text-slate-400">
              We are waiting for Stripe to finish processing the payment and publish your assessment.
            </p>
            <div className="mx-auto mt-6 size-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
          </>
        )}
      </Card>
    </main>
  );
}
