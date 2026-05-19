import { useState } from 'react';
import { StudyBlock } from '@/types/planner';
import Select from '@/components/common/Select';
import { useCourses } from '@/hooks/queries/useCourses';
import { HOURS, DAYS } from '@/constants/planner';
import FormActions from '@/components/common/FormActions';
import { usePlannerStore } from '@/store/usePlannerStore';

import { useSavePlanner } from '@/hooks/queries/usePlanner';

interface Props {
  day?: string;
  hour?: string;
  block: StudyBlock;
  onClose: () => void;
}

export default function StudyBlockEditForm({ block, onClose }: Props) {
  const { data: coursesData } = useCourses();
  const { weekStart, blocks, updateBlock } = usePlannerStore();
  const { mutate: savePlanner } = useSavePlanner();
  // 1. 상태 초기화: 수정 모드면 block 데이터, 추가 모드면 클릭한 위치(hour) 데이터
  const [startTime, setStartTime] = useState<string>(
    block?.startTime || '08:00'
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

  const handleSave = () => {
    if (!dayOfWeek || !startTime || !endTime || !courseId) return;

    const dayIndex = DAYS.findIndex((d) => d === dayOfWeek);
    const editBlock = {
      courseId,
      dayOfWeek: dayIndex,
      startTime,
      endTime,
      memo,
    };

    if (!updateBlock(block.id, editBlock, coursesData?.courses)) return;

    const updatedBlocks = blocks.map((b) =>
      b.id === block.id ? { ...b, ...editBlock } : b
    );

    savePlanner({
      weekStart,
      blocks: updatedBlocks,
    });

    onClose();
  };

  return (
    <div className="space-y-5">
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
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          메모
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
          placeholder="메모를 입력하세요 (최대 200자)"
          rows={3}
        />
      </div>

      <FormActions onCancel={onClose} onSave={handleSave} />
    </div>
  );
}
