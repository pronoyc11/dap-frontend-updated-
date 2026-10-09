"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "@/components/dashboard";

export default function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => queries.candidate(id),
  });
  if (isLoading) return <Skeleton className="h-80" />;
  if (!data)
    return (
      <EmptyState
        title="Candidate not found"
        description="This candidate is no longer available."
      />
    );
  return (
    <div className="max-w-2xl">
      <PageIntro
        eyebrow="Recruiter workspace"
        title={data.name}
        description="Candidate profile details available for invitation workflows."
      />
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          {data.avatarUrl ? (
            <AvatarImage
              src={data.avatarUrl}
              alt="Candidate avatar"
              size={64}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-cyan-400/10 text-xl text-cyan-300">
              {data.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-white">{data.email}</p>
            <Badge tone="success">ACTIVE CANDIDATE</Badge>
          </div>
        </div>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Candidate ID</dt>
            <dd className="mt-1 break-all text-slate-200">{data.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Joined</dt>
            <dd className="mt-1 text-slate-200">{String(data.createdAt ?? "—")}</dd>
          </div>
        </dl>
        <div className="mt-8 flex gap-3">
          <Button type="button" onClick={() => router.push(`/recruiter/candidates/${id}/invite`)}>
            Invite candidate
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/recruiter/candidates")}
          >
            Back to candidates
          </Button>
        </div>
      </Card>
    </div>
  );
}
