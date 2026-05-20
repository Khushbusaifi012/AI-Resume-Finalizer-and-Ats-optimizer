"use client";

type Step = "upload" | "results";

const STEPS: { id: Step; label: string; number: number }[] = [
  { id: "upload", label: "Upload", number: 1 },
  { id: "results", label: "Analyze", number: 2 },
];

function stepIndex(step: Step): number {
  return STEPS.findIndex((s) => s.id === step);
}

interface StepProgressProps {
  current: Step;
}

export default function StepProgress({ current }: StepProgressProps) {
  const activeIndex = stepIndex(current);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  isComplete
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/50"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {isComplete ? "✓" : step.number}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? "text-brand-200" : isComplete ? "text-emerald-300" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-16 ${index < activeIndex ? "bg-emerald-400" : "bg-white/20"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
