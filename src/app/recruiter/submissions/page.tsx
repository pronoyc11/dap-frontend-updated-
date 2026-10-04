"use client";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";
export default function SubmissionsPage() { const { data, isLoading } = useQuery({ queryKey: ["recruiter-assessments-for-submissions"], queryFn: () => queries.assessments("?page=1&limit=30") }); return <><PageIntro eyebrow="Recruiter workspace" title="Submissions" description="Review candidate work and evaluate written responses." /><div className="mt-8 grid gap-4">{isLoading ? <Skeleton className="h-32" /> : data?.items.length ? data.items.map((assessment) => <Card key={assessment.id}><div className="flex items-center justify-between"><div><p className="font-bold text-white">{assessment.title}</p><p className="mt-1 text-sm text-slate-500">Open the assessment to view its submissions.</p></div><Badge>{assessment.status}</Badge></div></Card>) : <EmptyState title="No submissions yet" description="Published assessments will collect candidate submissions here." />}</div></>; }
