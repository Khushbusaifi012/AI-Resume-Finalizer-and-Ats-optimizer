export interface AnalyzeResult {
  resume: {
    text: string;
    sections: { name: string; content: string }[];
    wordCount: number;
    pageEstimate: number;
  };
  score: {
    overall: number;
    formatting: number;
    structure: number;
    keywords: number;
    content: number;
  };
  issues: { type: "error" | "warning" | "success"; message: string }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchPercent: number;
}
