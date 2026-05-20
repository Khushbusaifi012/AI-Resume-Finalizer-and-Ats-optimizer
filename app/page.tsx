"use client";

import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import ATSScoreCard from "@/components/ATSScoreCard";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import StepProgress from "@/components/StepProgress";
import ScoreRing from "@/components/ScoreRing";
import LoadingSpinner from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/ThemeToggle";
import { scoreRating } from "@/lib/score-rating";
import type { AnalyzeResult } from "@/lib/types";

type Step = "upload" | "results";

function issueIcon(type: "error" | "warning" | "success"): string {
  if (type === "success") return "✓";
  if (type === "warning") return "!";
  return "×";
}

const QUICK_TIPS = [
  "Use standard headings: Experience, Education, Skills",
  "Add numbers to bullets — %, $, team size, users",
  "Paste a job description for keyword matching",
  "Keep it 1–2 pages with clear bullet points",
];

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const rating = analysis ? scoreRating(analysis.score.overall) : null;

  return (
    <main className="min-h-screen pb-20">
      <header className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-10">
          <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
            <ThemeToggle />
          </div>

          <div className="flex flex-col gap-6 pr-12 sm:flex-row sm:items-end sm:justify-between sm:pr-0">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Resume toolkit
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Resume Finalizer
              </h1>
              <p className="mt-3 max-w-lg text-slate-400">
                Upload your resume, get an ATS score, and see exactly what to improve.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="stat-chip border-white/10 bg-white/5 text-slate-300">PDF & DOCX</span>
              <span className="stat-chip border-white/10 bg-white/5 text-slate-300">ATS scoring</span>
              <span className="stat-chip border-white/10 bg-white/5 text-slate-300">Keyword match</span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <StepProgress current={step} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {error && (
          <div className="animate-in mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card card-hover space-y-6">
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

          {analysis && rating ? (
            <div className="space-y-6">
              <div className="card card-accent animate-in shadow-glow card-hover">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="relative">
                    <ScoreRing score={analysis.score.overall} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${rating.className}`}
                    >
                      {rating.label}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold text-slate-900 dark:text-white">
                      Overall ATS Score
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{rating.description}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <span className="stat-chip">
                        ~{analysis.resume.wordCount} words
                      </span>
                      <span className="stat-chip">
                        ~{analysis.resume.pageEstimate} page(s)
                      </span>
                      {analysis.keywordMatchPercent > 0 && (
                        <span className="stat-chip border-brand-200 text-brand-700 dark:border-brand-800 dark:text-brand-300">
                          {analysis.keywordMatchPercent}% keyword match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="animate-in animate-in-delay-1">
                    <ATSScoreCard label="Formatting" score={analysis.score.formatting} />
                  </div>
                  <div className="animate-in animate-in-delay-1">
                    <ATSScoreCard label="Structure" score={analysis.score.structure} />
                  </div>
                  <div className="animate-in animate-in-delay-2">
                    <ATSScoreCard label="Keywords" score={analysis.score.keywords} />
                  </div>
                  <div className="animate-in animate-in-delay-2">
                    <ATSScoreCard label="Content" score={analysis.score.content} />
                  </div>
                </div>
              </div>

              <div className="card animate-in animate-in-delay-3 card-hover">
                <h3 className="section-title">Issues & feedback</h3>
                <ul className="mt-4 space-y-2">
                  {analysis.issues.map((issue, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm ${
                        issue.type === "success"
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : issue.type === "warning"
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/60 text-xs font-bold dark:bg-black/20">
                        {issueIcon(issue.type)}
                      </span>
                      {issue.message}
                    </li>
                  ))}
                </ul>
              </div>

              {(analysis.missingKeywords.length > 0 || analysis.matchedKeywords.length > 0) && (
                <div className="card animate-in animate-in-delay-3 space-y-5 card-hover">
                  {analysis.matchedKeywords.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-emerald-500">●</span> Matched keywords
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.matchedKeywords.map((kw) => (
                          <span key={kw} className="keyword-tag-match">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.missingKeywords.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-red-500">●</span> Missing keywords
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((kw) => (
                          <span key={kw} className="keyword-tag-miss">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card flex flex-col justify-center card-hover">
              <div className="py-10 text-center">
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
              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick tips
                </p>
                <ul className="space-y-2">
                  {QUICK_TIPS.map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <span className="text-brand-500">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-slate-400 dark:text-slate-600">
        Resume Finalizer · ATS scoring for job seekers
      </footer>
    </main>
  );
}
