'use client';
import { HOURS, DAYS } from '@/constants/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
import React from 'react';
import StudyBlockItem from './StuckBlockItem';

export default function TimeGrid() {
  const { blocks } = usePlannerStore();

  const handleCellClick = (day: string, hour: string) => {
    console.log(`${day} - ${hour}`);
  };

  return (
    <div className="relative bg-white border-2 border-black rounded-lg w-full max-w-[1440px] h-full mx-auto p-6 grid grid-cols-8">
      {/* --- 1. 헤더 부분 (첫 번째 줄) --- */}
      {/* 좌측 상단 빈 공간 */}
      <div className="border border-black bg-gray-100"></div>

      {/* 요일 헤더 (7칸) */}
      {DAYS.map((day) => (
        <div
          key={day}
          className="border border-black text-center font-bold bg-gray-100 py-2"
        >
          {day}
        </div>
      ))}
      {HOURS.map((hour) => (
        <React.Fragment key={hour}>
          {/* (1) 시간 텍스트 (가장 왼쪽 1칸) */}
          <div className="border border-black text-right pr-2 py-3 text-sm text-gray-500">
            {hour}
          </div>

          {/* (2) 해당 시간대의 각 요일별 빈 칸 (7칸) */}
          {DAYS.map((day) => (
            <div
              key={`${day}-${hour}`}
              className="border border-gray-300 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleCellClick(day, hour)}
            >
              {/* 여기에 나중에 드래그나 클릭 로직이 들어갑니다 */}
            </div>
          ))}
        </React.Fragment>
      ))}
      {/* --- 등록된 블록들 레이어 (추가되는 부분) --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {blocks.map((block) => (
          <StudyBlockItem key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
