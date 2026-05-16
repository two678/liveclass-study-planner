/**
 * [Utility] isTimeConflict.ts
 * * 학습 플래너의 핵심 비즈니스 로직인 시간 충돌 감지 알고리즘을 담당합니다.
 * * - 기술적 선택: 성능 최적화를 위해 Array.prototype.some()을 사용하여 충돌 발견 시 즉시 연산을 중단합니다.
 * - 데이터 처리: 시간 문자열(HH:mm)은 사전순 비교가 가능하므로, 별도의 Number 변환 없이 직접 비교하여 연산 효율성을 높였습니다.
 * - 예외 케이스: 과제 요구사항에 따라 인접한 시간(Boundary Case)은 충돌에서 제외하도록 설계되었습니다.
 */

import { StudyBlock } from '@/types/planner';

/**
 * @description 새로운 학습 블록이 기존의 블록들과 시간대가 겹치는지 검증하는 함수
 * * [판정 로직]
 * 1. 요일(dayOfWeek)이 동일한 블록들을 대상으로 비교를 수행합니다.
 * 2. 충돌 조건: (신규_시작 < 기존_종료) AND (신규_종료 > 기존_시작)
 * - 이 공식은 '교집합이 존재하는가'를 판별하는 표준 알고리즘입니다.
 * - 인접한 시간(예: 10:00 종료 - 10:00 시작)은 충돌로 간주하지 않습니다. (과제 요구사항 반영)
 * 3. 30분 단위 정밀도와 '완전 포함', '일부 겹침', '동일 시간' 케이스를 모두 대응합니다.
 * * @param newBlock - 추가/수정하려는 새로운 학습 블록
 * @param existingBlocks - 현재 스케줄에 등록된 기존 블록 배열
 * @returns {boolean} 충돌 발생 시 true, 안전한 경우 false
 */

export const isTimeConflict = (
  newBlock: StudyBlock,
  existingBlocks: StudyBlock[]
): boolean => {
  return existingBlocks.some((existing) => {
    // 1. 요일이 다르면 충돌 가능성 없음
    if (newBlock.dayOfWeek !== existing.dayOfWeek) return false;

    // 2. 겹침 확인 (표준 교집합 공식)
    // 문자열 비교("09:00" < "10:00")는 ISO 형식에서 안전하게 작동합니다.
    const isOverlapping =
      newBlock.startTime < existing.endTime &&
      newBlock.endTime > existing.startTime;

    return isOverlapping;
  });
};
