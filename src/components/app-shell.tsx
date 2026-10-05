"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { queries } from "@/lib/queries";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { Role } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";
import { clearSessionHint } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";

const nav: Record<
  Role,
  { href: string; label: string; icon: typeof LayoutDashboard }[]
> = {
  ADMIN: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/applications", label: "Applications", icon: ShieldCheck },
    { href: "/admin/audit-logs", label: "Audit logs", icon: FileText },
    { href: "/admin/profile", label: "Profile", icon: UserRound },
  ],
  RECRUITER: [
    { href: "/recruiter", label: "Overview", icon: LayoutDashboard },
    { href: "/recruiter/problems", label: "Problem bank", icon: BookOpen },
    {
      href: "/recruiter/assessments",
      label: "Assessments",
      icon: ClipboardList,
    },
    { href: "/recruiter/submissions", label: "Submissions", icon: BarChart3 },
    { href: "/recruiter/candidates", label: "Candidates", icon: Users },
    { href: "/recruiter/profile", label: "Company profile", icon: Settings },
  ],
  CANDIDATE: [
    { href: "/dashboard", label: "My activity", icon: LayoutDashboard },
    {
      href: "/dashboard/invitations",
      label: "Invitations",
      icon: ClipboardList,
    },
    { href: "/dashboard/payments", label: "Results", icon: BarChart3 },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
};
export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: Role;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!user)
      queries
        .me()
        .then((profile) => {
          setUser(profile);
          if (profile.role !== role)
            router.replace(
              profile.role === "ADMIN"
                ? "/admin"
                : profile.role === "RECRUITER"
                ? "/recruiter"
                : "/dashboard"
            );
        })
        .catch(() => router.push("/login"));
    else if (user.role !== role)
      router.replace(
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "RECRUITER"
          ? "/recruiter"
          : "/dashboard"
      );
  }, [user, role, setUser, router]);
  async function logout() {
    setUser(null);
    queryClient.clear();
    clearSessionHint();
    await api.post("/auth/logout").catch(() => undefined);
    toast.success("Signed out successfully");
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="min-h-screen bg-[#07111f]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-[#0a1728] p-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid size-9 place-items-center rounded-xl bg-cyan-400 text-slate-950">
              A
            </span>
            atlas<span className="text-cyan-300">/</span>DAP
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="mt-10 space-y-1">
          {nav[role].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                pathname === href
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-5 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white/10 text-xs font-bold">
              {initials(user?.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "Loading"}
              </p>
              <p className="text-xs text-slate-500">{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#07111f]/80 px-5 backdrop-blur lg:px-10">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm text-slate-400">
            <ThemeToggle />
            <span className="hidden sm:inline">
              {role === "ADMIN"
                ? "Platform control"
                : role === "RECRUITER"
                ? "Recruiting workspace"
                : "Candidate workspace"}
            </span>
            <span className="size-2 rounded-full bg-emerald-400" />
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
