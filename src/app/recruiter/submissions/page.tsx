"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";
export default function SubmissionsPage() { const { data, isLoading } = useQuery({ queryKey: ["recruiter-assessments-for-submissions"], queryFn: () => queries.assessments("?page=1&limit=30") }); return <><PageIntro eyebrow="Recruiter workspace" title="Submissions" description="Review candidate work and evaluate written responses." /><div className="mt-8 grid gap-4">{isLoading ? <Skeleton className="h-32" /> : data?.items.length ? data.items.map((assessment) => <Link href={`/recruiter/submissions/${assessment.id}`} key={assessment.id}><Card className="transition hover:border-cyan-300/50"><div className="flex items-center justify-between"><div><p className="font-bold text-white">{assessment.title}</p><p className="mt-1 text-sm text-slate-500">Open candidate submissions</p></div><Badge>{assessment.status}</Badge></div></Card></Link>) : <EmptyState title="No submissions yet" description="Published assessments will collect candidate submissions here." />}</div></>; }
