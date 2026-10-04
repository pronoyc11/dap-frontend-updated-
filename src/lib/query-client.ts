import { QueryClient } from "@tanstack/react-query";

const defaultOptions = {
  queries: {
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
};

export function createQueryClient() {
  return new QueryClient({ defaultOptions });
}

let browserQueryClient: QueryClient | undefined;

export function getBrowserQueryClient() {
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}
