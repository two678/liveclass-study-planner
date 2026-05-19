import { DAYS } from '@/constants/planner';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
}

// 시간표 상단 헤더 컴포넌트
export default function TimeGridHeader({ isMobile, selectedDayIndex }: Props) {
  return (
    <>
      {/* 좌측 상단 빈 공간 */}
      <div
        className={`flex items-center justify-center text-xs text-gray-400 font-extrabold py-2 ${
          isMobile
            ? 'border-none bg-transparent'
            : 'border border-black bg-gray-100'
        }`}
      >
        시간
      </div>

      {/* 요일 헤더 */}
      {DAYS.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        // 모바일은 선택되지 않은 요일 제외
        if (isMobile && !isSelected) return null;

        return (
          <div
            key={day}
            className={`text-center font-black py-2 ${
              isMobile
                ? 'border border-blue-100 bg-blue-50/70 text-blue-600 rounded-xl text-sm shadow-sm'
                : 'border border-black bg-gray-100 shadow-sm'
            }`}
          >
            {day}요일
          </div>
        );
      })}
    </>
  );
}
