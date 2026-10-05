import Link from "next/link";
export default function PaymentCancel() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.25em] text-amber-300">
          Checkout canceled
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">Your assessment is still safe.</h1>
        <p className="mt-3 text-slate-400">
          No payment was recorded. You can return to the draft and try again when ready.
        </p>
        <Link className="mt-8 inline-block text-cyan-300 underline" href="/recruiter/assessments">
          Back to assessments
        </Link>
      </div>
    </main>
  );
}
