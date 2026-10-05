"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";
import { PageIntro } from "./dashboard";

const input =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400";
function Field({
  label,
  value,
  onChange,
  area,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  area?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      {area ? (
        <textarea
          rows={4}
          className={input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type={type}
          className={input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export function ProblemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<"MCQ" | "WRITTEN">("MCQ");
  const [options, setOptions] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [points, setPoints] = useState("1");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const optionList = options
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const payload =
      type === "MCQ"
        ? { title, question, type, options: optionList, correctAnswer, points: Number(points) }
        : { title, question, type, expectedAnswer, points: Number(points) };
    if (
      title.trim().length < 3 ||
      question.trim().length < 1 ||
      Number(points) < 1 ||
      (type === "MCQ" && (optionList.length < 2 || !optionList.includes(correctAnswer)))
    ) {
      setError(
        "Complete the fields correctly. MCQ problems need at least two options and a matching correct answer.",
      );
      return;
    }
    setPending(true);
    try {
      await api.post("/problems", payload);
      toast.success("Problem created");
      router.push("/recruiter/problems");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to create problem";
      setError(message);
      toast.error(message);
      setPending(false);
    }
  }
  return (
    <div className="max-w-3xl">
      <PageIntro
        eyebrow="Problem bank"
        title="Create a problem"
        description="Use a focused prompt that measures a real engineering skill."
      />
      <Card className="mt-8">
        <form className="space-y-5" onSubmit={submit}>
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Question" value={question} onChange={setQuestion} area />
          <label className="block text-sm font-semibold text-slate-200">
            Question type
            <select
              className={input}
              value={type}
              onChange={(event) => setType(event.target.value as "MCQ" | "WRITTEN")}
            >
              <option value="MCQ">Multiple choice</option>
              <option value="WRITTEN">Written answer</option>
            </select>
          </label>
          {type === "MCQ" ? (
            <>
              <Field label="Options (one per line)" value={options} onChange={setOptions} area />
              <Field label="Correct answer" value={correctAnswer} onChange={setCorrectAnswer} />
            </>
          ) : (
            <Field
              label="Expected answer"
              value={expectedAnswer}
              onChange={setExpectedAnswer}
              area
            />
          )}
          <Field label="Points" value={points} onChange={setPoints} type="number" />
          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving problem…" : "Save problem"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export function AssessmentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [passing, setPassing] = useState("60");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const payload = {
      title,
      description,
      durationMinutes: Number(duration),
      passingScore: Number(passing),
    };
    if (
      title.trim().length < 3 ||
      Number(duration) < 1 ||
      Number(passing) < 0 ||
      Number(passing) > 100
    ) {
      setError("Enter a title, a positive duration, and a passing score from 0 to 100.");
      return;
    }
    setPending(true);
    try {
      const assessment = await api.post<{ id: string }>("/assessments", payload);
      toast.success("Assessment draft created");
      router.push(`/recruiter/assessments/${assessment.id}`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to create assessment";
      setError(message);
      toast.error(message);
      setPending(false);
    }
  }
  return (
    <div className="max-w-3xl">
      <PageIntro
        eyebrow="Assessment authoring"
        title="Create an assessment"
        description="Start with metadata, then add ordered questions from your problem bank."
      />
      <Card className="mt-8">
        <form className="space-y-5" onSubmit={submit}>
          <Field label="Assessment title" value={title} onChange={setTitle} />
          <Field label="Description" value={description} onChange={setDescription} area />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Duration (minutes)"
              value={duration}
              onChange={setDuration}
              type="number"
            />
            <Field label="Passing score (%)" value={passing} onChange={setPassing} type="number" />
          </div>
          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating assessment…" : "Create draft"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
