import { StudyBlock, Course } from '@/types/planner';
import StudyBlockItem from './StudyBlockItem';

interface Props {
  isMobile: boolean;
  selectedDayIndex: number;
  blocks: StudyBlock[];
  courses: Course[];
  onBlockClick: (block: StudyBlock) => void;
}

/**
 * [Component] TimeGridBlocks
 * * 저장 혹은 로컬 편집 상태의 학습 블록(StudyBlock) 객체들을 시간표 그리드 상에 동적으로 배치합니다.
 * * - 주요 기능: block.startTime 및 block.endTime 정보를 그리드 행 번호(gridRow)로 변환(getGridRowStart)하여 정확한 세로 크기와 위치로 정렬합니다.
 * * - 예외 대응:
 * *   1. 20:00 종료 및 격자 범위를 이탈하는 비정상적인 시간 범위 블록의 오차를 보정하여 렌더링 충돌을 예방합니다.
 * *   2. 모바일 일별 뷰어와 연동하여 현재 선택된 요일의 블록만 필터링 렌더링(isMobile && !isSelected 분기)을 수행합니다.
 * *   3. 블록 간 터치 마진을 확보(isMobile ? 'p-1' : 'p-0.5')하여 정밀한 레이아웃 여백을 제공합니다.
 */
export default function TimeGridBlocks({
  isMobile,
  selectedDayIndex,
  blocks,
  courses,
  onBlockClick,
}: Props) {
  // 시간 문자열(HH:mm)을 그리드 행 인덱스로 변환하는 비즈니스 공식 (08:00 시작 = row 2)
  const getGridRowStart = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const index = h * 2 + (m === 30 ? 1 : 0);
    return index - 14;
  };

  return (
    <>
      {blocks.map((block) => {
        const isSelected = block.dayOfWeek === selectedDayIndex;
        // 모바일 환경 시에는 선택되지 않은 요일의 블록 카드 렌더링에서 완전히 배제
        if (isMobile && !isSelected) return null;

        const col = isMobile ? 2 : block.dayOfWeek + 2;
        const rowStart = Math.max(getGridRowStart(block.startTime), 2);
        const mathRowEnd = getGridRowStart(block.endTime);
        // 20:00 이상으로 끝나는 블록은 20:00 격자 행(row 26)을 완전히 채워 그리드 하단 경계선에 닿도록 rowEnd를 27로 지정합니다.
        const rowEnd = mathRowEnd >= 26 ? 27 : mathRowEnd;

        // 20:00 이후에 시작하거나 범위가 비정상적인 블록은 렌더링 안전 장치로 제외 처리
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
