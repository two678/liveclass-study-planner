interface Props {
  dayStats: Array<{ day: string; minutes: number }>;
  maxDayMinutes: number;
}

/**
 * 요일별 학습 현황 막대 그래프 카드 컴포넌트
 */
export default function WeeklySummaryDayChart({
  dayStats,
  maxDayMinutes,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <span className="text-gray-700 font-bold text-sm block mb-4">
        📅 요일별 학습 현황
      </span>
      <div className="space-y-3">
        {dayStats.map(({ day, minutes }) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          const percent = Math.min((minutes / maxDayMinutes) * 100, 100);
          const isWeekend = day === '토' || day === '일';

          return (
            <div key={day} className="flex items-center gap-3">
              <span
                className={`w-8 text-xs font-bold ${isWeekend ? 'text-blue-500' : 'text-gray-600'}`}
              >
                {day}
              </span>
              <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWeekend ? 'bg-blue-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-16 text-right text-xs font-bold text-gray-600">
                {minutes > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
