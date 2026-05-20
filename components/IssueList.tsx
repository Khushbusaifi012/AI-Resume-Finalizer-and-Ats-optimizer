interface IssueListProps {
  issues: { type: "error" | "warning" | "success"; message: string }[];
}

function issueStyles(type: "error" | "warning" | "success"): string {
  if (type === "success") {
    return "border-emerald-400 bg-emerald-50/80 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300";
  }
  if (type === "warning") {
    return "border-amber-400 bg-amber-50/80 text-amber-800 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-300";
  }
  return "border-red-400 bg-red-50/80 text-red-800 dark:border-red-600 dark:bg-red-950/30 dark:text-red-300";
}

function issueIcon(type: "error" | "warning" | "success"): string {
  if (type === "success") return "✓";
  if (type === "warning") return "!";
  return "×";
}

export default function IssueList({ issues }: IssueListProps) {
  return (
    <ul className="mt-4 space-y-2">
      {issues.map((issue, i) => (
        <li
          key={i}
          className={`flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-sm ${issueStyles(issue.type)}`}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-bold dark:bg-black/25">
            {issueIcon(issue.type)}
          </span>
          <span className="leading-relaxed">{issue.message}</span>
        </li>
      ))}
    </ul>
  );
}
