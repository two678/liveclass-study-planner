import axios from 'axios';
import {
  PlannerResponse,
  SavePlannerRequest,
  CourseListResponse,
} from '@/types/planner';

const plannerApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// 강의 목록 조회
export const getCourses = async (): Promise<CourseListResponse> => {
  const response = await plannerApi.get<CourseListResponse>('/courses');
  return response.data;
};

// 플래너(시간표) 조회
export const getPlanner = async (
  weekStart?: string
): Promise<PlannerResponse> => {
  const response = await plannerApi.get<PlannerResponse>('/planner', {
    params: weekStart ? { weekStart } : {},
  });
  return response.data;
};

// 플래너(시간표) 저장
export const savePlanner = async (
  data: SavePlannerRequest
): Promise<PlannerResponse> => {
  const response = await plannerApi.put<PlannerResponse>('/planner', data);
  return response.data;
};
