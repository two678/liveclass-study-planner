import { StudyBlock } from '@/types/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
import { DAYS } from '@/constants/planner';
import StudyBlockCreateForm from './StudyBlockCreateForm';
import StudyBlockEditForm from './StudyBlockEditForm';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  day?: string;
  hour?: string;
  block?: StudyBlock;
  onClose: () => void;
}

export default function StudyBlockModal({
  isOpen,
  mode,
  day,
  hour,
  block,
  onClose,
}: Props) {
  const { conflictError } = usePlannerStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-100 border-2 border-black shadow-lg">
        {conflictError && (
          <div className="bg-red-100 border border-text-red-500 text-sm mb-4 p-2 rounded">
            {conflictError}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? '새 학습 일정 추가' : '학습 일정 상세'}
        </h2>

        {mode === 'create' ? (
          <StudyBlockCreateForm />
        ) : (
          <StudyBlockEditForm day={day} hour={hour} block={block} />
        )}

        {mode === 'create' ? (
          <p className="mb-4">
            선택된 시작 시간: {day} {hour}
          </p>
        ) : (
          <div className="mb-4">
            <p className="font-bold text-lg mb-2">
              {block && DAYS[block.dayOfWeek]}요일 {block?.startTime} ~{' '}
              {block?.endTime}
            </p>
            <p className="text-gray-700">메모: {block?.memo || '없음'}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 border border-black rounded-md hover:bg-gray-300 font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
