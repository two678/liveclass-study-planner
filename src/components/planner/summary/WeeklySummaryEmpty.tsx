/**
 * 학습 일정이 없을 때 표시하는 가이드 배너 컴포넌트
 */
export default function WeeklySummaryEmpty() {
  return (
    <div className="bg-blue-50/50 border border-blue-100/70 rounded-xl p-8 text-center shadow-sm">
      <p className="text-sm font-black text-blue-600 mb-1.5 flex items-center justify-center gap-1">
        ✨ 아직 이번 주의 학습 일정이 없습니다!
      </p>
      <p className="text-xs text-gray-500 font-bold leading-relaxed">
        시간표 그리드의 원하는 요일과 시간 빈 칸을 마우스나 손가락으로 가볍게
        클릭하여
        <br />첫 학습 블록을 등록하고 계획적인 한 주를 힘차게 시작해 보세요! 🚀
      </p>
    </div>
  );
}
