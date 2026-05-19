import { StudyBlock, SavePlannerRequest, Course } from '@/types/planner';
import { getConflictingBlocks } from '@/utils/isTimeConflict';
import { startOfWeek } from '@/utils/dateHelpers';
import { DAYS } from '@/constants/planner';
import { create } from 'zustand';

/**
 * 학습 플래너 상태 타입
 * @property weekStart: 해당 주의 시작 날짜
 * @property setWeekStart: 해당 주의 시작 날짜를 설정하는 함수
 * @property blocks: 학습 블록 배열
 * @property setBlocks: 서버 응답으로 블록 배열을 교체하는 함수
 * @property addBlock: 클라이언트 충돌 체크 후 블록 추가 (충돌 시 false 반환)
 * @property deleteBlock: 블록을 삭제하는 함수
 * @property updateBlock: 블록을 수정하는 함수 (충돌 시 false 반환)
 * @property conflictError: 시간 충돌 에러 메시지
 * @property clearError: 에러 메시지를 초기화하는 함수
 */
interface PlannerState {
  weekStart: string;
  setWeekStart: (dateStr: string) => void;
  blocks: StudyBlock[];
  setBlocks: (blocks: StudyBlock[]) => void;
  addBlock: (
    block: SavePlannerRequest['blocks'][number],
    courses?: Course[]
  ) => boolean;
  deleteBlock: (id: string) => void;
  updateBlock: (
    id: string,
    updates: Partial<StudyBlock>,
    courses?: Course[]
  ) => boolean;
  conflictError: string | null;
  clearError: () => void;
}

/**
 * 학습 플래너 상태 관리 스토어
 * - setBlocks: 서버 응답으로 블록 배열 교체
 * - addBlock: 클라이언트 충돌 체크 후 블록 추가
 * - deleteBlock: 블록 삭제
 * - updateBlock: 블록 수정
 */
export const usePlannerStore = create<PlannerState>((set, get) => ({
  weekStart: startOfWeek(),
  setWeekStart: (dateStr: string) => set({ weekStart: dateStr }),
  blocks: [],
  conflictError: null,
  setBlocks: (blocks: StudyBlock[]) => set({ blocks }),
  // 클라이언트 충돌 체크 — 충돌 시 false 반환, 성공 시 true
  addBlock: (
    block: SavePlannerRequest['blocks'][number],
    courses?: Course[]
  ) => {
    const currentBlocks = get().blocks;

    // 시간 충돌 체크
    const conflicts = getConflictingBlocks(block as StudyBlock, currentBlocks);

    if (conflicts.length > 0) {
      const conflictMsgs = conflicts.map((c) => {
        const dayStr = DAYS[c.dayOfWeek] + '요일';
        const courseTitle =
          courses?.find((course) => course.id === c.courseId)?.title ||
          '알 수 없는 강의';
        return `• [${dayStr} ${c.startTime}~${c.endTime} ${courseTitle}]`;
      });

      const message = `⚠️ 아래의 기존 일정들과 시간이 겹칩니다:\n${conflictMsgs.join('\n')}`;

      set({ conflictError: message });
      setTimeout(() => {
        set({ conflictError: null });
      }, 4000);
      return false;
    }

    return true;
  },
  // 블록 삭제
  deleteBlock: (id: string) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  // 블록 수정
  updateBlock: (
    id: string,
    updates: Partial<StudyBlock>,
    courses?: Course[]
  ) => {
    const currentBlocks = get().blocks;
    const targetBlock = currentBlocks.find((b) => b.id === id);

    if (!targetBlock) return false;

    const updatedBlock = { ...targetBlock, ...updates } as StudyBlock;

    // 수정 중인 블록 제외한 나머지 블록들과만 충돌 검사
    const otherBlocks = currentBlocks.filter((b) => b.id !== id);

    const conflicts = getConflictingBlocks(updatedBlock, otherBlocks);

    if (conflicts.length > 0) {
      const conflictMsgs = conflicts.map((c) => {
        const dayStr = DAYS[c.dayOfWeek] + '요일';
        const courseTitle =
          courses?.find((course) => course.id === c.courseId)?.title ||
          '알 수 없는 강의';
        return `• [${dayStr} ${c.startTime}~${c.endTime} ${courseTitle}]`;
      });

      const message = `⚠️ 아래의 기존 일정들과 시간이 겹칩니다:\n${conflictMsgs.join('\n')}`;

      set({ conflictError: message });
      setTimeout(() => {
        set({ conflictError: null });
      }, 4000);
      return false;
    }

    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? updatedBlock : block
      ),
    }));

    return true;
  },
  clearError: () => set({ conflictError: null }),
}));
