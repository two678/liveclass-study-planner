interface Props {
  totalHours: number;
  totalMins: number;
  blockCount: number;
}

/**
 * 이번 주 총 학습 시간을 표시하는 카드 컴포넌트
 */
export default function WeeklySummaryTotalTime({
  totalHours,
  totalMins,
  blockCount,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
      <span className="text-gray-500 font-medium text-sm mb-2">
        이번 주 총 학습 시간
      </span>
      <div className="flex items-baseline gap-1 text-blue-600">
        <span className="text-4xl font-extrabold tracking-tight">
          {totalHours}
        </span>
        <span className="text-lg font-bold">시간</span>
        {totalMins > 0 && (
          <>
            <span className="text-4xl font-extrabold tracking-tight ml-2">
              {totalMins}
            </span>
            <span className="text-lg font-bold">분</span>
          </>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        총 {blockCount}개의 학습 블록이 배치되어 있습니다.
      </p>
    </div>
  );
}
