import { useState } from 'react';
import { StudyBlock } from '@/types/planner';
import toast from 'react-hot-toast';
import Select from '@/components/common/Select';
import { useCourses } from '@/hooks/queries/useCourses';
import { HOURS, DAYS } from '@/constants/planner';
import { usePlannerStore } from '@/store/usePlannerStore';

interface Props {
  day?: string;
  hour?: string;
  block: StudyBlock;
  onClose: () => void;
}

export default function StudyBlockEditForm({ block, onClose }: Props) {
  const { data: coursesData } = useCourses();
  const { updateBlock, deleteBlock } = usePlannerStore();

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

    // 로컬 스토어에 업데이트만 하고, 성공하면 모달 닫기
    if (updateBlock(block.id, editBlock, coursesData?.courses)) {
      onClose();
    }
  };

  const handleDelete = () => {
    deleteBlock(block.id);
    toast.success('학습 일정이 삭제되었습니다. 저장 시 최종 반영됩니다! 🗑️');
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
        options={HOURS.slice(0, -1).map((time) => ({
          value: time,
          label: time,
        }))}
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

      {/* 취소, 저장, 삭제 액션 버튼 영역 */}
      <div className="pt-4 flex justify-between gap-3 border-t border-gray-100 mt-2">
        <button
          type="button"
          onClick={handleDelete}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
        >
          삭제
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
