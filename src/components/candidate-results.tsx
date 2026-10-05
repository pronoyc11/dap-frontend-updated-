"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge, Card, EmptyState, PaginationControls, Skeleton } from "@/components/ui";
import { PageIntro } from "./dashboard";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function CandidateResults() {
  const router = useRouter();
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("search") ?? "");
  const search = useDebouncedValue(input);
  const page = Number(params.get("page") ?? 1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["candidate-results", page, search],
    queryFn: () =>
      queries.attempts(
        `?page=${page}&limit=10${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
  function handleSearch(value: string) {
    setInput(value);
    router.replace(`/dashboard/payments${value ? `?search=${encodeURIComponent(value)}` : ""}`, {
      scroll: false,
    });
  }
  return (
    <>
      <PageIntro
        eyebrow="Candidate workspace"
        title="Results"
        description="Review every assessment attempt, score, evaluation state, and pass/fail result."
      />
      <input
        value={input}
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Search by assessment name…"
        aria-label="Search results by assessment name"
        className="mt-8 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white"
      />
      <Card className="mt-5 p-0">
        <div className="divide-y divide-white/10">
          {isLoading ? (
            [1, 2, 3].map((item) => <Skeleton key={item} className="m-5 h-24" />)
          ) : error ? (
            <div className="p-5">
              <EmptyState
                title="Results unavailable"
                description={error instanceof Error ? error.message : "Unable to load results."}
              />
            </div>
          ) : data?.items.length ? (
            data.items.map((attempt) => {
              const result = attempt.result;
              const evaluated = attempt.status === "EVALUATED" && result;
              const label = evaluated
                ? result.passed
                  ? "PASSED"
                  : "FAILED"
                : attempt.status === "SUBMITTED"
                  ? "AWAITING EVALUATION"
                  : attempt.status.replace("_", " ");
              return (
                <Link
                  key={attempt.id}
                  href={`/dashboard/payments/${attempt.id}`}
                  className="block p-5 transition hover:bg-white/[.04]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {attempt.assessment?.title ?? "Assessment"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {attempt.assessment?.description ?? "Assessment result details"}
                      </p>
                    </div>
                    <Badge tone={evaluated ? (result.passed ? "success" : "danger") : "warning"}>
                      {label}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
                    <span>
                      {evaluated
                        ? `Marks: ${result.totalScore}/${result.maxScore}`
                        : `Status: ${attempt.status.replace("_", " ")}`}
                    </span>
                    {evaluated && (
                      <span>
                        Percentage: {result.percentage}% · Passing score: {result.passingScore}%
                      </span>
                    )}
                    <span>View details →</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-5">
              <EmptyState
                title="No results yet"
                description="Your assessment attempts and evaluation results will appear here."
              />
            </div>
          )}
          <PaginationControls
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 0}
            onPage={(next) =>
              router.push(
                `/dashboard/payments?page=${next}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
              )
            }
          />
        </div>
      </Card>
    </>
  );
}
