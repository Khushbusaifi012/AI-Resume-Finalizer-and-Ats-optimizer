"use client";

interface ATSScoreCardProps {
  label: string;
  score: number;
  icon?: string;
}

function scoreStyles(score: number): { bar: string; text: string; bg: string; track: string } {
  if (score >= 75) {
    return {
      bar: "bg-gradient-to-r from-emerald-400 to-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      track: "bg-slate-200/80 dark:bg-slate-700/80",
    };
  }
  if (score >= 50) {
    return {
      bar: "bg-gradient-to-r from-amber-400 to-amber-500",
      text: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50/80 dark:bg-amber-950/30",
      track: "bg-slate-200/80 dark:bg-slate-700/80",
    };
  }
  return {
    bar: "bg-gradient-to-r from-red-400 to-red-500",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50/80 dark:bg-red-950/30",
    track: "bg-slate-200/80 dark:bg-slate-700/80",
  };
}

const DEFAULT_ICONS: Record<string, string> = {
  Formatting: "📐",
  Structure: "🗂️",
  Keywords: "🔑",
  Content: "✍️",
};

export default function ATSScoreCard({ label, score, icon }: ATSScoreCardProps) {
  const styles = scoreStyles(score);
  const displayIcon = icon ?? DEFAULT_ICONS[label] ?? "📊";

  return (
    <div
      className={`group rounded-xl border border-slate-100/80 p-4 transition hover:scale-[1.02] dark:border-slate-700/40 ${styles.bg}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{displayIcon}</span>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
        <p className={`text-xl font-bold tabular-nums ${styles.text}`}>{score}</p>
      </div>
      <div className={`mt-3 h-2 overflow-hidden rounded-full ${styles.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${styles.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
