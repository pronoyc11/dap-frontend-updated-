import { AssessmentCandidatesView } from "@/components/assessment-candidates";
export default async function AttendedCandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssessmentCandidatesView kind="ATTENDED" assessmentId={id} />;
}
