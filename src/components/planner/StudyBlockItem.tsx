import { StudyBlock, Course } from '@/types/planner';

interface Props {
  block: StudyBlock;
  course?: Course;
}

export default function StudyBlockItem({ block, course }: Props) {
  return (
    <div
      className="w-full h-full rounded-md border border-black shadow-sm cursor-pointer hover:shadow-md transition-shadow p-1 overflow-hidden flex flex-col"
      style={{ backgroundColor: course?.color || '#BFDBFE' }}
    >
      <span className="font-bold text-xs truncate">
        {course?.title || block.courseId}
      </span>
      <span className="text-[10px] text-gray-700 leading-tight line-clamp-2 mt-1">
        {block.memo}
      </span>
    </div>
  );
}
