"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>(); const router = useRouter();
  const { data, isLoading } = useQuery({ queryKey: ["assessment", id], queryFn: () => queries.assessment(id) });
  if (isLoading) return <Skeleton className="h-96" />;
  if (!data) return <EmptyState title="Assessment not found" description="This assessment may have been deleted or is outside your workspace." />;
  async function ready() { try { await api.post(`/assessments/${id}/ready`); toast.success("Assessment marked ready"); router.refresh(); } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Unable to mark assessment ready"); } }
  async function pay() { try { const payment = await api.post<{ checkoutUrl: string }>(`/assessments/${id}/payment`); if (payment.checkoutUrl) window.location.href = payment.checkoutUrl; } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Unable to start payment"); } }
  return <><PageIntro eyebrow="Assessment authoring" title={data.title} description={data.description} /><div className="mt-6 flex flex-wrap items-center gap-3"><Badge tone={data.status === "PUBLISHED" ? "success" : "warning"}>{data.status}</Badge><span className="text-sm text-slate-500">{data.durationMinutes} minutes · passing score {data.passingScore}</span><div className="ml-auto flex flex-wrap gap-2">{(data.status === "DRAFT" || data.status === "READY") && <Link href={`/recruiter/assessments/${id}/problems`}><Button variant="secondary"><Plus className="mr-2 size-4" />Add problems</Button></Link>}{data.status === "DRAFT" && <Button onClick={ready}>Mark ready</Button>}{data.status === "READY" && <Button onClick={pay}>Publish with Stripe</Button>}{data.status === "PUBLISHED" && <><Link href={`/recruiter/assessments/${id}/invite`}><Button>Invite a candidate</Button></Link><Link href={`/recruiter/assessments/${id}/attended`}><Button variant="secondary">Attended candidates</Button></Link><Link href={`/recruiter/assessments/${id}/passed`}><Button variant="secondary">Passed candidates</Button></Link></>}</div></div><Card className="mt-8"><h2 className="font-bold">Question snapshots</h2><div className="mt-5 space-y-3">{data.items?.length ? data.items.map((item) => <div key={item.id} className="rounded-xl bg-white/[.03] p-4"><div className="flex justify-between"><p className="font-semibold">{item.order}. {item.title}</p><span className="text-xs text-slate-500">{item.points} pts</span></div><p className="mt-2 text-sm text-slate-400">{item.question}</p></div>) : <EmptyState title="No questions yet" description="Add snapshots from your problem bank before marking the assessment ready." />}</div></Card></>;
}
