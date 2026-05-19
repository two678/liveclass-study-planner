import { DAYS } from '@/constants/planner';

export default function TimeGridHeader() {
  return (
    <>
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
    </>
  );
}
