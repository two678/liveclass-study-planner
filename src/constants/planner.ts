import type { ErrorCode } from '@/types/planner';

// 요일 배열
export const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

// 08:00부터 20:00까지 30분 단위 시간 배열 생성 로직
export const HOURS = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const min = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${min}`;
});

// 주요 에러 코드에 따른 기본 메시지 매핑
export const PLANNER_ERROR_MESSAGES: Record<ErrorCode, string> = {
  TIME_CONFLICT: '다른 일정과 시간이 겹칩니다. 확인 후 다시 시도해주세요.',
  INVALID_TIME_RANGE: '시작 시간이 종료 시간보다 늦거나 같을 수 없습니다.',
  INVALID_BLOCK: '블록 데이터에 누락되거나 잘못된 정보가 있습니다.',
  SERVER_ERROR: '요청을 처리하는 중 서버 오류가 발생했습니다.',
};
