"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "@/components/dashboard";
import { useAuthStore } from "@/store/auth";

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [pending, setPending] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => queries.adminUser(id),
  });
  if (isLoading) return <Skeleton className="h-96" />;
  if (!data)
    return (
      <EmptyState title="User not found" description="This user may no longer be available." />
    );
  async function change(status: "ACTIVE" | "SUSPENDED") {
    if (pending) return;
    setPending(true);
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      toast.success(`User ${status.toLowerCase()}`);
      await queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to update status");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="max-w-3xl">
      <PageIntro
        eyebrow="Platform control"
        title={data.name}
        description="Inspect account details and manage access status."
      />
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          {data.avatarUrl ? (
            <AvatarImage
              src={data.avatarUrl}
              alt="User avatar"
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
            <div className="mt-2 flex gap-2">
              <Badge>{data.role}</Badge>
              <Badge tone={data.status === "ACTIVE" ? "success" : "danger"}>{data.status}</Badge>
            </div>
          </div>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">Created</dt>
            <dd className="mt-1 text-slate-200">{String(data.createdAt ?? "—")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Recruiter status</dt>
            <dd className="mt-1 text-slate-200">{String(data.recruiterStatus ?? "—")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Email verified</dt>
            <dd className="mt-1 text-slate-200">{data.emailVerified ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Provider</dt>
            <dd className="mt-1 text-slate-200">
              {String((data as UserWithProvider).authProvider ?? "—")}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/users")}>
            Back
          </Button>
          {data.id === currentUserId ? (
            <Badge>Current account</Badge>
          ) : data.status === "ACTIVE" ? (
            <Button
              type="button"
              variant="danger"
              disabled={pending}
              onClick={() => void change("SUSPENDED")}
            >
              {pending ? "Updating…" : "Suspend user"}
            </Button>
          ) : (
            <Button type="button" disabled={pending} onClick={() => void change("ACTIVE")}>
              {pending ? "Updating…" : "Activate user"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
type UserWithProvider = { authProvider?: string };
