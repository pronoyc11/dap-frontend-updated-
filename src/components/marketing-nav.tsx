"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui";
import { ThemeToggle } from "./theme-toggle";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { toast } from "sonner";
export function MarketingNav() { const router = useRouter(); const queryClient = useQueryClient(); const { data: user, isLoading } = useQuery({ queryKey: ["auth", "me"], queryFn: queries.me, retry: false }); const dashboard = user?.role === "ADMIN" ? "/admin" : user?.role === "RECRUITER" ? "/recruiter" : "/dashboard"; async function logout() { await api.post("/auth/logout").catch(() => undefined); toast.success("Signed out successfully"); queryClient.removeQueries({ queryKey: ["auth"] }); router.refresh(); } return <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6"><Link href="/" className="flex items-center gap-3 font-black tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-cyan-400 text-slate-950">A</span><span>atlas<span className="text-cyan-300">/</span>DAP</span></Link><nav className="hidden gap-7 text-sm text-slate-300 md:flex"><Link href="/about">Platform</Link><Link href="/services">Solutions</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link></nav><div className="flex items-center gap-2"><ThemeToggle />{!isLoading && user ? <><Link href={dashboard}><Button variant="secondary">Dashboard</Button></Link><Button variant="ghost" onClick={() => void logout()}>Sign out</Button></> : !isLoading ? <><Link href="/login"><Button variant="ghost">Sign in</Button></Link><Link href="/register"><Button>Get started</Button></Link></> : null}</div></header>; }
