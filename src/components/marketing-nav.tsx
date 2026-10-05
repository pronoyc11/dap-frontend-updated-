"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui";
import { ThemeToggle } from "./theme-toggle";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { clearSessionHint } from "@/lib/session";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

const links = [
  ["/about", "Platform"],
  ["/services", "Solutions"],
  ["/pricing", "Pricing"],
  ["/contact", "Contact"],
] as const;

export function MarketingNav({ initialRole }: { initialRole: Role | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: user, isLoading, isError } = useQuery({ queryKey: ["auth", "me"], queryFn: queries.me, retry: false });
  const role = user?.role ?? (isLoading ? initialRole : null);
  const dashboard = role === "ADMIN" ? "/admin" : role === "RECRUITER" ? "/recruiter" : "/dashboard";

  async function logout() {
    await api.post("/auth/logout").catch(() => undefined);
    clearSessionHint();
    toast.success("Signed out successfully");
    queryClient.removeQueries({ queryKey: ["auth"] });
    setOpen(false);
    router.refresh();
  }

  function closeMenu() {
    setOpen(false);
  }

  return <>
    {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/60 md:hidden" onClick={closeMenu} />}
    <header className="relative z-40 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6">
      <Link href="/" onClick={closeMenu} className="flex items-center gap-3 font-black tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-cyan-400 text-slate-950">A</span><span>atlas<span className="text-cyan-300">/</span>DAP</span></Link>
      <nav className="hidden gap-7 text-sm text-slate-300 md:flex">{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="flex items-center gap-2"><ThemeToggle /><div className="hidden items-center gap-2 sm:flex">{role && !isError ? <><Link href={dashboard}><Button variant="secondary">Dashboard</Button></Link><Button variant="ghost" onClick={() => void logout()}>Sign out</Button></> : !isLoading ? <><Link href="/login"><Button variant="ghost">Sign in</Button></Link><Link href="/register"><Button>Get started</Button></Link></> : null}</div><button aria-label={open ? "Close menu" : "Open menu"} className="rounded-xl p-2 text-slate-200 hover:bg-white/10 md:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
      {open && <div className="absolute inset-x-4 top-full rounded-2xl border border-white/10 bg-[#0a1728] p-4 shadow-2xl md:hidden"><nav className="grid gap-1 text-sm text-slate-200">{links.map(([href, label]) => <Link key={href} href={href} onClick={closeMenu} className="rounded-xl px-3 py-3 hover:bg-white/10">{label}</Link>)}</nav><div className="mt-3 grid gap-2 border-t border-white/10 pt-3">{role && !isError ? <><Link href={dashboard} onClick={closeMenu}><Button className="w-full" variant="secondary">Dashboard</Button></Link><Button variant="ghost" onClick={() => void logout()}>Sign out</Button></> : !isLoading ? <><Link href="/login" onClick={closeMenu}><Button className="w-full" variant="ghost">Sign in</Button></Link><Link href="/register" onClick={closeMenu}><Button className="w-full">Get started</Button></Link></> : null}</div></div>}
    </header>
  </>;
}
