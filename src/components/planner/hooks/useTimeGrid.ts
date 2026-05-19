import { useState, useEffect } from 'react';
import { StudyBlock } from '@/types/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
import { usePlanner, useSavePlanner } from '@/hooks/queries/usePlanner';
import { useCourses } from '@/hooks/queries/useCourses';

/**
 * TimeGrid 컴포넌트의 모든 상태 관리 및 비즈니스 로직을 격리한 커스텀 훅
 */
export default function useTimeGrid() {
  const { weekStart, setWeekStart, blocks, setBlocks, isDirty, setDirty } =
    usePlannerStore();

  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 컴포넌트 마운트 추적 및 모바일 감지
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

  // 쿼리 및 뮤테이션 연동
  const { data: plannerData, isLoading } = usePlanner(weekStart);
  const { data: courseData } = useCourses();
  const { mutate: savePlanner, isPending: isSaving } = useSavePlanner();

  // 데이터 동기화
  useEffect(() => {
    if (!isDirty && plannerData?.blocks) {
      setBlocks(plannerData.blocks);
    }
  }, [plannerData?.blocks, weekStart, isDirty, setBlocks]);

  // 이탈 방지
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

  // 주간 단위 이동
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

  // 스케줄 저장
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

  return {
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
  };
}
