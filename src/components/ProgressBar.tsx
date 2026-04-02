"use client";

interface ProgressBarProps {
  progress: number;
  checked: number;
  total: number;
}

export default function ProgressBar({
  progress,
  checked,
  total,
}: ProgressBarProps) {
  const getColor = () => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 30) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          {checked}/{total} 완료
        </span>
        <span className="font-semibold">{progress}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
