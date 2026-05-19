import { StudyBlock, Course } from '@/types/planner';

interface Props {
  block: StudyBlock;
  course?: Course;
  onClick: () => void;
}

// 개별 학습 일정 블록 카드 컴포넌트
export default function StudyBlockItem({ block, course, onClick }: Props) {
  return (
    <div
      className="w-full h-full rounded-xl border border-black/15 shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md transition-all duration-200 p-2 md:p-2.5 overflow-hidden flex flex-col justify-between hover:scale-[1.01]"
      style={{ backgroundColor: course?.color || '#BFDBFE' }}
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5">
        {/* 과목명 */}
        <span className="font-extrabold text-xs md:text-sm text-gray-900 tracking-tight truncate">
          {course?.title || block.courseId}
        </span>
        {/* 메모가 등록된 경우 */}
        {block.memo && (
          <span className="text-[10px] md:text-xs text-gray-700/90 leading-normal line-clamp-2 font-medium">
            {block.memo}
          </span>
        )}
      </div>

      {/* 시작 및 종료 시간 */}
      <span className="text-[10px] md:text-xs font-black text-gray-700/80 tracking-tighter mt-1 block self-end">
        {block.startTime} ~ {block.endTime}
      </span>
    </div>
  );
}
