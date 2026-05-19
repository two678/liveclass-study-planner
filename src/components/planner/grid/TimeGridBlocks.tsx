import { StudyBlock, Course } from '@/types/planner';
import StudyBlockItem from '../block/StudyBlockItem';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
  blocks: StudyBlock[];
  courses: Course[];
  onBlockClick: (block: StudyBlock) => void;
}

// 그리드 내 학습 블록(일정) 배치 컴포넌트
export default function TimeGridBlocks({
  isMobile,
  selectedDayIndex,
  blocks,
  courses,
  onBlockClick,
}: Props) {
  // 시간 문자열(HH:mm)을 그리드 행 인덱스로 변환 (08:00 시작 = row 2)
  const getGridRowStart = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const index = h * 2 + (m === 30 ? 1 : 0);
    return index - 14;
  };

  return (
    <>
      {blocks.map((block) => {
        const isSelected = block.dayOfWeek === selectedDayIndex;
        // 모바일은 선택되지 않은 요일의 블록 제외
        if (isMobile && !isSelected) return null;

        const col = isMobile ? 2 : block.dayOfWeek + 2;
        const rowStart = Math.max(getGridRowStart(block.startTime), 2);
        const mathRowEnd = getGridRowStart(block.endTime);
        // 20:00 이상으로 끝나는 블록은 20:00 격자 행(row 26)을 채워 닿도록 처리
        const rowEnd = mathRowEnd >= 26 ? 27 : mathRowEnd;

        // 비정상 시간 범위 블록 제외
        if (rowStart >= 26 || rowStart >= rowEnd) return null;

        const course = courses.find((c) => c.id === block.courseId);

        return (
          <div
            key={block.id}
            className={`z-10 ${isMobile ? 'p-1' : 'p-0.5'}`}
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
