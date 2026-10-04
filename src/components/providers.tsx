"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { getBrowserQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const client: QueryClient = getBrowserQueryClient();
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><QueryClientProvider client={client}>{children}<Toaster richColors position="top-right" /></QueryClientProvider></ThemeProvider>;
}
