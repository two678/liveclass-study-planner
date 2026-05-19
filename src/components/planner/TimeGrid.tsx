'use client';

import useTimeGrid from './hooks/useTimeGrid';
import StudyBlockModal from './modal/StudyBlockModal';
import TimeGridHeader from './grid/TimeGridHeader';
import TimeGridBackground from './grid/TimeGridBackground';
import TimeGridBlocks from './grid/TimeGridBlocks';
import WeeklySummary from './summary/WeeklySummary';
import TimeGridControlPanel from './grid/TimeGridControlPanel';
import TimeGridMobileTabs from './grid/TimeGridMobileTabs';

/**
 * 주간 학습 플래너 메인 컨테이너 컴포넌트
 * - 비즈니스 로직과 React state lifecycle은 useTimeGrid 커스텀 훅으로 격리하고, Presenter 역할에 집중합니다.
 */
export default function TimeGrid() {
  const {
    weekStart,
    blocks,
    isDirty,
    isSaving,
    mounted,
    selectedDayIndex,
    isMobile,
    modalState,
    courses,
    isLoading,
    setSelectedDayIndex,
    handleCellClick,
    handleBlockClick,
    closeModal,
    moveWeek,
    handleBatchSave,
  } = useTimeGrid();

  // 로딩 상태
  if (isLoading || !mounted) {
    return (
      <div className="flex flex-col justify-center items-center h-150 w-full text-gray-500 font-bold gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <span>시간표를 불러오는 중입니다...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-360 mx-auto px-4 flex flex-col gap-6">
      {/* 상단 패널 */}
      <TimeGridControlPanel
        weekStart={weekStart}
        isDirty={isDirty}
        isSaving={isSaving}
        onMoveWeek={moveWeek}
        onSave={handleBatchSave}
      />

      {/* 모바일 요일 선택 탭 */}
      {isMobile && (
        <TimeGridMobileTabs
          selectedDayIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
        />
      )}

      {/* 그리드 본체 */}
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

      {/* 주간 학습 요약 */}
      <WeeklySummary blocks={blocks} courses={courses} />

      {/* 상세 모달 */}
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
