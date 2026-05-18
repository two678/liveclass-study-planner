import { StudyBlock } from '@/types/planner';
import { isTimeConflict } from '@/utils/isTimeConflict';
import { create } from 'zustand';

/**
 * 학습 플래너 상태 관리 스토어
 * - addBlock: 블록 추가
 * - deleteBlock: 블록 삭제
 * - updateBlock: 블록 수정
 */

// 상태 인터페이스 정의
interface PlannerState {
  blocks: StudyBlock[];
  addBlock: (block: StudyBlock) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<StudyBlock>) => void;
  conflictError: string | null;
  clearError: () => void;
}

// 스토어 생성
export const usePlannerStore = create<PlannerState>((set, get) => ({
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
