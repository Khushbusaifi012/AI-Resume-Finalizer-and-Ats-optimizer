export default function ResultsSkeleton() {
  return (
    <div className="card animate-pulse space-y-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-[120px] w-[120px] rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-3 sm:w-full">
          <div className="mx-auto h-6 w-24 rounded-full bg-slate-200 sm:mx-0 dark:bg-slate-700" />
          <div className="mx-auto h-5 w-40 rounded bg-slate-200 sm:mx-0 dark:bg-slate-700" />
          <div className="mx-auto h-4 w-56 rounded bg-slate-200 sm:mx-0 dark:bg-slate-700" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">Analyzing your resume...</p>
    </div>
  );
}
