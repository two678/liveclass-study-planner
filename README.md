# LiveClass 학습 플래너

30분 단위의 시간 블록으로 한 주의 학습 계획을 시각적으로 설계하고 분석할 수 있는 주간 학습 플래너 웹 애플리케이션입니다.

## 프로젝트 개요

본 프로젝트는 학습자가 주간 학습 스케줄을 직관적인 시간표 형식으로 관리하고, 등록된 학습 통계를 요일별/강의별로 실시간 집계하여 모니터링할 수 있는 도구입니다. **시간 기반 UI 처리**, **시간표 충돌 방지 알고리즘**, **서버 상태(Server State)와 로컬 편집 드래프트(Client State)의 격리 설계**를 통해 안정적인 반응형 레이아웃을 제공합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (Vanilla CSS 스타일 토큰 조율)
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Mock API**: MSW v2
- **Package Manager**: pnpm

## 실행 방법

```bash
# 1. 의존성 패키지 설치
pnpm install

# 2. 로컬 개발 서버 구동 (MSW v2 모킹 자동 활성화)
pnpm dev

# 3. 프로덕션 빌드 및 실행 검증
pnpm build
pnpm start
```

## 프로젝트 구조 설명

가독성과 유지보수성을 위해 단일 컴포넌트 라인 수(100~120라인 이하)를 철저히 지키며 도메인별 서브 디렉토리 구조로 분할 설계했습니다:

```text
src/components/planner/
├── block/
│   └── StudyBlockItem.tsx          # 타임테이블 상에 배치되는 개별 일정 카드 컴포넌트
├── grid/
│   ├── TimeGridBackground.tsx      # 마우스 클릭 이벤트를 감지하는 30분 단위 백그라운드 격자
│   ├── TimeGridBlocks.tsx          # 등록된 일정 블록 카드를 그리드 좌표 위에 매핑하는 래퍼
│   ├── TimeGridControlPanel.tsx    # 주차 이동 네비게이션 및 임시 저장 상태 배지 패널
│   ├── TimeGridHeader.tsx          # 타임라인 요일 및 시간 축 헤더 컴포넌트
│   └── TimeGridMobileTabs.tsx      # 모바일 뷰 전용 요일 탭 선택 컴포넌트
├── hooks/
│   └── useTimeGrid.ts              # TimeGrid의 비즈니스 로직과 React Lifecycle을 분리한 커스텀 훅
├── modal/
│   ├── StudyBlockModal.tsx         # 일정 생성/상세편집을 총괄하는 모달 프레임
│   ├── StudyBlockCreateForm.tsx    # 요일, 시간대(시작/종료), 강의선택, 메모 입력을 관리하는 생성 폼
│   └── StudyBlockEditForm.tsx      # 개별 스케줄의 상세 수정 및 안전 삭제를 수행하는 편집 폼
├── summary/
│   ├── WeeklySummary.tsx           # 주간 통계 및 리포트를 렌더링하는 메인 대시보드
│   ├── WeeklySummaryCourseWeight.tsx # 과목별 학습 분배 비중 비율 차트
│   ├── WeeklySummaryDayChart.tsx     # 요일별 누적 학습 시간 가로 막대 통계
│   ├── WeeklySummaryEmpty.tsx      # 이번 주 학습 블록이 없을 때 노출되는 안내 배너
│   └── WeeklySummaryTotalTime.tsx   # 총 누적 학습 시간 정보 카드
└── TimeGrid.tsx                     # 주간 플래너의 메인 페이지 컴포넌트 (97라인)
```

## 요구사항 해석 및 가정

1. **시간 충돌의 정의 (경계값 판정)**
   - **판정 기준**: 09:00~10:00 일정과 10:00~11:00 일정처럼 한 스케줄의 종료 시간과 다른 스케줄의 시작 시간이 정확히 일치하는 인접 경계 상황은 **시간 충돌로 판정하지 않습니다.**
   - **수식**: 두 스케줄 A, B에 대하여 `(A.startTime < B.endTime) && (A.endTime > B.startTime)` 조건이 참일 때만 겹침 충돌로 판정합니다.
2. **빈 주차 (블록 0개) 상태 처리**
   - **가정**: 이번 주 학습 일정이 아예 등록되지 않은 경우, 빈 레이아웃 대신 학습자 가이드를 돕는 친화적인 안내 배너(`WeeklySummaryEmpty.tsx`)를 제공하여 가독성을 높집니다.
3. **1시간 단위를 벗어나는 엣지 케이스**
   - **가정**: 사용자가 비정상적인 시간 간격(예: 09:15)을 기입하는 오작동을 차단하기 위해, 모달 입력 폼에서 드롭다운(`Select`) 구성 요소를 30분 간격 고정 목록으로 제한하며 시작 시간 이후의 옵션만 종료 시간 드롭다운에 노출되도록 필터링하여 **시간 역전 오입력을 원천 봉쇄**합니다.
4. **저장되지 않은 변경 사항의 유실 방지**
   - **가정**: 임의로 이탈하거나 새로고침할 때 브라우저 `beforeunload` 경고창을 연동하고, 다른 주차로 이동(`moveWeek`)하려 할 시 사용자에게 확인 대화상자(`confirm`)를 띄워 로컬 스케줄 데이터 유실을 능동적으로 보호합니다.

## 설계 결정과 이유

1. **서버 상태(Server State) vs 클라이언트 편집 상태(Client State) 분리**
   - **결정**: 서버 데이터 페칭은 TanStack Query(`usePlanner`)에 일임하고, 사용자의 드래프트 상태는 Zustand 스토어(`usePlannerStore`)로 관리하여 격리했습니다.
   - **이유**: 데이터 수정 시마다 실시간 서버 통신을 수행하면 네트워크 Latency로 인한 화면 덜컥거림 현상이 발생합니다. 따라서 로컬 Zustand 스토어에서 고속 드래프트 추가/삭제를 수행한 뒤, 최종적으로 상단의 **"저장"** 버튼을 눌러 일괄적으로 동기화(`PUT` 요청 및 `invalidateQueries`)하도록 설계하여 성능과 안정성을 극대화했습니다.
2. **반응형 30분 단위 CSS Grid 기반 배치**
   - **결정**: `absolute positioning` 방식 대신 순수 `CSS Grid` 행 좌표 모델을 채택했습니다.
   - **이유**: absolute 포지셔닝은 줌 배율 변경, 폰트 조절 또는 모바일 디바이스 렌더링 시 격자가 비틀어지고 깨집니다. 30분 간격 시간대를 그리드 행 인덱스로 공식화하여 `gridRowStart`와 `gridRowEnd` 값에 동적 매핑시킴으로써 반응형 정렬을 보장합니다.
3. **useTimeGrid 커스텀 훅을 통한 컴포넌트 다이어트**
   - **결정**: `TimeGrid.tsx` 내의 마운트 생명주기, 모바일 리사이즈 감지 이벤트, 모달 토글 로직, 쿼리 응답 동기화 효과를 `useTimeGrid` 커스텀 훅으로 완전 추출했습니다.
   - **이유**: UI 마크업 구조와 비즈니스 로직을 명확히 대칭 분리함으로써 가독성을 극적으로 끌어올리고 라인 제한(97라인)을 충실히 엄수했습니다.

## 미구현 / 제약사항

- **알려진 제약사항**: 현재 로컬 스토리지에 데이터를 백업하는 오프라인 영속화 레이어는 구현되어 있지 않으며, 최종 저장을 클릭하지 않은 상태에서 브라우저 메모리가 소멸되면 로컬 변경 사항은 리셋됩니다. (이탈 전 `beforeunload` 경고창을 통해 이를 적극 사전 안내합니다.)

## AI 활용 범위

- **AI pair-programming 어시스턴스**:
  - 단일 컴포넌트의 100라인 이하 분할 설계 구조 고도화 진행.
  - Playwright 브라우저 자동화 인스턴스를 기동하여, 30분 인접 시간 경계값 충돌 로직 및 MSW v2 모킹 연동 정상 여부를 브라우저 런타임 환경에서 정밀 모니터링 검증.
  - 한국어 기반 표준 코멘트 포맷 표준화 적용 및 Git 의미 단위 분할 커밋 반영 조율.
