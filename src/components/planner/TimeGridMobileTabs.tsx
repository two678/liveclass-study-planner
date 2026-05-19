import { DAYS } from '@/constants/planner';

interface Props {
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

/**
 * [Component] TimeGridMobileTabs
 * * 모바일 뷰 전용 프리미엄 요일 세그먼티드 선택 탭 컴포넌트입니다.
 * * - 기능: 현재 표시할 특정 요일의 시간표 일별 뷰를 활성화합니다.
 * * - 디자인: iOS 및 고급 스타일의 둥근 모서리형 세그먼티드 탭바 디자인을 적용하여 높은 터치 반응성과 직관성을 제공합니다.
 */
export default function TimeGridMobileTabs({
  selectedDayIndex,
  onSelectDay,
}: Props) {
  return (
    <div className="flex justify-between items-center bg-gray-100/70 border border-gray-200/40 rounded-2xl p-1 shadow-inner gap-0.5">
      {DAYS.map((day, idx) => (
        <button
          key={day}
          onClick={() => onSelectDay(idx)}
          className={`flex-1 py-2.5 text-center text-xs rounded-xl transition-all duration-200 ${
            selectedDayIndex === idx
              ? 'bg-white text-blue-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-gray-200/10 font-black'
              : 'text-gray-500 hover:text-gray-800 font-bold bg-transparent'
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
