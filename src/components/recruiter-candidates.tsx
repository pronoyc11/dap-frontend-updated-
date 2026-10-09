"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { AvatarImage } from "@/components/avatar-image";
import { PageIntro } from "@/components/dashboard";

export function RecruiterCandidates() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const { data, isLoading } = useQuery({
    queryKey: ["candidates", page, search],
    queryFn: () =>
      queries.candidates(
        `?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
  return (
    <>
      <PageIntro
        eyebrow="Recruiter workspace"
        title="Candidate directory"
        description="Find active verified candidates and inspect their public profile before sending an invitation."
      />
      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("search")?.toString() ?? "";
          router.push(
            `/recruiter/candidates?${value ? `search=${encodeURIComponent(value)}` : ""}`,
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
          {isLoading ? (
            [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-16" />)
          ) : data?.items.length ? (
            data.items.map((candidate) => (
              <Link
                key={candidate.id}
                href={`/recruiter/candidates/${candidate.id}`}
                className="flex items-center gap-4 p-5 hover:bg-white/[.04]"
              >
                <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-cyan-400/10 text-cyan-300">
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
              </Link>
            ))
          ) : (
            <div className="p-5">
              <EmptyState title="No candidates found" description="Try a different search." />
            </div>
          )}
          <PaginationControls
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 0}
            onPage={(next) =>
              router.push(
                `/recruiter/candidates?page=${next}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
              )
            }
          />
        </div>
      </Card>
    </>
  );
}
