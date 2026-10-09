"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { queries } from "@/lib/queries";
import { api } from "@/lib/api";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "./dashboard";

export function InvitationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["invitations"],
    queryFn: () => queries.invitations("?page=1&limit=30"),
  });
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Invitations"
        description="Accept an invitation to unlock your next assessment attempt."
      />
      <Card className="mt-8 p-0">
        <div className="divide-y divide-white/10">
          {isLoading ? (
            <Skeleton className="m-5 h-20" />
          ) : data?.items.length ? (
            data.items.map((invite) => (
              <div className="flex items-center justify-between gap-4 p-5" key={String(invite.id)}>
                <div>
                  <p className="font-semibold text-white">
                    {String(invite.assessmentTitle ?? "Technical assessment")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {String(invite.recruiterName ?? "Recruiting team")}
                  </p>
                </div>
                <Badge tone="warning">{String(invite.status ?? "PENDING")}</Badge>
              </div>
            ))
          ) : (
            <div className="p-5">
              <EmptyState
                title="No invitations yet"
                description="When a recruiter invites you, the assessment will appear here."
              />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

export function CandidateProfile() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: queries.me });
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "upload" | null>(null);
  if (isLoading) return <Skeleton className="h-80" />;
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
    setPendingAction("save");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api.patch("/users/me", { name: String(values.name ?? "") });
      toast.success("Profile saved");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setError("");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to update profile";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction(null);
    }
  }
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || pendingAction) return;
    setPendingAction("upload");
    const body = new FormData();
    body.append("avatar", file);
    try {
      await api.form("/users/me/avatar", body, "PATCH");
      toast.success("Avatar uploaded");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to upload avatar";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction(null);
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Profile & settings"
        description="Keep your account details and avatar up to date."
      />
      <Card className="mt-8 max-w-2xl">
        <div className="flex items-center gap-4">
          {data?.avatarUrl ? (
            <AvatarImage
              src={data.avatarUrl}
              alt="Profile avatar"
              size={64}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-cyan-400/10 text-xl text-cyan-300">
              {data?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}
          <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
            Upload avatar
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={pendingAction !== null}
              onChange={upload}
            />
          </label>
        </div>
        <form className="mt-8 space-y-5" onSubmit={save}>
          <label className="block text-sm font-semibold">
            Name
            <input
              name="name"
              defaultValue={data?.name ?? ""}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />
          </label>
          <p className="text-sm text-slate-400">{data?.email}</p>
          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pendingAction !== null}>
            {pendingAction === "save" ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
    </>
  );
}

export function CandidatePayments() {
  const { data, isLoading } = useQuery({
    queryKey: ["attempts-payments"],
    queryFn: () => queries.attempts("?page=1&limit=30"),
  });
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Results & history"
        description="Your evaluated assessment results live here."
      />
      <Card className="mt-8">
        <div className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-20" />
          ) : data?.items.filter((item) => item.status === "EVALUATED").length ? (
            data.items
              .filter((item) => item.status === "EVALUATED")
              .map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-xl bg-white/[.03] p-4"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {attempt.assessment?.title ?? "Assessment"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Score: {attempt.score}/{attempt.maxScore}
                    </p>
                  </div>
                  <Badge tone={attempt.passed ? "success" : "danger"}>
                    {attempt.passed ? "PASSED" : "NOT PASSED"}
                  </Badge>
                </div>
              ))
          ) : (
            <EmptyState
              title="No evaluated results"
              description="Completed assessments will show results after evaluation."
            />
          )}
        </div>
      </Card>
    </>
  );
}
