import { StudyBlock } from '@/types/planner';

interface Props {
  day?: string;
  hour?: string;
  block?: StudyBlock;
}

export default function StudyBlockEditForm({ day, hour, block }: Props) {
  const handleEditBlock = () => {
    console.log('edit block');
  };

  return (
    <div>
      <p>
        선택된 시작 시간: {block?.startTime} {block?.endTime}
      </p>
      <p>선택된 블록 내용: {block?.memo}</p>
      <p>학습 일정 수정</p>
      <button onClick={handleEditBlock}>수정하기</button>
    </div>
  );
}
