import { StudyBlock, Course } from '@/types/planner';
import StudyBlockItem from './StudyBlockItem';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
  blocks: StudyBlock[];
  courses: Course[];
  onBlockClick: (block: StudyBlock) => void;
}

export default function TimeGridBlocks({
  isMobile,
  selectedDayIndex,
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
        const isSelected = block.dayOfWeek === selectedDayIndex;
        if (isMobile && !isSelected) return null;

        const col = isMobile ? 2 : block.dayOfWeek + 2;
        const rowStart = Math.max(getGridRowStart(block.startTime), 2);
        const mathRowEnd = getGridRowStart(block.endTime);
        // 20:00 이상으로 끝나는 블록은 20:00 격자 행(row 26)을 완전히 채워 그리드 하단 경계선에 닿도록 rowEnd를 27로 지정합니다.
        const rowEnd = mathRowEnd >= 26 ? 27 : mathRowEnd;

        // 20:00 이후에 시작하거나 범위가 비정상적인 블록은 렌더링에서 제외합니다.
        if (rowStart >= 26 || rowStart >= rowEnd) return null;

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
