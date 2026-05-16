# LiveClass 학습 플래너

30분 단위의 정밀한 시간 블록으로 학습 계획을 관리하는 스터디 플래너 웹 애플리케이션입니다.

## 프로젝트 개요

<!-- TODO: 과제 구현 완료 후 구체적인 기능 설명 작성 -->

## 기술 스택

| 분류 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| Framework | Next.js (App Router) | 16 | 파일 기반 라우팅, SSR/CSR 유연한 렌더링 전략 |
| Language | TypeScript | 5 | 타입 안전성으로 30분 단위 시간 계산 로직의 신뢰성 확보 |
| Styling | Tailwind CSS | 4 | 유틸리티 퍼스트 접근으로 빠른 UI 프로토타이핑 |
| Server State | TanStack Query v5 | 5 | 서버 데이터 캐싱, 자동 갱신, 낙관적 업데이트 지원 |
| Client State | Zustand | 5 | 보일러플레이트 최소화, 선택적 리렌더링으로 UI 상태 관리 |
| Mock API | MSW v2 | 2 | 네트워크 레벨 API 모킹으로 실제 API와 동일한 개발 경험 |
| Package Manager | pnpm | - | 빠른 설치 속도 및 디스크 효율적 의존성 관리 |

## 실행 방법

```bash
# 1. 의존성 설치
pnpm install

# 2. 개발 서버 실행 (MSW 모킹 활성화)
pnpm dev

# 3. 프로덕션 빌드
pnpm build
pnpm start
```

### 환경 변수

```bash
# .env.local
NEXT_PUBLIC_API_MOCKING=enabled  # MSW 모킹 활성화 (개발 환경)
```

## 요구사항 해석 및 가정

<!-- TODO: 과제 요구사항에 대한 해석, 모호한 부분에 대한 가정 기술 -->

## 설계 결정과 이유

<!-- TODO: 주요 아키텍처 결정과 그 이유 -->
<!-- 예: 상태 관리 분리 전략 (서버 상태 vs 클라이언트 상태), 30분 단위 시간 모델링 방식, 컴포넌트 설계 원칙 등 -->

## 미구현 / 제약사항

<!-- TODO: 시간 제약으로 미구현된 기능이나 알려진 제약사항 기술 -->

## AI 활용 범위

<!-- TODO: AI 도구 활용 내역과 범위 기술 -->
