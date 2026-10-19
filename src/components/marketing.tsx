import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui";
import { MarketingNav } from "./marketing-nav";
export { MarketingNav } from "./marketing-nav";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-noise min-h-screen">
      <MarketingNav />
      <div className="pt-[4.75rem] sm:pt-[5.5rem]">{children}</div>
      <footer className="mx-auto mt-24 grid max-w-7xl gap-8 border-t border-white/10 px-6 py-10 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-black tracking-tight text-white">
            atlas<span className="text-cyan-300">/</span>DAP
          </p>
          <p className="mt-3 max-w-xs leading-6">Assess fairly. Hire confidently.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-200">Explore</p>
          <div className="mt-3 grid gap-2">
            <Link className="transition hover:text-cyan-300" href="/about">
              Platform
            </Link>
            <Link className="transition hover:text-cyan-300" href="/services">
              Solutions
            </Link>
            <Link className="transition hover:text-cyan-300" href="/pricing">
              Pricing
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-200">Support</p>
          <div className="mt-3 grid gap-2">
            <Link className="transition hover:text-cyan-300" href="/contact">
              Contact the team
            </Link>
            <a className="transition hover:text-cyan-300" href="mailto:pronoyc11@gmail.com">
              pronoyc11@gmail.com
            </a>
            <Link className="transition hover:text-cyan-300" href="/register">
              Create a workspace
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-200">Get in touch</p>
          <p className="mt-3 leading-6">
            Questions about setup, assessment authoring, or deployment?
          </p>
          <a
            className="mt-2 inline-block transition hover:text-cyan-300"
            href="mailto:pronoyc11@gmail.com"
          >
            Email the team
          </a>
          <p className="mt-6 text-xs">© 2026 Atlas DAP</p>
        </div>
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
