"use client";

interface ProgressBarProps {
  progress: number;
  checked: number;
  total: number;
}

function getProgressGradient(progress: number): string {
  if (progress === 100) return "var(--color-profit)";
  if (progress >= 70) return "linear-gradient(90deg, var(--color-karrot), var(--color-profit-light))";
  if (progress >= 30) return "linear-gradient(90deg, var(--color-border-strong), var(--color-karrot))";
  return "var(--color-border-strong)";
}

function getProgressTextColor(progress: number): string {
  if (progress === 100) return "var(--color-profit)";
  if (progress >= 70) return "var(--color-profit-light)";
  if (progress >= 30) return "var(--color-karrot)";
  return "var(--color-text-tertiary)";
}

export default function ProgressBar({
  progress,
  checked,
  total,
}: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span
          className="font-[family-name:var(--font-mono)] tabular-nums"
          style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}
        >
          {checked}/{total} 완료
        </span>
        <span
          className="font-bold font-[family-name:var(--font-mono)] tabular-nums"
          style={{ color: getProgressTextColor(progress), fontSize: "13px" }}
        >
          {progress}%
        </span>
      </div>
      <div className="progress-track" style={{ height: "10px" }}>
        <div
          className="h-full rounded-[var(--radius-full)]"
          style={{
            width: `${progress}%`,
            background: getProgressGradient(progress),
            transition: "width 500ms var(--ease-out-expo)",
            animation: "progress-fill 600ms var(--ease-out-expo)",
          }}
        />
      </div>
    </div>
  );
}
