'use client';

import { useState, useEffect, type ReactNode } from 'react';

/**
 * MSW(Mock Service Worker)를 클라이언트 사이드에서 초기화하는 Provider
 *
 * - 개발 환경(NEXT_PUBLIC_API_MOCKING === 'enabled')에서만 MSW를 활성화합니다.
 * - MSW 초기화가 완료되기 전까지 children 렌더링을 지연시켜
 *   mock되지 않은 요청이 발생하는 것을 방지합니다.
 * - SSR 환경에서 window 참조 에러를 방지하기 위해 dynamic import를 사용합니다.
 */
export default function MSWProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (
        typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
      ) {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
