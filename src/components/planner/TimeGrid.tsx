'use client';
import { HOURS, DAYS } from '@/constants/planner';
import React from 'react';
import StudyBlockItem from './StudyBlockItem';
import { usePlannerStore } from '@/store/usePlannerStore';
import { usePlanner } from '@/hooks/queries/usePlanner';
import { useCourses } from '@/hooks/queries/useCourses';

export default function TimeGrid() {
  // Zustand 스토어에서 weekStart 상태를 가져옵니다.
  // (나중에 이전주/다음주 버튼으로 이 상태를 변경하면 자동으로 새 데이터를 페칭합니다!)
  const { weekStart } = usePlannerStore();

  const { data: plannerData, isLoading } = usePlanner(weekStart);
  const { data: courseData } = useCourses();

  const blocks = plannerData?.blocks || [];
  const courses = courseData?.courses || [];

  const getGridRowStart = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const index = h * 2 + (m === 30 ? 1 : 0);
    return index - 14;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] w-full text-gray-500 font-bold">
        시간표를 불러오는 중입니다...
      </div>
    );

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
      {HOURS.map((hour, idx) => {
        const row = idx + 2; // 헤더가 row 1이므로, 08:00은 row 2부터 시작
        return (
          <React.Fragment key={hour}>
            {/* (1) 시간 텍스트 (가장 왼쪽 1칸) */}
            <div
              className="border border-black text-right pr-2 py-3 text-sm text-gray-500"
              style={{ gridColumn: 1, gridRow: row }}
            >
              {hour}
            </div>

            {/* (2) 해당 시간대의 각 요일별 빈 칸 (7칸) */}
            {DAYS.map((day, dayIdx) => (
              <div
                key={`${day}-${hour}`}
                className="border border-gray-300 hover:bg-blue-50 cursor-pointer"
                style={{ gridColumn: dayIdx + 2, gridRow: row }}
                onClick={() => handleCellClick(day, hour)}
              >
                {/* 여기에 나중에 드래그나 클릭 로직이 들어갑니다 */}
              </div>
            ))}
          </React.Fragment>
        );
      })}
      {/* --- 3. 등록된 학습 블록(일정) 레이어 --- */}
      {blocks.map((block) => {
        const col = block.dayOfWeek + 2;
        const rowStart = getGridRowStart(block.startTime);
        const rowEnd = getGridRowStart(block.endTime);
        const course = courses.find((c) => c.id === block.courseId);

        return (
          <div
            key={block.id}
            className="z-10 p-[2px]" // 그리드 선을 가리지 않도록 약간의 여백
            style={{
              gridColumn: col,
              gridRow: `${rowStart} / ${rowEnd}`,
            }}
          >
            <StudyBlockItem block={block} course={course} />
          </div>
        );
      })}
    </div>
  );
}
