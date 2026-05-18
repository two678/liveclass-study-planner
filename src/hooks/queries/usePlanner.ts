import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlanner, savePlanner } from '@/api/planner';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/planner';

/**
 * @description 플래너(시간표) 조회
 * @param weekStart ? "YYYY-MM-DD"
 */
export const usePlanner = (weekStart?: string) => {
  return useQuery({
    queryKey: ['planner', weekStart || 'current'],
    queryFn: () => (weekStart ? getPlanner(weekStart) : getPlanner()),
  });
};

/**
 * @description 플래너(시간표) 저장
 */
export const useSavePlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePlanner,
    onSuccess: () => {
      toast.success('시간표가 성공적으로 저장되었습니다! 🎉');
      queryClient.invalidateQueries({ queryKey: ['planner'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const serverMessage = (error.response?.data as ErrorResponse)?.message;
        toast.error(serverMessage || '시간표 저장 중 오류가 발생했습니다.');
      } else {
        toast.error('시간표 저장 중 알 수 없는 오류가 발생했습니다.');
      }
      console.error(error);
    },
  });
};
