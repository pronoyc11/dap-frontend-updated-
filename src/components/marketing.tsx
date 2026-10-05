import { cookies } from "next/headers";
import type { Role } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { Card } from "./ui";
import { MarketingNav } from "./marketing-nav";
export { MarketingNav } from "./marketing-nav";

export async function MarketingShell({ children }: { children: React.ReactNode }) {
  const role = (await cookies()).get("sessionRole")?.value;
  const initialRole =
    role === "ADMIN" || role === "RECRUITER" || role === "CANDIDATE" ? (role as Role) : null;
  return (
    <div className="grid-noise min-h-screen">
      <MarketingNav initialRole={initialRole} />
      {children}
      <footer className="mx-auto mt-24 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:justify-between">
        <span>© 2026 Atlas DAP</span>
        <span>Assess fairly. Hire confidently.</span>
      </footer>
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Icon className="size-5 text-cyan-300" />
      <h3 className="mt-5 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{children}</p>
    </Card>
  );
}
