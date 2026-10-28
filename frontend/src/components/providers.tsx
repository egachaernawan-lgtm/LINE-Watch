"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState, type ReactNode } from "react";

import { demoMode } from "@/lib/demo";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } }),
  );
  const app = <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return demoMode ? app : <SessionProvider>{app}</SessionProvider>; // the demo has no sessions
}
