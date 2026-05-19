'use client';

import { useState, useEffect } from 'react';
import { StudyBlock } from '@/types/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
import { usePlanner, useSavePlanner } from '@/hooks/queries/usePlanner';
import { useCourses } from '@/hooks/queries/useCourses';
import StudyBlockModal from './StudyBlockModal';
import TimeGridHeader from './TimeGridHeader';
import TimeGridBackground from './TimeGridBackground';
import TimeGridBlocks from './TimeGridBlocks';
import WeeklySummary from './WeeklySummary';
import TimeGridControlPanel from './TimeGridControlPanel';
import TimeGridMobileTabs from './TimeGridMobileTabs';

/**
 * [Component] TimeGrid
 * * 주간 학습 플래너의 핵심 조정자(Orchestrator) 역할을 담당합니다.
 * * - 상태 관리: Zustand 스토어(클라이언트 로컬 드래프트 상태)와 React Query(서버 상태)를 명확히 분리하여 바인딩합니다.
 * * - 반응형 디자인: 모바일 기기 크기 감지 및 렌더링 최적화를 진행하며, 하이드레이션 오류 방지를 위해 mounted 완료 후 마운팅 처리를 지원합니다.
 * * - 컴포넌트 설계: 단일 파일 100~120라인 이하 유지 규칙을 만족하기 위해 제어 패널(TimeGridControlPanel) 및 모바일 요일 탭바(TimeGridMobileTabs)를 개별 독립 컴포넌트로 완전히 격리하여 설계했습니다.
 */
export default function TimeGrid() {
  // Zustand 스토어 데이터 구조 바인딩
  const { weekStart, setWeekStart, blocks, setBlocks, isDirty, setDirty } =
    usePlannerStore();

  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 컴포넌트 마운트 추적 및 화면 해상도 변화 감지
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 모달 제어 상태
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    day?: string;
    hour?: string;
    block?: StudyBlock;
  }>({ isOpen: false, mode: 'create' });

  // 서버 통신(React Query) 훅 연동
  const { data: plannerData, isLoading } = usePlanner(weekStart);
  const { data: courseData } = useCourses();
  const { mutate: savePlanner, isPending: isSaving } = useSavePlanner();

  // 서버 데이터 수신 시 로컬 스토어에 동기화
  useEffect(() => {
    if (!isDirty && plannerData?.blocks) {
      setBlocks(plannerData.blocks);
    }
  }, [plannerData?.blocks, weekStart, isDirty, setBlocks]);

  // 페이지 이탈(새로고침/창 닫기) 시 미저장 변경사항 방지 팝업 트리거
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const courses = courseData?.courses || [];

  // 초기 로딩 상태 및 서버 마운트 완료 전 상태 뼈대 노출
  if (isLoading || !mounted) {
    return (
      <div className="flex flex-col justify-center items-center h-[600px] w-full text-gray-500 font-bold gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <span>시간표를 불러오는 중입니다...</span>
      </div>
    );
  }

  // 시간 빈 칸 클릭 시 추가 모달 오픈
  const handleCellClick = (day: string, hour: string) => {
    setModalState({ isOpen: true, mode: 'create', day, hour });
  };

  // 등록된 학습 블록 클릭 시 상세 편집 모달 오픈
  const handleBlockClick = (block: StudyBlock) => {
    setModalState({ isOpen: true, mode: 'edit', block });
  };

  // 모달 닫기
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // 주간 단위 이동 (이동 시 미저장 데이터 보호 안전장치 포함)
  const moveWeek = (days: number) => {
    if (isDirty) {
      const confirmMove = window.confirm(
        '⚠️ 저장하지 않은 변경사항이 있습니다. 다른 주로 이동하면 변경사항이 모두 사라집니다. 이동하시겠습니까?'
      );
      if (!confirmMove) return;
    }
    const current = new Date(weekStart);
    current.setDate(current.getDate() + days);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');

    setWeekStart(`${yyyy}-${mm}-${dd}`);
    setDirty(false);
  };

  // 로컬 스크롤에 임시 기록된 드래프트를 서버에 일괄 PUT 저장
  const handleBatchSave = () => {
    savePlanner(
      {
        weekStart,
        blocks,
      },
      {
        onSuccess: () => {
          setDirty(false);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 flex flex-col gap-6">
      {/* 1. 상단 제어 및 네비게이션 헤더 컴포넌트 */}
      <TimeGridControlPanel
        weekStart={weekStart}
        isDirty={isDirty}
        isSaving={isSaving}
        onMoveWeek={moveWeek}
        onSave={handleBatchSave}
      />

      {/* 2. 모바일 전용 세그먼티드 요일 선택 탭바 */}
      {isMobile && (
        <TimeGridMobileTabs
          selectedDayIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
        />
      )}

      {/* 3. 학습 스케줄 주간 그리드 본체 */}
      <div
        className={`relative rounded-3xl p-4 md:p-6 grid transition-all ${
          isMobile
            ? 'bg-gray-50/50 border border-gray-200 shadow-xl grid-cols-[65px_1fr] gap-x-2.5 gap-y-1'
            : 'bg-white border border-gray-300 grid-cols-8 shadow-sm'
        }`}
      >
        {/* 그리드: 요일 헤더 */}
        <TimeGridHeader
          isMobile={isMobile}
          selectedDayIndex={selectedDayIndex}
        />

        {/* 그리드: 배경 칸 및 마우스 클릭 핸들러 */}
        <TimeGridBackground
          isMobile={isMobile}
          selectedDayIndex={selectedDayIndex}
          onCellClick={handleCellClick}
        />

        {/* 그리드: 생성된 학습 블록 카드 */}
        <TimeGridBlocks
          isMobile={isMobile}
          selectedDayIndex={selectedDayIndex}
          blocks={blocks}
          courses={courses}
          onBlockClick={handleBlockClick}
        />
      </div>

      {/* 4. 실시간 주간 요약 통계 대시보드 */}
      <WeeklySummary blocks={blocks} courses={courses} />

      {/* 5. 학습 블록 생성/수정 상세 제어 모달 */}
      <StudyBlockModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        day={modalState.day}
        hour={modalState.hour}
        block={modalState.block}
        onClose={closeModal}
      />
    </div>
  );
}
