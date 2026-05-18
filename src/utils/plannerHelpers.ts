import { StudyBlock } from '@/types/planner';
import { DAYS } from '@/constants/planner';

/**
 * @description 새로운 블록이 기존 블록들과 시간이 겹치는지 확인
 * @param newBlock - 새로 추가할 블록
 * @param existingBlocks - 기존 블록 배열
 * @returns 겹치면 true, 아니면 false
 */
export const isOverlapping = (
  newBlock: StudyBlock,
  existingBlock: StudyBlock
): boolean => {
  if (newBlock.dayOfWeek !== existingBlock.dayOfWeek) return false;
  return (
    newBlock.startTime < existingBlock.endTime &&
    newBlock.endTime > existingBlock.startTime
  );
};

/**
 * @description 충돌하는 블록의 요일과 시간을 바탕으로 충돌 메시지 생성
 * @param dayOfWeek - 요일 (0:월, 1:화, ... 6:일)
 * @param startTime - 시작 시간 (HH:mm)
 * @param endTime - 종료 시간 (HH:mm)
 * @returns "요일 HH:mm~HH:mm" 형식의 문자열
 */

export const getConflictMessage = (
  dayOfWeek: number,
  startTime: string,
  endTime: string
): string => {
  const dayString = DAYS[dayOfWeek];
  return `${dayString}요일 ${startTime}~${endTime}과 충돌합니다.`;
};

/**
 *
 * @param newBlock - 추가하려는 새 블록
 * @param existingBlocks - 기존 블록 배열
 * @returns 충돌하는 블록이 있으면 메시지 반환, 없으면 null 반환
 */
export const validateConflict = (
  newBlock: StudyBlock,
  existingBlocks: StudyBlock[]
) => {
  const conflict = existingBlocks.find((existingBlock) => {
    if (newBlock.id && existingBlock.id === newBlock.id) return false;
    return isOverlapping(newBlock, existingBlock);
  });

  if (conflict) {
    return getConflictMessage(
      conflict.dayOfWeek,
      conflict.startTime,
      conflict.endTime
    );
  }
  return null;
};
