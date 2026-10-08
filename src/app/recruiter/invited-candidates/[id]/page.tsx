"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

export default function InvitedCandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["invited-candidate", id],
    queryFn: () => queries.invitedCandidate(id),
  });

  if (isLoading) return <Skeleton className="h-80" />;
  if (!data) {
    return (
      <EmptyState
        title="Candidate not found"
        description="This invited candidate is no longer available."
      />
    );
  }

  return (
    <div className="max-w-3xl">
      <PageIntro
        eyebrow="Recruiter workspace"
        title={data.name}
        description="Review every invitation and the candidate's progress across your assessments."
      />
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt="Candidate avatar"
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-cyan-400/10 text-xl text-cyan-300">
              {data.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-white">{data.email}</p>
            <Badge tone="success">INVITED CANDIDATE</Badge>
          </div>
        </div>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Candidate ID</dt>
            <dd className="mt-1 break-all text-slate-200">{data.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Joined</dt>
            <dd className="mt-1 text-slate-200">{formatDate(data.createdAt)}</dd>
          </div>
        </dl>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white">Assessment activity</h2>
          {data.invitations.length ? (
            <div className="mt-4 space-y-3">
              {data.invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="rounded-xl border border-white/10 bg-white/[.03] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{invitation.assessment.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Invited {formatDate(invitation.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={invitation.status === "PENDING" ? "warning" : "success"}>
                        {invitation.status === "PENDING" ? "NOT ACCEPTED" : "ACCEPTED"}
                      </Badge>
                      <Badge tone={invitation.attempt ? "success" : "neutral"}>
                        {getAttemptLabel(invitation.attempt?.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-slate-500">Attempt result</p>
                      <p className="mt-1 text-slate-200">
                        {invitation.attempt?.status === "EVALUATED"
                          ? invitation.attempt.passed
                            ? "Passed"
                            : "Failed"
                          : "Awaiting evaluation"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Score</p>
                      <p className="mt-1 text-slate-200">
                        {invitation.attempt?.status === "EVALUATED"
                          ? `${invitation.attempt.totalScore}/${invitation.attempt.maxScore}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Accepted</p>
                      <p className="mt-1 text-slate-200">{formatDate(invitation.acceptedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No assessment invitations found.</p>
          )}
        </div>
        <div className="mt-8 flex gap-3">
          <Button type="button" onClick={() => router.push(`/recruiter/candidates/${id}/invite`)}>
            Invite candidate
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/recruiter/invited-candidates")}
          >
            Back to invited candidates
          </Button>
        </div>
      </Card>
    </div>
  );
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : "—";
}

function getAttemptLabel(status?: string) {
  return status ? status.replaceAll("_", " ") : "NOT ATTEMPTED";
}
