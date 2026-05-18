import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/api/planner';

/**
 * @description 강의 목록 조회
 */
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
};
