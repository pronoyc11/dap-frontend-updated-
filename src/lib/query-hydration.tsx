import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createQueryClient } from "./query-client";

export function createServerQueryClient() {
  return createQueryClient();
}

export function QueryHydrationBoundary({ children, queryClient }: { children: ReactNode; queryClient: ReturnType<typeof createQueryClient> }) {
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
