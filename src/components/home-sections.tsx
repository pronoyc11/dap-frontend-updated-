import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  LockKeyhole,
  MessageSquareText,
  Users,
  Workflow,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

const workflow = [
  ["01", "Author", "Build reusable problems and assemble a focused assessment."],
  ["02", "Invite", "Send a secure invitation to the right candidates."],
  ["03", "Evaluate", "Review objective results and manually assess written work."],
] as const;

const roles = [
  [
    Users,
    "Recruiters",
    "Create fair assessments, manage invitations, and make evidence-based decisions.",
  ],
  [
    ClipboardCheck,
    "Candidates",
    "Complete timed assessments, track invitations, and understand your results.",
  ],
  [
    LockKeyhole,
    "Admins",
    "Keep access, approvals, audit history, and platform operations under control.",
  ],
] as const;

export function HomeSections() {
  return (
    <>
      <section className="mt-20" aria-labelledby="workflow-heading">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">
            One clear flow
          </p>
          <h2
            id="workflow-heading"
            className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
          >
            From problem bank to hiring signal.
          </h2>
          <p className="mt-4 leading-7 text-slate-400">
            Every step stays connected, so teams spend less time coordinating tools and more time
            evaluating real work.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {workflow.map(([number, title, description]) => (
            <Card key={number} className="relative overflow-hidden">
              <span className="text-sm font-black text-cyan-300">{number}</span>
              <h3 className="mt-8 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="roles-heading">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">
          Built around your role
        </p>
        <h2
          id="roles-heading"
          className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
        >
          The right workspace for every participant.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {roles.map(([Icon, title, description]) => (
            <Card key={title}>
              <span className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="mt-20 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"
        aria-labelledby="quality-heading"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">
            Designed for quality
          </p>
          <h2
            id="quality-heading"
            className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
          >
            A consistent experience creates better evidence.
          </h2>
          <p className="mt-4 leading-7 text-slate-400">
            Clear controls, timed attempts, role-safe access, and auditable decisions keep the
            process fair for everyone.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Reusable problem bank",
            "Timed candidate attempts",
            "Manual written evaluation",
            "Audit-ready operations",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4"
            >
              <CheckCircle2 className="size-5 shrink-0 text-emerald-300" />
              <span className="text-sm font-semibold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mt-20 rounded-[2rem] border border-violet-300/20 bg-violet-300/[.06] p-6 sm:p-8"
        aria-labelledby="candidate-heading"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.2em] text-violet-300">
              <MessageSquareText className="size-4" /> Candidate-first by design
            </p>
            <h2
              id="candidate-heading"
              className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Less uncertainty. More useful feedback.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Candidates always know what is next—from accepting an invitation to completing an
              attempt and reviewing an evaluated result.
            </p>
          </div>
          <Link href="/about">
            <Button variant="secondary">
              Explore the platform <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="control-heading">
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              [
                Workflow,
                "Connected operations",
                "A single path for authoring, publishing, inviting, attempting, and reviewing.",
              ],
              [
                FileCheck2,
                "Human-led AI",
                "AI can help draft problems and suggest written feedback; recruiters keep final control.",
              ],
              [
                LockKeyhole,
                "Permission-aware",
                "Role-based routes and backend enforcement keep every workspace appropriately scoped.",
              ],
            ] as const
          ).map(([Icon, title, description]) => (
            <Card key={title}>
              <Icon className="size-6 text-cyan-300" />
              <h2
                id={title === "Connected operations" ? "control-heading" : undefined}
                className="mt-5 font-bold text-white"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="faq-heading">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">
          Answers before you start
        </p>
        <h2
          id="faq-heading"
          className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            [
              "Who is Atlas for?",
              "Recruiting teams, candidates, and platform administrators who need one accountable assessment workflow.",
            ],
            [
              "Can recruiters evaluate written work?",
              "Yes. Written submissions can be reviewed manually, with optional AI suggestions that require human approval.",
            ],
            [
              "Are candidate attempts timed?",
              "Yes. Published assessments can define a duration, and active attempts show a live remaining-time experience.",
            ],
            [
              "How is publishing handled?",
              "Recruiters prepare an assessment, mark it ready, and complete the configured Stripe checkout before it becomes published.",
            ],
          ].map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-2xl border border-white/10 bg-white/[.04] p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        className="mt-20 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[.12] to-transparent p-8 text-center sm:p-12"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Ready to make technical hiring clearer?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
          Create a workspace and move your next assessment from idea to evidence.
        </p>
        <Link href="/register" className="mt-7 inline-block">
          <Button>
            Start building <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </section>
    </>
  );
}
