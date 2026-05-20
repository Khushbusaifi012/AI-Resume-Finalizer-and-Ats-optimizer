"use client";

import ScoreRing from "@/components/ScoreRing";
import ATSScoreCard from "@/components/ATSScoreCard";
import IssueList from "@/components/IssueList";
import { scoreRating } from "@/lib/score-rating";
import type { AnalyzeResult } from "@/lib/types";

interface ResultsPanelProps {
  analysis: AnalyzeResult;
}

export default function ResultsPanel({ analysis }: ResultsPanelProps) {
  const rating = scoreRating(analysis.score.overall);

  return (
    <div className="space-y-6">
      <div className="card card-accent animate-in shadow-glow card-hover">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreRing score={analysis.score.overall} />
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
              <span className="stat-chip">~{analysis.resume.wordCount} words</span>
              <span className="stat-chip">~{analysis.resume.pageEstimate} page(s)</span>
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
        <div className="panel-header">
          <span className="panel-icon">💡</span>
          <h3 className="section-title">Issues & feedback</h3>
        </div>
        <IssueList issues={analysis.issues} />
      </div>

      {(analysis.missingKeywords.length > 0 || analysis.matchedKeywords.length > 0) && (
        <div className="card animate-in animate-in-delay-3 space-y-5 card-hover">
          {analysis.matchedKeywords.length > 0 && (
            <div>
              <div className="panel-header mb-3">
                <span className="panel-icon bg-emerald-100 dark:bg-emerald-950/50">✓</span>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Matched keywords ({analysis.matchedKeywords.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
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
              <div className="panel-header mb-3">
                <span className="panel-icon bg-red-100 dark:bg-red-950/50">!</span>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Missing keywords ({analysis.missingKeywords.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
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
  );
}
