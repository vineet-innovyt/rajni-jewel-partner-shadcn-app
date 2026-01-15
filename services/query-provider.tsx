"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

interface IQueryProviderProps {
  children?: ReactNode;
}

const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 0,
      gcTime: 0,
    },
  },
});

export const QueryProvider: React.FC<IQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={appQueryClient}>
      {children}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
};
