import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return <main className="grid min-h-screen place-items-center bg-[#07111f] p-6"><div className="w-full max-w-lg"><Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 font-black text-white"><span className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">A</span>atlas<span className="text-cyan-300">/</span>DAP</Link><section className="rounded-3xl border border-white/10 bg-[#0a1728] p-6 shadow-2xl shadow-black/20 sm:p-8"><h1 className="text-3xl font-black text-white">{title}</h1><p className="mt-2 text-slate-400">{description}</p>{children}</section></div></main>;
}
