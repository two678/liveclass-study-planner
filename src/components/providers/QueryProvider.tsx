'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryProvider - TanStack Query v5의 QueryClientProvider를 App Router에 맞게 설정
 *
 * @description
 * 서버 상태(API 데이터)를 관리하는 TanStack Query의 컨텍스트를 제공합니다.
 *
 * ### 상태 관리 전략: TanStack Query vs Zustand 역할 분리
 *
 * 이 프로젝트에서는 **서버 상태와 클라이언트 상태를 명확히 분리**합니다:
 *
 * - **TanStack Query (서버 상태)**: 학습 계획 목록, 상세 데이터 등 API에서 가져오는 데이터.
 *   캐싱, 자동 갱신, 낙관적 업데이트를 프레임워크 레벨에서 처리합니다.
 *
 * - **Zustand (클라이언트 상태)**: 모달 열림/닫힘, 선택된 시간 블록, 드래그 상태 등
 *   서버와 무관한 순수 UI 상태. 선택적 구독(selector)으로 불필요한 리렌더링을 방지합니다.
 *
 * ### 핵심 설계 결정
 *
 * 1. **useState로 QueryClient 생성**
 *    - `new QueryClient()`를 컴포넌트 바깥(모듈 레벨)에 선언하면,
 *      서버와 클라이언트 간에 동일한 인스턴스가 공유되어 사용자 간 데이터 누출 위험이 있습니다.
 *    - `useState`의 초기화 함수를 사용하면 컴포넌트 인스턴스별로 격리된 QueryClient가 생성되고,
 *      리렌더링 시에도 동일한 인스턴스가 유지됩니다.
 *
 * 2. **staleTime: 60초**
 *    - 학습 플래너의 데이터는 실시간성보다 사용자 입력 기반이므로,
 *      60초간 캐시를 신선하게 유지하여 불필요한 네트워크 요청을 줄입니다.
 *    - 사용자가 직접 수정한 경우에는 mutation의 invalidateQueries로 즉시 갱신합니다.
 *
 * 3. **refetchOnWindowFocus: false**
 *    - 학습 플래너 특성상 다른 탭에서 데이터가 변경될 가능성이 낮으므로,
 *      탭 전환 시 불필요한 refetch를 방지하여 MSW 환경에서의 개발 경험을 개선합니다.
 *
 * 4. **retry: 1**
 *    - MSW mock 환경에서는 네트워크 불안정으로 인한 실패가 없으므로,
 *      빠른 에러 피드백을 위해 재시도를 1회로 제한합니다.
 *
 * ### 트레이드오프
 * - staleTime이 길어질수록 데이터 신선도는 떨어지지만, 학습 플래너의 데이터 특성상
 *   다른 사용자가 동시에 수정하는 시나리오가 없으므로 60초는 적절한 균형점입니다.
 * - 추후 실시간 협업 기능이 추가된다면 staleTime을 줄이거나
 *   WebSocket 기반 invalidation으로 전환이 필요합니다.
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
