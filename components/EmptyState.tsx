"use client";

const STEPS = [
  { num: "1", title: "Upload resume", desc: "PDF or DOCX file" },
  { num: "2", title: "Add job description", desc: "Optional but recommended" },
  { num: "3", title: "Get ATS score", desc: "Instant breakdown" },
];

const QUICK_TIPS = [
  "Use standard headings: Experience, Education, Skills",
  "Add numbers to bullets — %, $, team size, users",
  "Paste a job description for keyword matching",
  "Keep it 1–2 pages with clear bullet points",
];

export default function EmptyState() {
  return (
    <div className="card flex flex-col justify-center card-hover">
      <div className="py-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-100 to-indigo-100 text-3xl shadow-inner dark:from-brand-950 dark:to-indigo-950">
          📊
        </div>
        <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">
          Your ATS report awaits
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Upload a resume and hit analyze to unlock your score breakdown.
        </p>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">How it works</p>
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              {step.num}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{step.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick tips</p>
        <ul className="space-y-2">
          {QUICK_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-brand-500">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
