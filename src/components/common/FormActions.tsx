interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  cancelText?: string;
  saveText?: string;
}

export default function FormActions({
  onCancel,
  onSave,
  cancelText = '취소',
  saveText = '저장',
}: FormActionsProps) {
  return (
    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
      >
        {saveText}
      </button>
    </div>
  );
}
