import { Course, StudyBlock } from '@/types/planner';
import { DAYS } from '@/constants/planner';

interface Props {
  blocks: StudyBlock[];
  courses: Course[];
}

export default function WeeklySummary({ blocks, courses }: Props) {
  // 1. 총 학습시간 계산 (분 단위 -> 시간 및 분 변환)
  const calculateBlockMinutes = (block: StudyBlock) => {
    const [sh, sm] = block.startTime.split(':').map(Number);
    const [eh, em] = block.endTime.split(':').map(Number);
    return eh * 60 + em - (sh * 60 + sm);
  };

  const totalMinutes = blocks.reduce(
    (acc, b) => acc + calculateBlockMinutes(b),
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  // 2. 요일별 학습시간 계산
  const dayStats = DAYS.map((day, idx) => {
    const minutes = blocks
      .filter((b) => b.dayOfWeek === idx)
      .reduce((acc, b) => acc + calculateBlockMinutes(b), 0);
    return { day, minutes };
  });

  const maxDayMinutes = Math.max(...dayStats.map((d) => d.minutes), 1);

  // 3. 강의별 배분 계산
  const courseStats = courses.map((course) => {
    const minutes = blocks
      .filter((b) => b.courseId === course.id)
      .reduce((acc, b) => acc + calculateBlockMinutes(b), 0);

    const percentage =
      totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;
    return {
      ...course,
      minutes,
      percentage,
    };
  });

  return (
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 w-full max-w-[1440px] mx-auto shadow-sm">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        📊 실시간 주간 학습 요약
        <span className="text-xs font-normal text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">
          편집 중 상태 실시간 반영
        </span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 총 학습 시간 카드 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <span className="text-gray-500 font-medium text-sm mb-2">
            이번 주 총 학습 시간
          </span>
          <div className="flex items-baseline gap-1 text-blue-600">
            <span className="text-4xl font-extrabold tracking-tight">
              {totalHours}
            </span>
            <span className="text-lg font-bold">시간</span>
            {totalMins > 0 && (
              <>
                <span className="text-4xl font-extrabold tracking-tight ml-2">
                  {totalMins}
                </span>
                <span className="text-lg font-bold">분</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            총 {blocks.length}개의 학습 블록이 배치되어 있습니다.
          </p>
        </div>

        {/* 요일별 학습 시간 */}
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
                    {minutes > 0
                      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
                      : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 강의별 배분 */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <span className="text-gray-700 font-bold text-sm block mb-4">
            📚 과목별 학습 비중
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {courseStats.map((course) => {
              const hours = Math.floor(course.minutes / 60);
              const mins = course.minutes % 60;

              return (
                <div
                  key={course.id}
                  className="p-3 border border-gray-100 rounded-lg flex flex-col justify-between"
                  style={{ borderLeft: `4px solid ${course.color}` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-800 truncate max-w-[80px]">
                      {course.title}
                    </span>
                    <span
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${course.color}80` }}
                    >
                      {course.percentage}%
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {course.minutes > 0
                      ? `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`
                      : '0시간'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
