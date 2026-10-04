"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function AssessmentCandidatesView({ kind, assessmentId }: { kind: "ATTENDED" | "PASSED"; assessmentId: string }) {
  const searchParams = useSearchParams(); const router = useRouter(); const [input, setInput] = useState(searchParams.get("search") ?? ""); const search = useDebouncedValue(input); const page = Number(searchParams.get("page") ?? 1);
  const { data, isLoading, error } = useQuery({ queryKey: ["assessment-candidates", assessmentId, kind, page, search], queryFn: () => queries.assessmentCandidates(assessmentId, `?page=${page}&limit=10&kind=${kind}${search ? `&search=${encodeURIComponent(search)}` : ""}`) });
  const title = kind === "PASSED" ? "Passed candidates" : "Attended candidates"; const path = `/recruiter/assessments/${assessmentId}/${kind === "PASSED" ? "passed" : "attended"}`;
  function updateSearch(value: string) { setInput(value); router.replace(`${path}${value ? `?search=${encodeURIComponent(value)}` : ""}`); }
  return <div className="max-w-4xl"><PageIntro eyebrow="Recruiter workspace" title={title} description={kind === "PASSED" ? "Candidates who reached the passing score." : "Candidates who submitted an attempt for this assessment."} /><input value={input} onChange={(event) => updateSearch(event.target.value)} placeholder="Search candidates by name or email…" className="mt-8 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white" /><Card className="mt-5 p-0"><div className="divide-y divide-white/10">{isLoading ? [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-16" />) : error ? <div className="p-5"><EmptyState title="Candidates unavailable" description={error instanceof Error ? error.message : "Unable to load candidates."} /></div> : data?.items.length ? data.items.map((candidate) => <div key={String(candidate.id)} className="flex items-center justify-between gap-4 p-5"><div><p className="font-semibold text-white">{String(candidate.name ?? "Candidate")}</p><p className="text-sm text-slate-500">{String(candidate.email ?? "")}</p></div><p className="text-sm text-slate-400">Score: {String(candidate.score ?? 0)}/{String(candidate.maxScore ?? 0)}</p></div>) : <div className="p-5"><EmptyState title={`No ${kind === "PASSED" ? "passed" : "attended"} candidates`} description="Matching candidates will appear here after attempts are submitted." /></div>}<PaginationControls page={data?.pagination.page ?? page} totalPages={data?.pagination.totalPages ?? 0} onPage={(next) => router.push(`${path}?page=${next}${search ? `&search=${encodeURIComponent(search)}` : ""}`)} /></div></Card></div>;
}
