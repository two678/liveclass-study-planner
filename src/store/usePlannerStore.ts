import { StudyBlock } from '@/types/planner';
import { isTimeConflict } from '@/utils/isTimeConflict';
import { startOfWeek } from '@/utils/dateHelpers';
import { create } from 'zustand';

/**
 * 학습 플래너 상태 타입
 * @property weekStart: 해당 주의 시작 날짜
 * @property setWeekStart: 해당 주의 시작 날짜를 설정하는 함수
 * @property blocks: 학습 블록 배열
 * @property addBlock: 블록을 추가하는 함수
 * @property deleteBlock: 블록을 삭제하는 함수
 * @property updateBlock: 블록을 수정하는 함수
 * @property conflictError: 시간 충돌 에러 메시지
 * @property clearError: 에러 메시지를 초기화하는 함수
 */
interface PlannerState {
  weekStart: string;
  setWeekStart: (dateStr: string) => void;
  blocks: StudyBlock[];
  addBlock: (block: StudyBlock) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<StudyBlock>) => void;
  conflictError: string | null;
  clearError: () => void;
}

/**
 * 학습 플래너 상태 관리 스토어
 * - addBlock: 블록 추가
 * - deleteBlock: 블록 삭제
 * - updateBlock: 블록 수정
 */
export const usePlannerStore = create<PlannerState>((set, get) => ({
  weekStart: startOfWeek(),
  setWeekStart: (dateStr: string) => set({ weekStart: dateStr }),
  blocks: [],
  conflictError: null,
  // 블록 추가
  addBlock: (block: StudyBlock) => {
    const currentBlock = get().blocks;

    // 시간 충돌 체크
    if (isTimeConflict(block, currentBlock)) {
      set({ conflictError: '⚠️ 선택하신 시간대에 이미 다른 일정이 있습니다!' });
      setTimeout(() => {
        set({ conflictError: null });
      }, 2000);
      return; // 시간 충돌 시 블록 추가 안 함
    }

    // 충돌이 없을 때만 블록 추가
    set((state) => ({ blocks: [...state.blocks, block] }));
  },
  // 블록 삭제
  deleteBlock: (id: string) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  // 블록 수정
  updateBlock: (id: string, updates: Partial<StudyBlock>) => {
    const currentBlocks = get().blocks;
    const targetBlock = currentBlocks.find((b) => b.id === id);

    if (!targetBlock) return;

    const updatedBlock = { ...targetBlock, ...updates } as StudyBlock;

    // 수정 중인 블록 제외한 나머지 블록들과만 충돌 검사
    const otherBlocks = currentBlocks.filter((b) => b.id !== id);

    if (isTimeConflict(updatedBlock, otherBlocks)) {
      set({ conflictError: '⚠️ 수정된 시간대에 이미 다른 일정이 있습니다!' });
      setTimeout(() => {
        set({ conflictError: null });
      }, 2000);
      return;
    }

    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? updatedBlock : block
      ),
    }));
  },
  clearError: () => set({ conflictError: null }),
}));
