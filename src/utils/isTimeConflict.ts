import { StudyBlock } from '@/types/planner';

/**
 * 새로운 학습 블록이 기존의 블록들과 시간대가 겹치는지 검증하는 함수
 * - 요일(dayOfWeek)이 동일한 블록들을 대상으로 비교합니다.
 * - 충돌 조건: (신규_시작 < 기존_종료) AND (신규_종료 > 기존_시작)
 * - 인접한 시간(예: 10:00 종료 및 10:00 시작)은 충돌에서 제외합니다.
 */
export const getConflictingBlocks = (
  newBlock: StudyBlock,
  existingBlocks: StudyBlock[]
): StudyBlock[] => {
  return existingBlocks.filter((block) => {
    // 1. 요일이 다르면 충돌 가능성 없음
    if (block.dayOfWeek !== newBlock.dayOfWeek) {
      return false;
    }

    // 2. 겹침 확인 (표준 교집합 공식)
    return (
      newBlock.startTime < block.endTime && newBlock.endTime > block.startTime
    );
  });
};
