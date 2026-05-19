'use client';
import { useState, useEffect } from 'react';
import { StudyBlock } from '@/types/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
import { usePlanner } from '@/hooks/queries/usePlanner';
import { useCourses } from '@/hooks/queries/useCourses';
import StudyBlockModal from './StudyBlockModal';
import TimeGridHeader from './TimeGridHeader';
import TimeGridBackground from './TimeGridBackground';
import TimeGridBlocks from './TimeGridBlocks';

export default function TimeGrid() {
  // Zustand 스토어에서 상태를 가져옵니다.
  const { weekStart, setBlocks } = usePlannerStore();

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

  useEffect(() => {
    if (plannerData?.blocks) {
      setBlocks(plannerData.blocks);
    }
  }, [plannerData?.blocks, setBlocks]);

  const blocks = plannerData?.blocks || [];
  const courses = courseData?.courses || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] w-full text-gray-500 font-bold">
        시간표를 불러오는 중입니다...
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

  return (
    <div className="relative bg-white border-2 border-black rounded-lg w-full max-w-[1440px] h-full mx-auto p-6 grid grid-cols-8">
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

      {/* 4. 블록 추가/상세 모달 */}
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
