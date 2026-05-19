import { StudyBlock } from '@/types/planner';
import { usePlannerStore } from '@/store/usePlannerStore';
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl transition-all">
        {conflictError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm mb-6 p-3 rounded-r-md whitespace-pre-line">
            {conflictError}
          </div>
        )}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          {mode === 'create' ? '새 학습 일정 추가' : '학습 일정 상세'}
        </h2>

        {mode === 'create' ? (
          <StudyBlockCreateForm day={day} hour={hour} onClose={onClose} />
        ) : (
          block && <StudyBlockEditForm block={block} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
