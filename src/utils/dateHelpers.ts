/**
 * @description Date 객체를 "YYYY-MM-DD" 문자열로 포맷
 */
export const formatToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * @description 특정 주의 시작일(월요일)을 "YYYY-MM-DD" 문자열로 반환
 * @param date
 * @returns YYYY-MM-DD
 */
export const startOfWeek = (date: Date = new Date()): string => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return formatToYYYYMMDD(monday);
};

/**
 * @description Date 객체를 기준으로 월요일(0) ~ 일요일(6) 인덱스 반환
 * @param date
 * @returns 0: 월요일 ... 6: 일요일
 */
export const getMyDayIndex = (date: Date = new Date()): number => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};
