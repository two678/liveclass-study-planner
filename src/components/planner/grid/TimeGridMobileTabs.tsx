import { DAYS } from '@/constants/planner';

interface Props {
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

/**
 * 모바일 뷰 전용 요일 선택 탭 컴포넌트
 * - 요일(월~일) 목록을 둥근 모서리 형태의 세그먼티드 탭바로 제공합니다.
 * - 모바일 환경에서 활성화된 요일의 학습 스케줄을 전환해주는 역할을 합니다.
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
