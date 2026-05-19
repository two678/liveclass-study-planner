import TimeGrid from '@/components/planner/TimeGrid';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        주간 학습 플래너 📖
      </h1>
      <TimeGrid />
    </div>
  );
}
