"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient with simple configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry once on failure
            retry: 1,
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === "development",
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
