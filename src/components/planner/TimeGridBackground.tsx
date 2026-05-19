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
              className="border border-black text-right pr-2 py-3 text-sm text-gray-500 font-bold bg-gray-50/50"
              style={{ gridColumn: 1, gridRow: row }}
            >
              {hour}
            </div>

            {/* (2) 해당 시간대의 각 요일별 빈 칸 */}
            {DAYS.map((day, dayIdx) => {
              const isSelected = dayIdx === selectedDayIndex;
              if (isMobile && !isSelected) return null;

              return (
                <div
                  key={`${day}-${hour}`}
                  className="border border-gray-300 hover:bg-blue-50 cursor-pointer"
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
