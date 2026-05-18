import { StudyBlock } from '@/types/planner';

export default function StudyBlockItem({ block }: { block: StudyBlock }) {
  return (
    <div className="absolute rounded-lg border border-black bg-blue-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
      {block.courseId}
    </div>
  );
}
