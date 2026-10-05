"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

export default function SubmissionDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const writtenOnly = searchParams.get("written") === "1";
  const page = Number(searchParams.get("page") ?? 1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["assessment-submissions", id, page, writtenOnly],
    queryFn: () =>
      queries.assessmentSubmissions(
        id,
        `?page=${page}&limit=10${writtenOnly ? "&status=PENDING" : ""}`,
      ),
  });
  function filter(value: boolean) {
    router.push(`/recruiter/submissions/${id}?${value ? "written=1" : ""}`);
  }
  return (
    <>
      <PageIntro
        eyebrow="Recruiter workspace"
        title="Submission details"
        description="Review candidate work and manually evaluate written responses."
      />
      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant={!writtenOnly ? "primary" : "secondary"}
          onClick={() => filter(false)}
        >
          All submissions
        </Button>
        <Button
          type="button"
          variant={writtenOnly ? "primary" : "secondary"}
          onClick={() => filter(true)}
        >
          Written pending only
        </Button>
      </div>
      <Card className="mt-5 p-0">
        <div className="divide-y divide-white/10">
          {isLoading ? (
            [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-32" />)
          ) : error ? (
            <div className="p-5">
              <EmptyState
                title="Submissions unavailable"
                description={error instanceof Error ? error.message : "Unable to load submissions."}
              />
            </div>
          ) : data?.items.length ? (
            data.items.map((submission, index) => (
              <SubmissionRow
                key={String(submission.id ?? index)}
                submission={submission}
                onSaved={() =>
                  void queryClient.invalidateQueries({ queryKey: ["assessment-submissions", id] })
                }
              />
            ))
          ) : (
            <div className="p-6">
              <EmptyState
                title={writtenOnly ? "No pending written submissions" : "No candidate submissions"}
                description="Candidate submissions will appear here after an attempt is submitted."
              />
            </div>
          )}
          <PaginationControls
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 0}
            onPage={(next) =>
              router.push(
                `/recruiter/submissions/${id}?page=${next}${writtenOnly ? "&written=1" : ""}`,
              )
            }
          />
        </div>
      </Card>
    </>
  );
}

function SubmissionRow({
  submission,
  onSaved,
}: {
  submission: Record<string, unknown>;
  onSaved: () => void;
}) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const item = (submission.assessmentItem ?? {}) as Record<string, unknown>;
  const attempt = (submission.attempt ?? {}) as Record<string, unknown>;
  const candidate = (attempt.candidate ?? {}) as Record<string, unknown>;
  const isWritten = item.type === "WRITTEN";
  async function evaluate() {
    const numericScore = Number(score);
    const points = Number(item.points ?? 0);
    if (!Number.isInteger(numericScore) || numericScore < 0 || numericScore > points) {
      toast.error(`Enter a score from 0 to ${points}.`);
      return;
    }
    setPending(true);
    try {
      await api.patch(`/submissions/${String(submission.id)}/evaluate`, {
        score: numericScore,
        feedback: feedback.trim() || undefined,
      });
      toast.success("Written submission evaluated");
      onSaved();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to evaluate submission");
    } finally {
      setPending(false);
    }
  }
  return (
    <article className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{String(candidate.name ?? "Candidate")}</p>
          <p className="text-sm text-slate-500">{String(candidate.email ?? "")}</p>
        </div>
        <Badge tone={String(submission.status) === "MANUALLY_EVALUATED" ? "success" : "warning"}>
          {String(submission.status ?? "PENDING")}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <p>
          <span className="text-slate-500">Question:</span> {String(item.question ?? "—")}
        </p>
        <p>
          <span className="text-slate-500">Answer:</span> {String(submission.answer ?? "No answer")}
        </p>
        <p>
          <span className="text-slate-500">Points:</span> {String(item.points ?? "—")}
        </p>
        <p>
          <span className="text-slate-500">Current score:</span> {String(submission.score ?? 0)}
        </p>
      </div>
      {isWritten && submission.status === "PENDING" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-[120px_1fr_auto]">
          <input
            type="number"
            min={0}
            max={Number(item.points ?? 0)}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="Score"
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
          <input
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Feedback (optional)"
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
          <Button type="button" disabled={pending} onClick={() => void evaluate()}>
            Evaluate
          </Button>
        </div>
      )}
    </article>
  );
}
