import { Course, StudyBlock } from '@/types/planner';
import { DAYS } from '@/constants/planner';
import WeeklySummaryEmpty from './WeeklySummaryEmpty';
import WeeklySummaryTotalTime from './WeeklySummaryTotalTime';
import WeeklySummaryDayChart from './WeeklySummaryDayChart';
import WeeklySummaryCourseWeight from './WeeklySummaryCourseWeight';

interface Props {
  blocks: StudyBlock[];
  courses: Course[];
}

/**
 * 실시간 주간 학습 요약 컴포넌트
 * - 등록된 학습 블록을 기반으로 전체 학습 시간, 요일별 학습 비중, 과목별 배분율을 실시간 계산합니다.
 * - 학습 블록이 없을 때는 요일과 시간을 선택할 수 있도록 안내 가이드 배너를 표시합니다.
 */
export default function WeeklySummary({ blocks, courses }: Props) {
  // 총 학습시간 계산 (분 단위 -> 시간 및 분 변환)
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

  // 요일별 학습시간 계산
  const dayStats = DAYS.map((day, idx) => {
    const minutes = blocks
      .filter((b) => b.dayOfWeek === idx)
      .reduce((acc, b) => acc + calculateBlockMinutes(b), 0);
    return { day, minutes };
  });

  const maxDayMinutes = Math.max(...dayStats.map((d) => d.minutes), 1);

  // 강의별 배분 계산
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
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 w-full max-w-360 mx-auto shadow-sm">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        📊 실시간 주간 학습 요약
        <span className="text-xs font-normal text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">
          편집 중 상태 실시간 반영
        </span>
      </h3>

      {blocks.length === 0 ? (
        <WeeklySummaryEmpty />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 총 학습 시간 카드 */}
          <WeeklySummaryTotalTime
            totalHours={totalHours}
            totalMins={totalMins}
            blockCount={blocks.length}
          />

          {/* 요일별 학습 시간 */}
          <WeeklySummaryDayChart
            dayStats={dayStats}
            maxDayMinutes={maxDayMinutes}
          />

          {/* 강의별 배분 */}
          <WeeklySummaryCourseWeight courseStats={courseStats} />
        </div>
      )}
    </div>
  );
}
