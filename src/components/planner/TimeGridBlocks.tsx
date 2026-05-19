import { StudyBlock, Course } from '@/types/planner';
import StudyBlockItem from './StudyBlockItem';

interface Props {
  blocks: StudyBlock[];
  courses: Course[];
  onBlockClick: (block: StudyBlock) => void;
}

export default function TimeGridBlocks({
  blocks,
  courses,
  onBlockClick,
}: Props) {
  const getGridRowStart = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const index = h * 2 + (m === 30 ? 1 : 0);
    return index - 14;
  };

  return (
    <>
      {blocks.map((block) => {
        const col = block.dayOfWeek + 2;
        const rowStart = getGridRowStart(block.startTime);
        const rowEnd = getGridRowStart(block.endTime);
        const course = courses.find((c) => c.id === block.courseId);

        return (
          <div
            key={block.id}
            className="z-10 p-0.5"
            style={{
              gridColumn: col,
              gridRow: `${rowStart} / ${rowEnd}`,
            }}
          >
            <StudyBlockItem
              block={block}
              course={course}
              onClick={() => onBlockClick(block)}
            />
          </div>
        );
      })}
    </>
  );
}
