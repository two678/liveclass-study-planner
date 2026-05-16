'use client';

import { useState, useEffect, type ReactNode } from 'react';

/**
 * MSWProvider - Mock Service Worker 초기화를 관리하는 클라이언트 Provider
 *
 * @description
 * Next.js App Router 환경에서 MSW v2를 안전하게 초기화합니다.
 *
 * ### 핵심 설계 결정
 *
 * 1. **Dynamic Import 사용 (`await import`)**
 *    - `msw/browser`의 `setupWorker`는 내부적으로 `window` 객체에 의존합니다.
 *    - Next.js의 SSR 단계에서 이 모듈이 import되면 `ReferenceError: window is not defined`가 발생합니다.
 *    - 따라서 `useEffect` 내부에서 dynamic import하여 클라이언트 사이드에서만 로드되도록 보장합니다.
 *
 * 2. **초기화 완료 전 렌더링 차단 (`isReady` 상태)**
 *    - MSW worker.start()는 비동기이므로, 초기화 완료 전에 컴포넌트가 렌더링되면
 *      TanStack Query 등에서 발생하는 API 요청이 mock되지 않은 채로 실행될 수 있습니다.
 *    - `isReady`가 true가 될 때까지 children을 렌더링하지 않아 이 문제를 방지합니다.
 *
 * 3. **환경변수 기반 활성화 (`NEXT_PUBLIC_API_MOCKING`)**
 *    - `process.env.NODE_ENV` 대신 별도 환경변수를 사용하여,
 *      개발 환경에서도 실제 API를 사용하거나 프로덕션 미리보기에서 mock을 쓰는 등
 *      유연한 제어가 가능합니다.
 *
 * 4. **onUnhandledRequest: 'bypass'**
 *    - 핸들러가 정의되지 않은 요청(Next.js 내부 요청, 정적 파일 등)은
 *      경고 없이 통과시켜 콘솔 노이즈를 방지합니다.
 *
 * ### 트레이드오프
 * - 초기화 완료 전까지 화면이 빈 상태(`null`)로 표시됩니다.
 *   실제 프로덕션에서는 MSW가 비활성화되므로 영향이 없지만,
 *   개발 환경에서 초기 로딩이 약간 지연될 수 있습니다.
 * - 로딩 스피너를 표시하는 대안도 있으나, MSW 초기화는 일반적으로 100ms 이내이므로
 *   깜빡임 없이 null을 반환하는 것이 UX상 더 자연스럽습니다.
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
