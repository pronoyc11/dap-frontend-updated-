"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  CreditCard,
  Users,
  Zap,
} from "lucide-react";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import type {
  Assessment,
  Attempt,
} from "@/lib/types";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Users;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
export function AdminOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: queries.adminDashboard,
  });
  if (isLoading) return <DashboardSkeleton />;
  if (error || !data)
    return (
      <EmptyState
        title="Dashboard unavailable"
        description={error instanceof Error ? error.message : "Start the backend and check your admin session."}
      />
    );
  return (
    <>
      <PageIntro
        eyebrow="Admin control"
        title="Platform overview"
        description="A live view of users, assessment throughput, and payment activity."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={data.users.total}
          detail="Across every role"
          icon={Users}
        />
        <StatCard
          label="Published assessments"
          value={data.assessments.published}
          detail={`${data.assessments.total} total assessments`}
          icon={ClipboardList}
        />
        <StatCard
          label="Attempts"
          value={data.attempts.total}
          detail="Candidate activity"
          icon={Zap}
        />
        <StatCard
          label="Paid checkouts"
          value={data.payments.paid}
          detail={`${data.payments.total} total payments`}
          icon={CreditCard}
        />
      </div>
      <Card className="mt-6">
        <h2 className="font-bold text-white">Role distribution</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(["candidates", "recruiters", "admins"] as const).map((role) => (
            <div key={role} className="rounded-xl bg-white/[.04] p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {role}
              </p>
              <p className="mt-2 text-2xl font-black text-white">{data.users[role]}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6"><h2 className="font-bold text-white">Admin operations</h2><div className="mt-4 flex flex-wrap gap-3"><Link href="/admin/users"><Button variant="secondary">Manage users</Button></Link><Link href="/admin/applications"><Button variant="secondary">Review recruiter applications</Button></Link><Link href="/admin/audit-logs"><Button variant="secondary">View audit logs</Button></Link></div></Card>
    </>
  );
}
export function RecruiterOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => queries.assessments("?page=1&limit=5"),
  });
  if (isLoading) return <DashboardSkeleton />;
  return (
    <>
      <PageIntro
        eyebrow="Recruiter workspace"
        title="Build better signal"
        description="Author rigorous assessments, publish them securely, and review candidate work in one place."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Assessments"
          value={data?.pagination.total ?? 0}
          detail="In your workspace"
          icon={ClipboardList}
        />
        <StatCard
          label="Problem bank"
          value="—"
          detail="Open the problem bank to explore"
          icon={Zap}
        />
        <StatCard
          label="Published"
          value={
            data?.items.filter((a: Assessment) => a.status === "PUBLISHED")
              .length ?? 0
          }
          detail="Live candidate experiences"
          icon={ArrowUpRight}
        />
      </div>
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent assessments</h2>
          <Badge tone="neutral">Live API data</Badge>
        </div>
        <div className="mt-5 space-y-3">
          {data?.items.length ? (
            data.items.map((assessment: Assessment) => (
              <div
                className="flex items-center justify-between rounded-xl bg-white/[.03] p-4"
                key={assessment.id}
              >
                <div>
                  <p className="font-semibold text-white">{assessment.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {assessment.itemCount ?? 0} questions ·{" "}
                    {assessment.durationMinutes} minutes
                  </p>
                </div>
                <Badge
                  tone={
                    assessment.status === "PUBLISHED" ? "success" : "warning"
                  }
                >
                  {assessment.status}
                </Badge>
              </div>
            ))
          ) : (
            <EmptyState
              title="No assessments yet"
              description="Create your first assessment to get started."
            />
          )}
        </div>
      </Card>
      <Card className="mt-6"><h2 className="font-bold text-white">Authoring operations</h2><div className="mt-4 flex flex-wrap gap-3"><Link href="/recruiter/problems/new"><Button>New problem</Button></Link><Link href="/recruiter/problems"><Button variant="secondary">Manage problem bank</Button></Link><Link href="/recruiter/assessments/new"><Button>New assessment</Button></Link><Link href="/recruiter/assessments"><Button variant="secondary">Manage assessments</Button></Link><Link href="/recruiter/submissions"><Button variant="secondary">Review submissions</Button></Link><Link href="/recruiter/profile"><Button variant="secondary">Edit company profile</Button></Link></div></Card>
    </>
  );
}
export function CandidateOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["attempts"],
    queryFn: () => queries.attempts("?page=1&limit=5"),
  });
  if (isLoading) return <DashboardSkeleton />;
  const attempts = Array.isArray(data?.items) ? data.items : [];
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Your progress, at a glance"
        description="Keep track of invitations, active attempts, and evaluated results."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Attempts"
          value={data?.pagination.total ?? 0}
          detail="Your assessment history"
          icon={ClipboardList}
        />
        <StatCard
          label="In progress"
          value={
            attempts.filter((a: Attempt) => a.status === "IN_PROGRESS")
              .length ?? 0
          }
          detail="Pick up where you left off"
          icon={Zap}
        />
        <StatCard
          label="Evaluated"
          value={
            attempts.filter((a: Attempt) => a.status === "EVALUATED")
              .length ?? 0
          }
          detail="Results ready to review"
          icon={ArrowUpRight}
        />
      </div>
      <Card className="mt-6">
        <h2 className="font-bold">Recent activity</h2>
        <div className="mt-5 space-y-3">
          {attempts.length ? (
            attempts.map((attempt: Attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between rounded-xl bg-white/[.03] p-4"
              >
                <div>
                  <p className="font-semibold text-white">
                    {attempt.assessment?.title ?? "Assessment attempt"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {attempt.score !== undefined
                      ? `${attempt.score}/${attempt.maxScore ?? "—"} points`
                      : "Awaiting submission"}
                  </p>
                </div>
                <Badge
                  tone={attempt.status === "EVALUATED" ? "success" : "warning"}
                >
                  {attempt.status.replace("_", " ")}
                </Badge>
              </div>
            ))
          ) : (
            <EmptyState
              title="No attempts yet"
              description="Invitations will appear here when a recruiter sends one."
            />
          )}
        </div>
      </Card>
      <Card className="mt-6"><h2 className="font-bold text-white">Candidate actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link href="/dashboard/invitations"><Button>View invitations</Button></Link><Link href="/dashboard/profile"><Button variant="secondary">Update profile</Button></Link><Link href="/dashboard/payments"><Button variant="secondary">View results</Button></Link></div></Card>
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
    </div>
  );
}
export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-12 w-80" />
      <Skeleton className="mt-3 h-5 w-96" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
