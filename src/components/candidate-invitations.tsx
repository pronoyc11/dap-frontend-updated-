"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, endpoints } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

type Invitation = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "USED" | "REJECTED";
  expiresAt?: string;
  rejectionReason?: string | null;
  assessment?: {
    title?: string;
    description?: string;
    durationMinutes?: number;
    recruiter?: {
      name?: string;
      recruiterProfile?: { companyName?: string | null } | null;
    };
  };
};
async function digestToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function startWithCompatibleToken(token: string) {
  try {
    return await api.post<{ id: string }>(`/invitations/${token}/start`);
  } catch (firstError) {
    const hashed = await digestToken(token);
    if (hashed === token) throw firstError;
    return api.post<{ id: string }>(`/invitations/${hashed}/start`);
  }
}

export function CandidateInvitations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["invitations", page],
    queryFn: () => queries.invitations(`?page=${page}&limit=10`),
  });
  async function startAccepted(invitation: Invitation) {
    setPendingId(invitation.id);
    try {
      const details = await api.get<{ token: string }>(`/invitations/${invitation.id}`);
      const attempt = await startWithCompatibleToken(details.token);
      toast.success("Assessment started");
      router.push(`/attempt/${attempt.id}`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to start assessment");
    } finally {
      setPendingId(null);
    }
  }
  async function acceptAndStart(invitation: Invitation) {
    setPendingId(invitation.id);
    try {
      const accepted = await api.post<{ token: string }>(`/invitations/id/${invitation.id}/accept`);
      toast.success("Invitation accepted");
      const attempt = await startWithCompatibleToken(accepted.token);
      toast.success("Assessment started");
      router.push(`/attempt/${attempt.id}`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to start assessment");
      await refetch();
    } finally {
      setPendingId(null);
    }
  }
  async function reject(invitation: Invitation) {
    const reason = rejectionReason.trim();
    if (!reason) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setPendingId(invitation.id);
    try {
      await endpoints.rejectInvitation(invitation.id, { reason });
      toast.success("Invitation rejected. The recruiter has been notified.");
      setRejectingId(null);
      setRejectionReason("");
      await refetch();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to reject invitation");
    } finally {
      setPendingId(null);
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Invitations"
        description="Accept an invitation to start your next timed assessment."
      />
      <Card className="mt-8 p-0">
        <div className="divide-y divide-white/10">
          {isLoading ? (
            [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-24" />)
          ) : data?.items.length ? (
            data.items.map((raw) => {
              const invite = raw as Invitation;
              const assessment = invite.assessment;
              const company =
                assessment?.recruiter?.recruiterProfile?.companyName ??
                assessment?.recruiter?.name ??
                "Recruiting team";
              const pending = pendingId === invite.id;
              return (
                <div
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  key={invite.id}
                >
                  <div>
                    <p className="font-semibold text-white">
                      {assessment?.title ?? "Technical assessment"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {company} · {assessment?.durationMinutes ?? "—"} minutes
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Expires {invite.expiresAt ? new Date(invite.expiresAt).toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="flex flex-col items-stretch gap-3 sm:items-end">
                    <div className="flex items-center gap-3">
                      <Badge
                        tone={
                          invite.status === "PENDING"
                            ? "warning"
                            : invite.status === "REJECTED"
                              ? "danger"
                              : "success"
                        }
                      >
                        {invite.status}
                      </Badge>
                      {invite.status === "PENDING" && (
                        <Button
                          type="button"
                          disabled={pending}
                          onClick={() => void acceptAndStart(invite)}
                        >
                          {pending ? "Starting…" : "Accept & start"}
                        </Button>
                      )}
                      {invite.status === "ACCEPTED" && (
                        <Button
                          type="button"
                          disabled={pending}
                          onClick={() => void startAccepted(invite)}
                        >
                          {pending ? "Starting…" : "Start attempt"}
                        </Button>
                      )}
                      {invite.status === "PENDING" && rejectingId !== invite.id && (
                        <Button
                          type="button"
                          variant="danger"
                          disabled={pending}
                          onClick={() => setRejectingId(invite.id)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                    {rejectingId === invite.id && (
                      <div className="w-full max-w-sm space-y-2">
                        <textarea
                          value={rejectionReason}
                          onChange={(event) => setRejectionReason(event.target.value)}
                          placeholder="Why are you rejecting this invitation?"
                          rows={3}
                          required
                          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={pending}
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            disabled={pending || !rejectionReason.trim()}
                            onClick={() => void reject(invite)}
                          >
                            {pending ? "Rejecting…" : "Confirm rejection"}
                          </Button>
                        </div>
                      </div>
                    )}
                    {invite.status === "REJECTED" && invite.rejectionReason && (
                      <p className="max-w-sm text-right text-xs text-slate-500">
                        Reason: {invite.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-5">
              <EmptyState
                title="No invitations yet"
                description="When a recruiter invites you, the assessment will appear here."
              />
            </div>
          )}
          <PaginationControls
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 0}
            onPage={(next) => router.push(`/dashboard/invitations?page=${next}`)}
          />
        </div>
      </Card>
    </>
  );
}
