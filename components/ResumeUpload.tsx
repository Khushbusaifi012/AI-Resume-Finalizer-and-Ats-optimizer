"use client";

import { useRef, useState } from "react";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  disabled?: boolean;
}

export default function ResumeUpload({ onFileSelect, file, disabled }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(next: File | null) {
    if (!next) return;
    const ext = next.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") return;
    onFileSelect(next);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFile(e.dataTransfer.files?.[0] ?? null);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
        dragging
          ? "scale-[1.01] border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/10 dark:bg-brand-950/40"
          : file
            ? "border-emerald-400 bg-emerald-50/60 dark:border-emerald-600 dark:bg-emerald-950/30"
            : "border-slate-300 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/40 hover:shadow-md dark:border-slate-600 dark:bg-slate-800/40 dark:hover:border-brand-500 dark:hover:bg-brand-950/20"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        disabled={disabled}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80 transition group-hover:scale-105 group-hover:ring-brand-300 dark:bg-slate-800 dark:ring-slate-600 dark:group-hover:ring-brand-700">
        {file ? (
          <span className="text-3xl">📄</span>
        ) : (
          <svg className="h-8 w-8 text-slate-400 transition group-hover:text-brand-500 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )}
      </div>

      {file ? (
        <>
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">{file.name}</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">Ready · click to change</p>
        </>
      ) : (
        <>
          <p className="font-medium text-slate-800 dark:text-slate-200">
            Drop resume here or <span className="font-semibold text-brand-600 dark:text-brand-400">browse</span>
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">PDF or DOCX · up to 5 MB</p>
        </>
      )}
    </div>
  );
}
