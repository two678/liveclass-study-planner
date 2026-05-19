import { http, HttpResponse, type PathParams } from 'msw';
import type {
  SavePlannerRequest,
  ErrorResponse,
  PlannerResponse,
  CourseListResponse,
  StudyBlock,
} from '@/types/planner';
import { DAYS } from '@/constants/planner';

/**
 * MSW 요청 핸들러 정의
 * 각 도메인(학습 계획, 시간표 등)의 mock API를 이곳에 추가합니다.
 */
const mockCourses = [
  { id: 'cs001', title: '파이썬 기초', color: '#FECACA' },
  { id: 'cs002', title: '리액트', color: '#BBF7D0' },
  { id: 'cs003', title: '타입스크립트', color: '#BFDBFE' },
  { id: 'cs004', title: '알고리즘', color: '#FEF08A' },
  { id: 'cs005', title: '자바스크립트', color: '#E9D5FF' },
];

let mockPlannerBlocks: StudyBlock[] = [
  {
    id: 'plan001',
    courseId: 'cs001',
    dayOfWeek: 0, // 월
    startTime: '09:00',
    endTime: '11:00',
    memo: '파이썬 데이터 분석 기초반 - 1주차 환경 설정 및 기본 문법 뽀개기 🐍',
  },
  {
    id: 'plan002',
    courseId: 'cs003',
    dayOfWeek: 1, // 화
    startTime: '14:00',
    endTime: '16:00',
    memo: '타입스크립트 제네릭과 유틸리티 타입 딥다이브 스터디 준비 완료하기',
  },
  {
    id: 'plan003',
    courseId: 'cs002',
    dayOfWeek: 2, // 수
    startTime: '19:30',
    endTime: '22:00',
    memo: '리액트 성능 최적화 (useMemo, useCallback) 실전 적용 과제 마무으리🔥',
  },
  {
    id: 'plan004',
    courseId: 'cs004',
    dayOfWeek: 3, // 목
    startTime: '10:00',
    endTime: '12:00',
    memo: '백준 알고리즘 골드 문제 풀이 및 스터디원 코드 리뷰 시간 💻',
  },
  {
    id: 'plan005',
    courseId: 'cs005',
    dayOfWeek: 4, // 금
    startTime: '20:00',
    endTime: '23:00',
    memo: '모던 자바스크립트 비동기 처리(Promise, async/await) 완벽하게 이해하고 넘어가기',
  },
  {
    id: 'plan006',
    courseId: 'cs002',
    dayOfWeek: 5, // 토
    startTime: '13:00',
    endTime: '18:00',
    memo: '주말 빡코딩! 리액트 상태관리 라이브러리(Zustand) 적용해서 메인 페이지 리팩토링 🚀',
  },
];

export const handlers = [
  // 강좌 목록 조회
  http.get('/api/courses', () => {
    return HttpResponse.json<CourseListResponse>({
      courses: mockCourses,
    });
  }),

  // 플래너(시간표) 조회
  http.get('/api/planner', () => {
    return HttpResponse.json<PlannerResponse>({
      weekStart: '2026-05-18', // 월요일
      blocks: mockPlannerBlocks,
    });
  }),
  // 플래너(시간표) 저장 (PUT 요청)
  http.put<PathParams, SavePlannerRequest, PlannerResponse | ErrorResponse>(
    '/api/planner',
    async ({ request }) => {
      try {
        const { weekStart, blocks } = await request.json();

        // 1. 최상단 데이터 구조 검증
        if (!weekStart || !Array.isArray(blocks)) {
          return HttpResponse.json<ErrorResponse>(
            {
              code: 'INVALID_BLOCK',
              message: 'weekStart 또는 blocks 데이터가 올바르지 않습니다.',
            },
            { status: 400 }
          );
        }

        // 블록들을 순회하며 유효성 검사
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];

          // 2. 블록 내부 필수 필드 검사
          if (
            block.dayOfWeek === undefined ||
            !block.startTime ||
            !block.endTime ||
            !block.courseId
          ) {
            return HttpResponse.json<ErrorResponse>(
              {
                code: 'INVALID_BLOCK',
                message:
                  '블록의 필수 정보(courseId, dayOfWeek, startTime, endTime)가 누락되었습니다.',
              },
              { status: 400 }
            );
          }

          // 3. 시간 범위 검사 (시작 시간이 종료 시간보다 크거나 같은 경우)
          if (block.startTime >= block.endTime) {
            return HttpResponse.json<ErrorResponse>(
              {
                code: 'INVALID_TIME_RANGE',
                message: '종료 시간은 시작 시간보다 늦어야 합니다.',
              },
              { status: 400 }
            );
          }

          // 4. 시간 충돌 검사 (다른 블록과 요일이 같으면서 시간이 겹치는지)
          for (let j = i + 1; j < blocks.length; j++) {
            const other = blocks[j];
            if (block.dayOfWeek === other.dayOfWeek) {
              if (
                block.startTime < other.endTime &&
                block.endTime > other.startTime
              ) {
                const dayStr = DAYS[other.dayOfWeek] + '요일';
                const courseTitle =
                  mockCourses.find((c) => c.id === other.courseId)?.title ||
                  '알 수 없는 강의';
                const message = `[${dayStr} ${other.startTime}~${other.endTime} ${courseTitle}] 일정과 시간이 겹칩니다. 확인 후 다시 시도해주세요.`;

                return HttpResponse.json<ErrorResponse>(
                  { code: 'TIME_CONFLICT', message },
                  { status: 409 }
                );
              }
            }
          }
        }

        // 5. 성공 처리 (신규 블록인 경우 임의의 id 부여)
        const savedBlocks = blocks.map((block, index) => ({
          ...block,
          id: block.id || `saved-plan-${Date.now()}-${index}`,
        })) as StudyBlock[];

        mockPlannerBlocks = savedBlocks;

        // 최종 성공 응답 반환
        return HttpResponse.json<PlannerResponse>({
          weekStart,
          blocks: savedBlocks,
        });
      } catch (error) {
        console.error('Error saving planner:', error);
        return HttpResponse.json<ErrorResponse>(
          {
            code: 'SERVER_ERROR',
            message: '요청을 처리하는 중 오류가 발생했습니다.',
          },
          { status: 500 }
        );
      }
    }
  ),
];
