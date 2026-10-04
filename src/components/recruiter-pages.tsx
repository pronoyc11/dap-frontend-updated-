"use client";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Button, Card, Skeleton } from "@/components/ui";
import { PageIntro } from "./dashboard";
export function RecruiterProfile() { const { data, isLoading } = useQuery({ queryKey: ["recruiter-profile"], queryFn: queries.recruiterProfile }); if (isLoading) return <Skeleton className="h-80" />; return <><PageIntro eyebrow="Recruiter workspace" title="Company profile" description="This identity appears across your assessment experience." /><Card className="mt-8 max-w-2xl"><p className="text-xl font-bold text-white">{String(data?.companyName ?? "Your company")}</p><p className="mt-3 text-slate-400">{String(data?.companyDescription ?? "Add a company description to give candidates useful context.")}</p><Button className="mt-8">Edit profile</Button></Card></>; }
