import { StudyBlock, Course } from '@/types/planner';

interface Props {
  block: StudyBlock;
  course?: Course;
  onClick: () => void;
}

/**
 * [Component] StudyBlockItem
 * * 그리드 상에 플로팅되는 각각의 학습 계획 카드를 렌더링합니다.
 * * - 주요 기능: 과목명, 시작/종료 시간, 요약 메모를 한눈에 읽을 수 있도록 표시합니다.
 * * - 디자인 테마: 반투명 보더라인(border-black/15)과 부드러운 파스텔톤 배경색(course.color)을 결합하여, 과목별 색상 구분을 명확히 하는 동시에 시각적인 편안함과 모던함을 선사합니다.
 */
export default function StudyBlockItem({ block, course, onClick }: Props) {
  return (
    <div
      className="w-full h-full rounded-xl border border-black/15 shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md transition-all duration-200 p-2 md:p-2.5 overflow-hidden flex flex-col justify-between hover:scale-[1.01]"
      style={{ backgroundColor: course?.color || '#BFDBFE' }}
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5">
        {/* 과목명 표시 (말줄임표 내장) */}
        <span className="font-extrabold text-xs text-gray-900 tracking-tight truncate">
          {course?.title || block.courseId}
        </span>
        {/* 메모가 등록된 경우 최대 2줄 라인 클램핑 노출 */}
        {block.memo && (
          <span className="text-[10px] text-gray-700/90 leading-normal line-clamp-2 font-medium">
            {block.memo}
          </span>
        )}
      </div>

      {/* 시작 및 종료 시간 대칭 정보 */}
      <span className="text-[9px] font-black text-gray-500/80 tracking-tighter mt-1 block self-end">
        {block.startTime} ~ {block.endTime}
      </span>
    </div>
  );
}
