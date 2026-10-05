import { AssessmentCandidatesView } from "@/components/assessment-candidates";
export default async function PassedCandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssessmentCandidatesView kind="PASSED" assessmentId={id} />;
}
