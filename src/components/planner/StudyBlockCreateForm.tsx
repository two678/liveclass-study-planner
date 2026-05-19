interface Props {
  day?: string;
  hour?: string;
}

export default function StudyBlockCreateForm({ day, hour }: Props) {
  const handleCreateBlock = () => {
    console.log('add to list');
  };

  return (
    <div>
      <p>새 학습 일정 추가</p>
      <p>
        선택된 시작 시간: {day} {hour}
      </p>
      <button onClick={handleCreateBlock}>저장</button>
    </div>
  );
}
