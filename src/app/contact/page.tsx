import { Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui";
import { MarketingShell } from "@/components/marketing";
export default function Contact() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[.24em] text-cyan-300">Contact</p>
        <h1 className="mt-4 text-5xl font-black text-white">
          Let’s make technical hiring clearer.
        </h1>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card>
            <Mail className="size-6 text-cyan-300" />
            <h2 className="mt-5 text-xl font-bold">Email the team</h2>
            <p className="mt-2 text-slate-400">
              Questions about setup, API integration, or deployment?
            </p>
            <a className="mt-5 inline-block text-cyan-300" href="mailto:hello@atlas-dap.local">
              hello@atlas-dap.local
            </a>
          </Card>
          <Card>
            <MessageSquare className="size-6 text-cyan-300" />
            <h2 className="mt-5 text-xl font-bold">Start with a demo</h2>
            <p className="mt-2 text-slate-400">
              Use one-click demo login to explore each role immediately.
            </p>
          </Card>
        </div>
      </main>
    </MarketingShell>
  );
}
