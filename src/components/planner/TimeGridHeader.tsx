import { DAYS } from '@/constants/planner';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
}

/**
 * [Component] TimeGridHeader
 * * 스케줄러 그리드의 최상단 헤더 영역(시간 라벨 및 요일 라벨)을 렌더링합니다.
 * * - 주요 기능: 요일 목록(월~일)을 상단 격자에 매핑합니다.
 * * - 반응형 대응: 모바일 환경에서는 1열 그리드 구조에 맞춰 선택된 단일 요일 헤더만 노출하며, 데스크톱 환경에서는 8열 전체 요일을 고르게 렌더링합니다.
 */
export default function TimeGridHeader({ isMobile, selectedDayIndex }: Props) {
  return (
    <>
      {/* 1. 좌측 상단 코너 빈 영역 (시간 축 표시용 코너 장식) */}
      <div
        className={`flex items-center justify-center text-xs text-gray-400 font-extrabold py-2 ${
          isMobile
            ? 'border-none bg-transparent'
            : 'border border-black bg-gray-100'
        }`}
      >
        시간
      </div>

      {/* 2. 요일 라벨 목록 */}
      {DAYS.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        // 모바일 환경 시에는 선택되지 않은 요일은 헤더 렌더링에서 완전히 배제
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
