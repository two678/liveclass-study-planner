import { DAYS } from '@/constants/planner';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
}

export default function TimeGridHeader({ isMobile, selectedDayIndex }: Props) {
  return (
    <>
      {/* 좌측 상단 빈 공간 */}
      <div className="border border-black bg-gray-100"></div>

      {/* 요일 헤더 */}
      {DAYS.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        if (isMobile && !isSelected) return null;

        return (
          <div
            key={day}
            className="border border-black text-center font-bold bg-gray-100 py-2"
          >
            {day}
          </div>
        );
      })}
    </>
  );
}
