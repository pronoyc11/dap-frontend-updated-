"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { Button, Card, Skeleton } from "@/components/ui";
import { PageIntro } from "@/components/dashboard";
import type { Problem } from "@/lib/types";
const input = "mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white";
export default function ProblemDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void queries
      .problem(id)
      .then(setProblem)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Problem unavailable"),
      );
  }, [id]);
  if (!problem && !error) return <Skeleton className="h-96" />;
  if (!problem) return <p className="text-rose-300">{error}</p>;
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = String(form.get("type"));
    const options = String(form.get("options") ?? "")
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);
    const body =
      type === "MCQ"
        ? {
            title: String(form.get("title")),
            question: String(form.get("question")),
            type,
            options,
            correctAnswer: String(form.get("correctAnswer")),
            points: Number(form.get("points")),
          }
        : {
            title: String(form.get("title")),
            question: String(form.get("question")),
            type,
            expectedAnswer: String(form.get("expectedAnswer")),
            points: Number(form.get("points")),
          };
    try {
      await api.patch(`/problems/${id}`, body);
      toast.success("Problem updated");
      router.push("/recruiter/problems");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to update problem";
      setError(message);
      toast.error(message);
    }
  }
  return (
    <div className="max-w-3xl">
      <PageIntro
        eyebrow="Problem bank"
        title="Edit problem"
        description="Update the reusable question used by your assessments."
      />
      <Card className="mt-8">
        <form className="space-y-5" onSubmit={save}>
          <label className="block text-sm font-semibold">
            Title
            <input name="title" defaultValue={problem.title} className={input} />
          </label>
          <label className="block text-sm font-semibold">
            Question
            <textarea name="question" defaultValue={problem.question} className={input} rows={5} />
          </label>
          <label className="block text-sm font-semibold">
            Type
            <select name="type" defaultValue={problem.type} className={input}>
              <option value="MCQ">Multiple choice</option>
              <option value="WRITTEN">Written answer</option>
            </select>
          </label>
          {problem.type === "MCQ" ? (
            <>
              <label className="block text-sm font-semibold">
                Options
                <textarea
                  name="options"
                  defaultValue={problem.options.join("\n")}
                  className={input}
                  rows={4}
                />
              </label>
              <label className="block text-sm font-semibold">
                Correct answer
                <input
                  name="correctAnswer"
                  defaultValue={problem.correctAnswer ?? ""}
                  className={input}
                />
              </label>
            </>
          ) : (
            <label className="block text-sm font-semibold">
              Expected answer
              <textarea
                name="expectedAnswer"
                defaultValue={problem.expectedAnswer ?? ""}
                className={input}
                rows={4}
              />
            </label>
          )}
          <label className="block text-sm font-semibold">
            Points
            <input name="points" type="number" defaultValue={problem.points} className={input} />
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/recruiter/problems")}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
