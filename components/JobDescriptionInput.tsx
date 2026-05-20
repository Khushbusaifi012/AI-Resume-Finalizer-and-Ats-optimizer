"use client";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="section-title">Job description</label>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Optional
        </span>
      </div>
      <p className="section-subtitle mb-3">
        Paste the job posting to match keywords against your resume.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={6}
        placeholder="e.g. We are looking for a Software Engineer with experience in React, Node.js, and cloud platforms..."
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:bg-slate-800"
      />
      {value.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">{value.length} characters</p>
      )}
    </div>
  );
}
