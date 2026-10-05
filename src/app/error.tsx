"use client";
import { Button } from "@/components/ui";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[.25em] text-cyan-300">
          Something went wrong
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">The workspace hit a snag.</h1>
        <p className="mt-3 text-slate-400">
          Try the request again. If the API is offline, start the backend on port 5000.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
