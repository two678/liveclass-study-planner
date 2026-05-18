/**
 * 강의 정보 타입
 */
export interface Course {
  id: string;
  title: string;
  color: string; // 블록 표시 색상 (HEX)
}

export interface CourseListResponse {
  courses: Course[];
}

/**
 * 학습 블록 상세 타입
 * dayOfWeek: 0(월) ~ 6(일)
 */
export interface StudyBlock {
  id: string;
  courseId: string;
  dayOfWeek: number;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  memo?: string;
}

/**
 * 플래너 조회 응답 타입
 */
export interface PlannerResponse {
  weekStart: string; // ISO 8601 (해당 주의 월요일)
  blocks: StudyBlock[];
}

/**
 * 플래너 저장 요청 타입
 * 신규 블록은 id가 없을 수 있음
 */
export interface SavePlannerRequest {
  weekStart: string;
  blocks: Array<Omit<StudyBlock, 'id'> & { id?: string }>;
}

/**
 * 에러 응답 타입 및 에러 코드 Union
 */
export type ErrorCode =
  | 'TIME_CONFLICT'
  | 'INVALID_TIME_RANGE'
  | 'INVALID_BLOCK'
  | 'SERVER_ERROR';

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}
