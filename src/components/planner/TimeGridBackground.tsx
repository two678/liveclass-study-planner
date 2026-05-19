import React from 'react';
import { HOURS, DAYS } from '@/constants/planner';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
  onCellClick: (day: string, hour: string) => void;
}

export default function TimeGridBackground({
  isMobile,
  selectedDayIndex,
  onCellClick,
}: Props) {
  return (
    <>
      {HOURS.map((hour, idx) => {
        const row = idx + 2; // 헤더가 row 1이므로, 08:00은 row 2부터 시작
        return (
          <React.Fragment key={hour}>
            {/* (1) 시간 텍스트 (가장 왼쪽 1칸) */}
            <div
              className={`flex items-center justify-center transition-all ${
                isMobile
                  ? 'border-none bg-transparent py-2.5 text-[12px] text-gray-500 font-bold'
                  : 'border border-black bg-gray-50/50 text-right pr-3 py-3 text-xs text-gray-400 font-extrabold'
              }`}
              style={{ gridColumn: 1, gridRow: row }}
            >
              {isMobile ? (hour.endsWith(':30') ? '\u200B' : hour) : hour}
            </div>

            {/* (2) 해당 시간대의 각 요일별 빈 칸 */}
            {DAYS.map((day, dayIdx) => {
              const isSelected = dayIdx === selectedDayIndex;
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
                  {/* 빈 셀 영역 */}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
