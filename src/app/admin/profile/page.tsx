"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Button, Card, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

export default function AdminProfile() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: queries.me });
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "upload" | null>(null);
  if (isLoading) return <Skeleton className="h-80" />;
  if (!data) return null;
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
    setPendingAction("save");
    const name = String(new FormData(event.currentTarget).get("name") ?? "");
    try {
      await api.patch("/users/me", { name });
      toast.success("Profile updated");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
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
    <div className="max-w-2xl">
      <PageIntro
        eyebrow="Platform control"
        title="Admin profile"
        description="Update your administrator profile and avatar."
      />
      <Card className="mt-8">
        <div className="flex items-center gap-4">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt="Admin avatar"
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-cyan-400/10 text-xl text-cyan-300">
              {data.name.slice(0, 1).toUpperCase()}
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
          <label className="block text-sm font-semibold text-slate-200">
            Name
            <input
              name="name"
              defaultValue={data.name}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />
          </label>
          <p className="text-sm text-slate-400">{data.email}</p>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" disabled={pendingAction !== null}>
            {pendingAction === "save" ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
