"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "@/components/dashboard";

export default function InviteToAssessment() {
  const { id: assessmentId } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const assessment = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => queries.assessment(assessmentId),
  });
  const candidates = useQuery({
    queryKey: ["candidates", page, search],
    queryFn: () =>
      queries.candidates(
        `?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
  function toggle(candidateId: string) {
    setSelected((current) => {
      if (current.includes(candidateId)) return current.filter((item) => item !== candidateId);
      if (current.length >= 1) {
        toast.error("You can invite only one candidate at a time.");
        return current;
      }
      return [...current, candidateId];
    });
  }
  async function invite() {
    if (!selected.length) {
      toast.error("Select a candidate");
      return;
    }
    setPending(true);
    try {
      await api.post(`/assessments/${assessmentId}/invitations`, { candidateId: selected[0] });
      toast.success("Invitation sent");
      router.push(`/recruiter/assessments/${assessmentId}`);
    } catch (cause) {
      if (
        cause instanceof ApiError &&
        cause.status === 409 &&
        cause.message.toLowerCase().includes("already exists")
      )
        toast.error("You already invited this candidate for this assessment once.");
      else toast.error(cause instanceof Error ? cause.message : "Unable to send invitation");
    } finally {
      setPending(false);
    }
  }
  if (assessment.isLoading) return <Skeleton className="h-96" />;
  if (!assessment.data)
    return (
      <EmptyState title="Assessment not found" description="This assessment is unavailable." />
    );
  if (assessment.data.status !== "PUBLISHED")
    return (
      <EmptyState
        title="Assessment is not published"
        description="Only published assessments can receive candidate invitations."
      />
    );
  return (
    <div className="max-w-4xl">
      <PageIntro
        eyebrow="Recruiter workspace"
        title={`Invite to ${assessment.data.title}`}
        description="Select one active verified candidate to invite."
      />
      <div className="mt-6 flex items-center gap-3">
        <Badge tone="success">PUBLISHED</Badge>
        <Link className="text-sm text-cyan-300" href={`/recruiter/assessments/${assessmentId}`}>
          Back to assessment
        </Link>
      </div>
      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("search")?.toString() ?? "";
          router.push(
            `/recruiter/assessments/${assessmentId}/invite?${value ? `search=${encodeURIComponent(value)}` : ""}`,
          );
        }}
      >
        <input
          name="search"
          defaultValue={search}
          placeholder="Search candidates by name or email…"
          className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white"
        />
      </form>
      <Card className="mt-5 p-0">
        <div className="divide-y divide-white/10">
          {candidates.isLoading ? (
            [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-16" />)
          ) : candidates.data?.items.length ? (
            candidates.data.items.map((candidate) => (
              <label
                key={candidate.id}
                className="flex cursor-pointer items-center gap-4 p-5 hover:bg-white/[.04]"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(candidate.id)}
                  onChange={() => toggle(candidate.id)}
                  className="size-4 accent-cyan-400"
                />
                <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-cyan-400/10 text-cyan-300">
                  {candidate.avatarUrl ? (
                    <AvatarImage
                      src={candidate.avatarUrl}
                      alt=""
                      size={44}
                      className="size-full object-cover"
                    />
                  ) : (
                    candidate.name.slice(0, 1).toUpperCase()
                  )}
                </span>
                <span>
                  <span className="block font-semibold text-white">{candidate.name}</span>
                  <span className="text-sm text-slate-500">{candidate.email}</span>
                </span>
              </label>
            ))
          ) : (
            <div className="p-5">
              <EmptyState title="No candidates found" description="Try a different search." />
            </div>
          )}
          <PaginationControls
            page={candidates.data?.pagination.page ?? page}
            totalPages={candidates.data?.pagination.totalPages ?? 0}
            onPage={(next) =>
              router.push(
                `/recruiter/assessments/${assessmentId}/invite?page=${next}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
              )
            }
          />
        </div>
      </Card>
      <div className="mt-5 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(`/recruiter/assessments/${assessmentId}`)}
        >
          Cancel
        </Button>
        <Button type="button" disabled={pending} onClick={() => void invite()}>
          Proceed to invitation{selected.length ? ` (${selected.length})` : ""}
        </Button>
      </div>
    </div>
  );
}
