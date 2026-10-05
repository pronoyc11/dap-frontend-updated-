import { ClipboardCheck, CreditCard, Database, LockKeyhole } from "lucide-react";
import { FeatureCard, MarketingShell } from "@/components/marketing";
export default function Services() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[.24em] text-cyan-300">Solutions</p>
        <h1 className="mt-4 text-5xl font-black text-white">
          Everything between question and decision.
        </h1>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={ClipboardCheck} title="Assessment authoring">
            Reusable problem banks, snapshots, ordering, readiness checks, and publishing controls.
          </FeatureCard>
          <FeatureCard icon={CreditCard} title="Stripe publishing">
            Real checkout sessions for assessment publishing with explicit success and cancellation
            paths.
          </FeatureCard>
          <FeatureCard icon={Database} title="Candidate evidence">
            Timed attempts, safe question delivery, submissions, and recruiter evaluation workflows.
          </FeatureCard>
          <FeatureCard icon={LockKeyhole} title="Governed access">
            JWT-backed cookies, role-aware middleware, and a UI that reflects actual permissions.
          </FeatureCard>
        </div>
      </main>
    </MarketingShell>
  );
}
