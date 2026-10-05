import Link from "next/link";
import { Check } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { MarketingShell } from "@/components/marketing";
export default function Pricing() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.24em] text-cyan-300">Pricing</p>
          <h1 className="mt-4 text-5xl font-black text-white">Simple publishing economics.</h1>
          <p className="mt-5 text-slate-400">
            Your backend controls the configured Stripe publishing fee. The frontend keeps checkout
            transparent and auditable.
          </p>
        </div>
        <Card className="mt-12 max-w-md border-cyan-400/40">
          <p className="text-sm font-bold text-cyan-300">Assessment publishing</p>
          <p className="mt-5 text-5xl font-black text-white">API-configured</p>
          <ul className="mt-7 space-y-3 text-sm text-slate-300">
            {[
              "Unlimited draft authoring",
              "Candidate invitations",
              "Timed assessment attempts",
              "Recruiter evaluation",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="size-4 text-cyan-300" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/register" className="mt-8 block">
            <Button className="w-full">Create workspace</Button>
          </Link>
        </Card>
      </main>
    </MarketingShell>
  );
}
