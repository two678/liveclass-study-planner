import { useMemo } from 'react';

interface Props {
  weekStart: string;
  isDirty: boolean;
  isSaving: boolean;
  onMoveWeek: (days: number) => void;
  onSave: () => void;
}

/**
 * [Component] TimeGridControlPanel
 * * 주간 학습 플래너의 상단 네비게이션 및 제어 영역을 담당합니다.
 * * - 주요 기능: 주차 이동(이전 주/다음 주), 저장 상태 피드백(dirty, loading), 일괄 저장 트리거.
 * * - 반응형 대응: 모바일 환경에서 텍스트 줄바꿈 방지(whitespace-nowrap) 및 정밀 폰트 스케일링을 통해 깨짐 현상을 예방합니다.
 */
export default function TimeGridControlPanel({
  weekStart,
  isDirty,
  isSaving,
  onMoveWeek,
  onSave,
}: Props) {
  // 주간 날짜 범위 문자열 포맷팅
  const weekRangeString = useMemo(() => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date: Date) => {
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${mm}월 ${dd}일`;
    };

    return `${start.getFullYear()}년 ${formatDate(start)} ~ ${formatDate(end)}`;
  }, [weekStart]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm gap-4">
      {/* 1. 주간 이동 내비게이션 (모바일에서 컴팩트하게 리사이징 및 줄바꿈 방지) */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 md:gap-4">
        <button
          onClick={() => onMoveWeek(-7)}
          className="px-2.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
        >
          ◀ 이전 주
        </button>
        <span className="text-sm md:text-lg font-black text-gray-800 tracking-tight whitespace-nowrap">
          {weekRangeString}
        </span>
        <button
          onClick={() => onMoveWeek(7)}
          className="px-2.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
        >
          다음 주 ▶
        </button>
      </div>

      {/* 2. 저장 피드백 정보 및 일괄 저장 버튼 */}
      <div className="flex items-center justify-end w-full sm:w-auto gap-3">
        {isDirty && (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50/50 border border-amber-200 px-3 py-1.5 rounded-full text-[11px] font-extrabold animate-pulse shadow-sm whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
            저장 필요
          </div>
        )}

        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className={`px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
            isDirty
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
              저장 중...
            </>
          ) : (
            '시간표 저장'
          )}
        </button>
      </div>
    </div>
  );
}
