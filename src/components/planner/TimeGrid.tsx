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

export default function TimeGrid() {
  // Zustand 스토어에서 로컬 드래프트 상태들을 가져옵니다.
  const { weekStart, setWeekStart, blocks, setBlocks, isDirty, setDirty } =
    usePlannerStore();

  // 모달 상태 관리
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    day?: string;
    hour?: string;
    block?: StudyBlock;
  }>({ isOpen: false, mode: 'create' });

  const { data: plannerData, isLoading } = usePlanner(weekStart);
  const { data: courseData } = useCourses();
  const { mutate: savePlanner, isPending: isSaving } = useSavePlanner();

  // 1. 주간 시작일(weekStart)이 변경되거나 서버 데이터가 로드되면 로컬 스토어에 즉각 동기화 (stale 데이터 표시 방지)
  useEffect(() => {
    if (!isDirty) {
      setBlocks(plannerData?.blocks || []);
    }
  }, [plannerData?.blocks, weekStart, isDirty, setBlocks]);

  // 2. 브라우저 새로고침 및 이탈 방지 경고 처리 (dirty 상태인 경우)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // 표준 브라우저 경고 대화상자 트리거
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const courses = courseData?.courses || [];

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-[600px] w-full text-gray-500 font-bold gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <span>시간표를 불러오는 중입니다...</span>
      </div>
    );

  const handleCellClick = (day: string, hour: string) => {
    setModalState({ isOpen: true, mode: 'create', day, hour });
  };

  const handleBlockClick = (block: StudyBlock) => {
    setModalState({ isOpen: true, mode: 'edit', block });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // 주간 이동 핸들러 (미저장 변경사항이 있으면 확인창 표시)
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

    // 이동 시 로컬 상태 초기화 및 주간 시작일 갱신
    setWeekStart(`${yyyy}-${mm}-${dd}`);
    setDirty(false);
  };

  // 주간 날짜 범위 텍스트 파싱
  const getWeekRangeString = (startStr: string) => {
    const start = new Date(startStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const formatDate = (d: Date) => {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${mm}월 ${dd}일`;
    };

    return `${start.getFullYear()}년 ${formatDate(start)} ~ ${formatDate(end)}`;
  };

  // 일괄 저장 버튼 클릭 핸들러
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
      {/* 컨트롤 패널 상단 영역 */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm gap-4">
        {/* 주간 이동 내비게이션 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => moveWeek(-7)}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            ◀ 이전 주
          </button>
          <span className="text-lg font-bold text-gray-800 tracking-tight">
            {getWeekRangeString(weekStart)}
          </span>
          <button
            onClick={() => moveWeek(7)}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            다음 주 ▶
          </button>
        </div>

        {/* 저장 상태 표시 및 저장 버튼 */}
        <div className="flex items-center gap-4">
          {isDirty && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
              저장하지 않은 변경사항이 있습니다
            </div>
          )}

          <button
            onClick={handleBatchSave}
            disabled={isSaving || !isDirty}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
              isDirty
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                저장 중...
              </>
            ) : (
              '시간표 저장'
            )}
          </button>
        </div>
      </div>

      {/* 메인 7x25 요일 및 시간표 그리드 */}
      <div className="relative bg-white border-2 border-black rounded-2xl p-6 grid grid-cols-8 shadow-md">
        {/* 1. 상단 요일 헤더 */}
        <TimeGridHeader />

        {/* 2. 시간대별 배경 및 빈 셀 */}
        <TimeGridBackground onCellClick={handleCellClick} />

        {/* 3. 등록된 학습 블록(일정) 레이어 */}
        <TimeGridBlocks
          blocks={blocks}
          courses={courses}
          onBlockClick={handleBlockClick}
        />
      </div>

      {/* 4. 실시간 주간 요약 대시보드 */}
      <WeeklySummary blocks={blocks} courses={courses} />

      {/* 5. 블록 추가/상세 모달 */}
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
