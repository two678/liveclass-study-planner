// 요일 배열
export const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

// 08:00부터 20:00까지 30분 단위 시간 배열 생성 로직
export const HOURS = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const min = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${min}`;
});
