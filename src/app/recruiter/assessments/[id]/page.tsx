"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>(); const router = useRouter(); const [candidateId, setCandidateId] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["assessment", id], queryFn: () => queries.assessment(id) });
  const candidates = useQuery({ queryKey: ["candidates", "invite"], queryFn: () => queries.candidates("?page=1&limit=100") });
  if (isLoading) return <Skeleton className="h-96" />;
  if (!data) return <EmptyState title="Assessment not found" description="This assessment may have been deleted or is outside your workspace." />;
  async function ready() { try { await api.post(`/assessments/${id}/ready`); toast.success("Assessment marked ready"); router.refresh(); } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Unable to mark assessment ready"); } }
  async function pay() { try { const payment = await api.post<{ checkoutUrl: string }>(`/assessments/${id}/payment`); if (payment.checkoutUrl) window.location.href = payment.checkoutUrl; } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Unable to start payment"); } }
  async function invite() { if (!candidateId) { toast.error("Select a candidate first"); return; } try { await api.post(`/assessments/${id}/invitations`, { candidateId }); toast.success("Invitation sent"); setCandidateId(""); } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Unable to invite candidate"); } }
  return <><PageIntro eyebrow="Assessment authoring" title={data.title} description={data.description} /><div className="mt-6 flex flex-wrap items-center gap-3"><Badge tone={data.status === "PUBLISHED" ? "success" : "warning"}>{data.status}</Badge><span className="text-sm text-slate-500">{data.durationMinutes} minutes · passing score {data.passingScore}</span><div className="ml-auto flex gap-2">{data.status === "DRAFT" && <Button onClick={ready}>Mark ready</Button>}{data.status === "READY" && <Button onClick={pay}>Publish with Stripe</Button>}</div></div>{data.status === "PUBLISHED" && <Card className="mt-8"><h2 className="font-bold text-white">Invite a candidate</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row"><select value={candidateId} onChange={(event) => setCandidateId(event.target.value)} className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"><option value="">Select an active candidate</option>{candidates.data?.items.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} · {candidate.email}</option>)}</select><Button type="button" onClick={() => void invite()}>Send invitation</Button></div><p className="mt-3 text-xs text-slate-500">Only active, verified candidates can be invited to published assessments.</p></Card>}<Card className="mt-8"><h2 className="font-bold">Question snapshots</h2><div className="mt-5 space-y-3">{data.items?.length ? data.items.map((item) => <div key={item.id} className="rounded-xl bg-white/[.03] p-4"><div className="flex justify-between"><p className="font-semibold">{item.order}. {item.title}</p><span className="text-xs text-slate-500">{item.points} pts</span></div><p className="mt-2 text-sm text-slate-400">{item.question}</p></div>) : <EmptyState title="No questions yet" description="Add snapshots from your problem bank before marking the assessment ready." />}</div></Card></>;
}
