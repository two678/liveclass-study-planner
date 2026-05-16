import { http, HttpResponse } from 'msw';

/**
 * MSW 요청 핸들러 정의
 * 각 도메인(학습 계획, 시간표 등)의 mock API를 이곳에 추가합니다.
 */
export const handlers = [
  // 예시: 학습 계획 목록 조회
  // http.get('/api/plans', () => {
  //   return HttpResponse.json([]);
  // }),
];
