"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { queries } from "@/lib/queries";
import { api } from "@/lib/api";
import { Button, Card, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "./dashboard";

export function RecruiterProfile() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: queries.recruiterProfile,
  });
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"save" | "upload" | null>(null);
  if (isLoading) return <Skeleton className="h-80" />;
  const profile = data ?? {};
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
    setPendingAction("save");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api.patch("/recruiters/me/profile", values);
      toast.success("Company profile saved");
      await queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
      setError("");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to update company profile";
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
    body.append("logo", file);
    try {
      await api.form("/recruiters/me/profile/logo", body, "PATCH");
      toast.success("Company logo uploaded");
      await queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to upload company logo";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction(null);
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Recruiter workspace"
        title="Company profile"
        description="Update the identity candidates see across your assessment experience."
      />
      <Card className="mt-8 max-w-2xl">
        <div className="flex items-center gap-4">
          {typeof profile.companyLogoUrl === "string" && profile.companyLogoUrl ? (
            <AvatarImage
              src={profile.companyLogoUrl}
              alt="Company logo"
              size={64}
              className="size-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-300">
              {String(profile.companyName ?? "C").slice(0, 1)}
            </div>
          )}
          <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
            Upload company logo
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
            Company name
            <input
              name="companyName"
              defaultValue={String(profile.companyName ?? "")}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />
          </label>
          <label className="block text-sm font-semibold">
            Company website
            <input
              name="companyWebsite"
              defaultValue={String(profile.companyWebsite ?? "")}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />
          </label>
          <label className="block text-sm font-semibold">
            Description
            <textarea
              name="companyDescription"
              defaultValue={String(profile.companyDescription ?? "")}
              rows={5}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-4 text-white"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pendingAction !== null}>
            {pendingAction === "save" ? "Saving…" : "Save company profile"}
          </Button>
        </form>
      </Card>
    </>
  );
}
