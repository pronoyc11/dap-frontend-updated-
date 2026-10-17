import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  FileCode2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui";
import { FeatureCard, MarketingShell } from "@/components/marketing";
import { HeroFlowShowcase } from "@/components/hero-flow-showcase";
export default function Home() {
  return (
    <MarketingShell>
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:pb-32 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,.85fr)] lg:gap-16">
            <div className="max-w-4xl">
              <p className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[.24em] text-cyan-300">
                <Sparkles className="size-4" /> Developer signal, made clear
              </p>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-7xl">
                Build a hiring process your best engineers{" "}
                <span className="text-cyan-300">trust.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Atlas gives teams a calm, evidence-first workspace to author assessments, invite
                candidates, review submissions, and make better decisions.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button>
                    Start building <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary">Explore the platform</Button>
                </Link>
              </div>
            </div>
            <HeroFlowShowcase />
          </div>
          <div className="mt-20 grid gap-4 md:grid-cols-3">
            <FeatureCard icon={Target} title="Signal over noise">
              Structured assessment workflows that keep every decision grounded in candidate work.
            </FeatureCard>
            <FeatureCard icon={ShieldCheck} title="Role-safe by default">
              Admin, recruiter, and candidate experiences are separated at both route and interface
              level.
            </FeatureCard>
            <FeatureCard icon={Check} title="Ready for real work">
              Stripe publishing, verification flows, timed attempts, and evaluation built into one
              system.
            </FeatureCard>
          </div>
          <section className="relative mt-20 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[.12] via-white/[.04] to-transparent p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-cyan-300/10 blur-3xl animate-float" />
            <div className="relative grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div className="animate-reveal">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.2em] text-cyan-300">
                  <Sparkles className="size-4" /> AI-assisted workflows
                </p>
                <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Move from blank page to better signal, faster.
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-slate-400">
                  Atlas uses responsible AI to help recruiters author stronger problems and review
                  written answers—while keeping every final decision in human hands.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="animate-reveal rounded-2xl border border-white/10 bg-black/20 p-5 [animation-delay:120ms]">
                  <span className="grid size-10 place-items-center rounded-xl bg-cyan-300/15 text-cyan-300">
                    <FileCode2 className="size-5" />
                  </span>
                  <h3 className="mt-5 font-bold text-white">AI problem drafting</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Describe a skill, choose a difficulty, and get a structured draft ready for
                    recruiter review.
                  </p>
                </div>
                <div className="animate-reveal rounded-2xl border border-white/10 bg-black/20 p-5 [animation-delay:240ms]">
                  <span className="grid size-10 place-items-center rounded-xl bg-violet-300/15 text-violet-300">
                    <BrainCircuit className="size-5" />
                  </span>
                  <h3 className="mt-5 font-bold text-white">Written-answer guidance</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Get an evidence-based score and feedback suggestion, then approve or edit it
                    yourself.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </MarketingShell>
  );
}
