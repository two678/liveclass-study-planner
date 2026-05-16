'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * TanStack Query Provider
 *
 * - QueryClient를 useState로 생성하여 서버/클라이언트 간 인스턴스 공유 문제를 방지합니다.
 * - staleTime을 60초로 설정하여 불필요한 refetch를 줄입니다.
 * - retry를 1회로 제한하여 실패 시 빠른 피드백을 제공합니다.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
