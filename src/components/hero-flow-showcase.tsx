"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileCode2,
  Mail,
  Send,
  Sparkles,
  Timer,
  UserRound,
  UsersRound,
} from "lucide-react";

const slides = [
  {
    eyebrow: "Recruiter flow",
    title: "From authoring to a confident decision.",
    description:
      "Create a rigorous assessment, invite the right candidates, and review evidence in one calm workspace.",
    icon: UsersRound,
    accent: "cyan",
    steps: [
      { icon: FileCode2, label: "Build assessment" },
      { icon: Send, label: "Invite candidates" },
      { icon: CheckCircle2, label: "Review signal" },
    ],
  },
  {
    eyebrow: "Candidate flow",
    title: "A fair experience from invite to result.",
    description:
      "Candidates see what matters, complete a timed attempt, and understand how their result was evaluated.",
    icon: UserRound,
    accent: "violet",
    steps: [
      { icon: Mail, label: "Accept invite" },
      { icon: Timer, label: "Attempt fairly" },
      { icon: ClipboardCheck, label: "See result" },
    ],
  },
  {
    eyebrow: "AI-assisted workflows",
    title: "More momentum, with humans in control.",
    description:
      "Generate a problem draft or get a written-answer suggestion—then review, edit, and approve every decision yourself.",
    icon: BrainCircuit,
    accent: "amber",
    steps: [
      { icon: Sparkles, label: "Draft with AI" },
      { icon: BrainCircuit, label: "Review suggestion" },
      { icon: CheckCircle2, label: "Approve" },
    ],
  },
] as const;

const accentClasses = {
  cyan: {
    icon: "bg-cyan-300/15 text-cyan-300",
    line: "bg-cyan-300",
    soft: "bg-cyan-300/[.08]",
    text: "text-cyan-300",
  },
  violet: {
    icon: "bg-violet-300/15 text-violet-300",
    line: "bg-violet-300",
    soft: "bg-violet-300/[.08]",
    text: "text-violet-300",
  },
  amber: {
    icon: "bg-amber-300/15 text-amber-300",
    line: "bg-amber-300",
    soft: "bg-amber-300/[.08]",
    text: "text-amber-300",
  },
} as const;

export function HeroFlowShowcase() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const colors = accentClasses[slide.accent];
  const Icon = slide.icon;

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="How Atlas works"
      className={`relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-white/10 ${colors.soft} p-5 shadow-2xl shadow-slate-950/20 transition-colors duration-500 sm:p-7`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-white/[.06] blur-3xl" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className={`grid size-12 place-items-center rounded-2xl ${colors.icon}`}>
            <Icon className="size-6" />
          </div>
          <div className="flex gap-1.5" aria-label="Carousel slides">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                aria-label={`Show ${item.eyebrow}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`h-2 rounded-full transition-all ${index === active ? `w-7 ${colors.line}` : "w-2 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>
        <div key={slide.eyebrow} className="animate-reveal">
          <p className={`mt-8 text-xs font-bold uppercase tracking-[.2em] ${colors.text}`}>
            {slide.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">{slide.description}</p>
        </div>
        <div className="mt-auto pt-8">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
            {slide.steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="contents">
                  <div className="min-w-0">
                    <div className={`grid size-10 place-items-center rounded-xl ${colors.icon}`}>
                      <StepIcon className="size-4" />
                    </div>
                    <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-300">
                      {step.label}
                    </p>
                  </div>
                  {index < slide.steps.length - 1 ? (
                    <ArrowRight className={`size-4 ${colors.text}`} />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
            <span>Atlas / DAP</span>
            <span>
              {active + 1} of {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
