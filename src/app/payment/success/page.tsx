import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export default function PaymentSuccess() { return <main className="grid min-h-screen place-items-center p-6 text-center"><div><CheckCircle2 className="mx-auto size-16 text-emerald-300" /><h1 className="mt-6 text-4xl font-black text-white">Payment received</h1><p className="mt-3 text-slate-400">Stripe is processing the webhook. Your assessment will publish once confirmed.</p><Link className="mt-8 inline-block text-cyan-300 underline" href="/recruiter/assessments">Return to assessments</Link></div></main>; }
