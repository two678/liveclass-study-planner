import React from 'react';
import { HOURS, DAYS } from '@/constants/planner';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
  onCellClick: (day: string, hour: string) => void;
}

/**
 * [Component] TimeGridBackground
 * * 스케줄러 격자의 2차원 시간/요일 배경 구조를 렌더링하는 배경 레이어 컴포넌트입니다.
 * * - 주요 기능: 세로 시간축(08:00 ~ 20:00, 30분 단위) 및 가로 요일축에 맞춰 빈 클릭 셀을 정밀히 정렬합니다.
 * * - 모바일 특화 정밀 조율:
 * *   1. 정각 시간대 라벨만 노출하고 30분 단위(:30) 라벨은 빈 공백으로 처리하되, 높이가 축소되지 않도록 제로 너비 공백('\u200B')을 주입하여 정각과 30분 높이를 50:50으로 정확히 일치시킵니다.
 * *   2. 데스크톱에서는 촘촘한 선형 캘린더 스타일을 지원하고, 모바일에서는 터치 영역 확대(py-2.5) 및 입체형 카드 슬롯(border-gray-100, shadow) 형태의 격자를 제공합니다.
 */
export default function TimeGridBackground({
  isMobile,
  selectedDayIndex,
  onCellClick,
}: Props) {
  return (
    <>
      {HOURS.map((hour, idx) => {
        const row = idx + 2; // 헤더가 row 1이므로, 08:00은 row 2부터 그리드 배치 시작
        return (
          <React.Fragment key={hour}>
            {/* (1) 좌측 세로 시간 라벨 영역 */}
            <div
              className={`flex items-center justify-center transition-all ${
                isMobile
                  ? 'border-none bg-transparent py-2.5 text-[12px] text-gray-500 font-bold'
                  : 'border border-black bg-gray-50/50 text-right pr-3 py-3 text-xs text-gray-400 font-extrabold'
              }`}
              style={{ gridColumn: 1, gridRow: row }}
            >
              {/* 모바일에서는 30분 단위 텍스트는 숨기되(\u200B) 높이값을 균등하게 보장함 */}
              {isMobile ? (hour.endsWith(':30') ? '\u200B' : hour) : hour}
            </div>

            {/* (2) 해당 시간의 각 요일별 빈 마우스 클릭 대상 셀 */}
            {DAYS.map((day, dayIdx) => {
              const isSelected = dayIdx === selectedDayIndex;
              // 모바일 환경 시에는 선택되지 않은 날짜의 타일 렌더링 배제
              if (isMobile && !isSelected) return null;

              return (
                <div
                  key={`${day}-${hour}`}
                  className={`hover:bg-blue-50/30 cursor-pointer transition-all duration-200 ${
                    isMobile
                      ? 'border border-gray-100 bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.015)] hover:scale-[1.01]'
                      : 'border border-gray-300'
                  }`}
                  style={{
                    gridColumn: isMobile ? 2 : dayIdx + 2,
                    gridRow: row,
                  }}
                  onClick={() => onCellClick(day, hour)}
                >
                  {/* 빈 셀 인터랙션 영역 */}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
