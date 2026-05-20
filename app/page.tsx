"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import StepProgress from "@/components/StepProgress";
import LoadingSpinner from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/ThemeToggle";
import WaveDivider from "@/components/WaveDivider";
import EmptyState from "@/components/EmptyState";
import ResultsPanel from "@/components/ResultsPanel";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import type { AnalyzeResult } from "@/lib/types";

type Step = "upload" | "results";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleAnalyze() {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription);
      }

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
      setStep("results");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setAnalysis(null);
    setStep("upload");
    setError(null);
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 pb-12 text-white sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 left-1/2 h-32 w-[120%] -translate-x-1/2 rounded-[100%] bg-brand-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-4 pt-8 sm:pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Resume toolkit
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                ● Live
              </span>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full flex-1 text-center lg:max-w-xl lg:text-left">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Resume Finalizer
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-slate-400 lg:mx-0">
                Upload your resume, get an ATS score, and see exactly what to improve.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="stat-chip border-white/10 bg-white/5 text-slate-300">PDF & DOCX</span>
                <span className="stat-chip border-white/10 bg-white/5 text-slate-300">ATS scoring</span>
                <span className="stat-chip border-white/10 bg-white/5 text-slate-300">Keyword match</span>
              </div>
            </div>

            <div className="shrink-0 rounded-[2rem] bg-white/95 p-2 shadow-lg ring-1 ring-white/20 sm:rounded-[2.5rem] sm:p-3">
              <Image
                src="/hero-resume.png"
                alt="Person working on resume at a desk"
                width={300}
                height={240}
                priority
                className="h-auto w-52 rounded-[1.25rem] object-contain sm:w-60 sm:rounded-[1.5rem] lg:w-64"
              />
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:rounded-[2rem]">
            <StepProgress current={step} />
          </div>
        </div>

        <WaveDivider />
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {error && (
          <div className="animate-in mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="card card-hover space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="step-badge">1</span>
                <div>
                  <h2 className="section-title">Upload resume</h2>
                  <p className="section-subtitle">Add your PDF or DOCX file</p>
                </div>
              </div>
              {analysis && (
                <button onClick={handleReset} className="btn-ghost shrink-0 text-xs">
                  Reset
                </button>
              )}
            </div>
            <ResumeUpload file={file} onFileSelect={setFile} disabled={loading} />
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Analyzing your resume...
                </>
              ) : analysis ? (
                "Re-analyze ATS Score"
              ) : (
                "Analyze ATS Score →"
              )}
            </button>
          </div>

          <div ref={resultsRef}>
            {loading ? (
              <ResultsSkeleton />
            ) : analysis ? (
              <ResultsPanel analysis={analysis} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
        Resume Finalizer · ATS scoring for job seekers
      </footer>
    </main>
  );
}
