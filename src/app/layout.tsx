import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Atlas DAP", template: "%s · Atlas DAP" }, description: "A modern developer assessment workspace for teams, candidates, and platform operators." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>; }
