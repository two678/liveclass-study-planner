import { Course } from '@/types/planner';

interface Props {
  courseStats: Array<
    Course & {
      minutes: number;
      percentage: number;
    }
  >;
}

/**
 * 과목별 학습 비중 카드 컴포넌트
 */
export default function WeeklySummaryCourseWeight({ courseStats }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <span className="text-gray-700 font-bold text-sm block mb-4">
        📚 과목별 학습 비중
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-55 overflow-y-auto pr-1">
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
                <span className="text-xs font-bold text-gray-800 truncate max-w-20">
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
  );
}
