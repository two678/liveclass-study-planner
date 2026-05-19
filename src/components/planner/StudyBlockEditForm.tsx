import { useState } from 'react';
import { StudyBlock } from '@/types/planner';
import Select from '@/components/common/Select';
import { useCourses } from '@/hooks/queries/useCourses';
import { HOURS, DAYS } from '@/constants/planner';
interface Props {
  day?: string;
  hour?: string;
  block?: StudyBlock;
}

export default function StudyBlockEditForm({ hour, block }: Props) {
  const { data: coursesData } = useCourses();
  // 1. 상태 초기화: 수정 모드면 block 데이터, 추가 모드면 클릭한 위치(hour) 데이터
  const [startTime, setStartTime] = useState<string>(
    block?.startTime || hour || '08:00'
  );
  const [endTime, setEndTime] = useState<string>(block?.endTime || '');
  const [courseId, setCourseId] = useState<string>(block?.courseId || '');
  const [dayOfWeek, setDayOfWeek] = useState<string>(
    DAYS[block?.dayOfWeek || 0]
  );
  const [memo, setMemo] = useState<string>(block?.memo || '');

  const timeOptions = HOURS.slice(HOURS.indexOf(startTime) + 1);

  // 2. 시간 목록 만들기 (예: 30분 단위)

  const courseOptions =
    coursesData?.courses.map((c) => ({
      value: c.id,
      label: c.title,
      color: c.color,
    })) || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{'학습 일정 수정'}</h2>
      {/* 요일 */}
      <Select
        value={dayOfWeek}
        onChange={setDayOfWeek}
        options={DAYS.map((day) => ({ value: day, label: day }))}
        placeholder="요일"
        label="Day"
      />
      {/* 시작 시간 */}
      <Select
        value={startTime}
        onChange={setStartTime}
        options={HOURS.map((time) => ({ value: time, label: time }))}
        placeholder="시작 시간"
        label="StartTime"
      />
      {/* 종료 시간 */}
      <Select
        value={endTime}
        onChange={setEndTime}
        options={timeOptions.map((time) => ({ value: time, label: time }))}
        placeholder="종료 시간"
        label="EndTime"
      />
      {/* 강의 선택 */}
      <Select
        value={courseId}
        onChange={setCourseId}
        options={courseOptions}
        placeholder="강의 선택"
        label="Course"
      />
      {/* 메모 (텍스트 영역) */}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="메모를 입력하세요 (최대 200자)"
      />
    </div>
  );
}
