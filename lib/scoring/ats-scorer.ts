export interface ATSScoreBreakdown {
  overall: number;
  formatting: number;
  structure: number;
  keywords: number;
  content: number;
}

export interface ATSIssue {
  type: "error" | "warning" | "success";
  message: string;
}

export interface ATSScoreResult {
  score: ATSScoreBreakdown;
  issues: ATSIssue[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchPercent: number;
}

const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "drove", "enhanced", "implemented", "improved", "increased", "led",
  "managed", "optimized", "produced", "reduced", "spearheaded", "streamlined",
];

const STANDARD_SECTIONS = [
  "experience", "education", "skills", "summary", "contact",
];

const FORMATTING_WARNINGS = [
  { pattern: /\|[\s\S]*\|/, message: "Tables may not parse well in ATS systems" },
  { pattern: /[^\x00-\x7F]{5,}/, message: "Special characters or icons detected" },
  { pattern: /(column|sidebar|text box)/i, message: "Multi-column layouts can break ATS parsing" },
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "this", "that", "will", "have", "from",
  "your", "you", "our", "are", "was", "were", "been", "being", "about",
  "into", "through", "during", "before", "after", "above", "below",
  "between", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "each", "few", "more", "most",
  "other", "some", "such", "only", "own", "same", "than", "too", "very",
  "can", "just", "should", "now", "work", "working", "role", "position",
  "job", "team", "company", "ability", "required", "preferred", "years",
  "year", "experience", "including", "using", "use", "used", "well",
  "looking", "seeking", "good", "great", "expertise", "strong", "solid",
  "excellent", "apply", "application", "candidate", "hire", "hiring",
  "am", "have", "has", "had", "also", "any", "who", "what", "which",
  "of", "stack",
]);

const PHRASE_PATTERNS: { pattern: RegExp; keyword: string }[] = [
  { pattern: /software\s+engineer/i, keyword: "software engineer" },
  { pattern: /full[\s-]?stack/i, keyword: "full stack" },
  { pattern: /mern[\s-]?stack/i, keyword: "mern stack" },
  { pattern: /web\s+developer/i, keyword: "web developer" },
  { pattern: /backend\s+developer/i, keyword: "backend developer" },
  { pattern: /frontend\s+developer/i, keyword: "frontend developer" },
];

const KNOWN_TECH_KEYWORDS = [
  "python", "django", "flask", "fastapi", "javascript", "typescript",
  "react", "node.js", "nodejs", "express", "mongodb", "mern", "aws", "azure", "gcp",
  "docker", "kubernetes", "sql", "postgresql", "mysql", "redis", "git", "github",
  "java", "spring", "angular", "vue", "next.js", "nextjs", "graphql", "rest", "api",
  "html", "css", "tailwind", "bootstrap", "linux", "agile", "scrum",
];

const KEYWORD_ALIASES: Record<string, string[]> = {
  "mern stack": ["mern stack", "mern", "mongodb", "express", "react", "node"],
  mern: ["mern", "mongodb", "express", "react", "node"],
  "software engineer": ["software engineer", "software developer", "developer"],
  nodejs: ["node.js", "nodejs", "node"],
  "node.js": ["node.js", "nodejs", "node"],
  nextjs: ["next.js", "nextjs"],
};

function keywordMatchesResume(resumeLower: string, keyword: string): boolean {
  if (resumeLower.includes(keyword)) return true;

  const aliases = KEYWORD_ALIASES[keyword] ?? [keyword];
  return aliases.some((alias) => resumeLower.includes(alias));
}

function extractKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const keywords = new Set<string>();

  for (const { pattern, keyword } of PHRASE_PATTERNS) {
    if (pattern.test(text)) keywords.add(keyword);
  }

  for (const skill of KNOWN_TECH_KEYWORDS) {
    if (text.includes(skill)) keywords.add(skill);
  }

  for (const segment of text.split(/[,;/]|\band\b/i)) {
    const cleaned = segment
      .trim()
      .replace(/^.*\b(in|with|using|like|such as|expertise in|skills in)\b\s*/i, "")
      .trim();

    if (cleaned.length < 2 || cleaned.length > 40) continue;

    const tokens = cleaned.match(/\b[a-z][a-z0-9+#.]{1,25}\b/g) ?? [];
    for (const token of tokens) {
      if (!STOP_WORDS.has(token)) keywords.add(token);
    }
  }

  if (keywords.size === 0) {
    const words = text.match(/\b[a-z][a-z0-9+#.]{1,30}\b/g) ?? [];
    const freq = new Map<string, number>();
    for (const word of words) {
      if (STOP_WORDS.has(word) || word.length < 3) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
    for (const [word] of [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
      keywords.add(word);
    }
  }

  return [...keywords]
    .filter((k) => !STOP_WORDS.has(k))
    .filter((k) => k !== "mern" || !keywords.has("mern stack"))
    .slice(0, 12);
}

function scoreFormatting(resumeText: string): { score: number; issues: ATSIssue[] } {
  const issues: ATSIssue[] = [];
  let deductions = 0;

  for (const { pattern, message } of FORMATTING_WARNINGS) {
    if (pattern.test(resumeText)) {
      issues.push({ type: "warning", message });
      deductions += 15;
    }
  }

  if (resumeText.length < 200) {
    issues.push({ type: "error", message: "Resume text is very short" });
    deductions += 30;
  }

  if (resumeText.split(/\s+/).length > 900) {
    issues.push({ type: "warning", message: "Resume may be too long (over ~2 pages)" });
    deductions += 10;
  }

  if (issues.length === 0) {
    issues.push({ type: "success", message: "Clean formatting detected" });
  }

  return { score: Math.max(0, 100 - deductions), issues };
}

function scoreStructure(resumeText: string, sectionNames: string[]): { score: number; issues: ATSIssue[] } {
  const issues: ATSIssue[] = [];
  const lower = resumeText.toLowerCase();
  const found = STANDARD_SECTIONS.filter((s) =>
    sectionNames.some((n) => n.toLowerCase().includes(s)) || lower.includes(s)
  );

  const score = Math.round((found.length / STANDARD_SECTIONS.length) * 100);

  for (const section of ["experience", "education", "skills"]) {
    if (!found.includes(section)) {
      issues.push({ type: "warning", message: `Missing or unclear "${section}" section` });
    }
  }

  if (found.length >= 4) {
    issues.push({ type: "success", message: "Standard resume sections found" });
  }

  return { score, issues };
}

function scoreContent(resumeText: string): { score: number; issues: ATSIssue[] } {
  const issues: ATSIssue[] = [];
  const lower = resumeText.toLowerCase();
  const bullets = resumeText.split("\n").filter((l) => /^[\u2022\-*•]/.test(l.trim()) || /^\d+\./.test(l.trim()));

  let score = 50;

  const verbCount = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  score += Math.min(25, verbCount * 3);

  const hasMetrics = /\d+%|\$\d+|\d+\+|\d+\s*(users|clients|projects|team)/i.test(resumeText);
  if (hasMetrics) {
    score += 15;
    issues.push({ type: "success", message: "Quantifiable achievements detected" });
  } else {
    issues.push({ type: "warning", message: "Add metrics (%, $, numbers) to strengthen bullets" });
  }

  if (bullets.length >= 3) {
    score += 10;
  } else {
    issues.push({ type: "warning", message: "Use bullet points for scanability" });
  }

  return { score: Math.min(100, score), issues };
}

function scoreKeywords(
  resumeText: string,
  jobDescription?: string
): {
  score: number;
  issues: ATSIssue[];
  matched: string[];
  missing: string[];
  matchPercent: number;
} {
  if (!jobDescription?.trim()) {
    return {
      score: 70,
      issues: [{ type: "warning", message: "Add a job description for keyword matching" }],
      matched: [],
      missing: [],
      matchPercent: 0,
    };
  }

  const keywords = extractKeywords(jobDescription);
  const lower = resumeText.toLowerCase();
  const matched = keywords.filter((k) => keywordMatchesResume(lower, k));
  const missing = keywords.filter((k) => !keywordMatchesResume(lower, k));
  const matchPercent = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0;

  const issues: ATSIssue[] = [];
  if (matchPercent >= 70) {
    issues.push({ type: "success", message: `Strong keyword match (${matchPercent}%)` });
  } else if (matchPercent >= 40) {
    issues.push({ type: "warning", message: `Moderate keyword match (${matchPercent}%) — room to improve` });
  } else {
    issues.push({ type: "error", message: `Low keyword match (${matchPercent}%) — tailor resume to job` });
  }

  return { score: matchPercent, issues, matched, missing, matchPercent };
}

export function scoreResume(
  resumeText: string,
  sectionNames: string[],
  jobDescription?: string
): ATSScoreResult {
  const formatting = scoreFormatting(resumeText);
  const structure = scoreStructure(resumeText, sectionNames);
  const content = scoreContent(resumeText);
  const keywords = scoreKeywords(resumeText, jobDescription);

  const overall = Math.round(
    formatting.score * 0.25 +
      structure.score * 0.25 +
      keywords.score * 0.25 +
      content.score * 0.25
  );

  return {
    score: {
      overall,
      formatting: formatting.score,
      structure: structure.score,
      keywords: keywords.score,
      content: content.score,
    },
    issues: [...formatting.issues, ...structure.issues, ...content.issues, ...keywords.issues],
    matchedKeywords: keywords.matched,
    missingKeywords: keywords.missing.slice(0, 15),
    keywordMatchPercent: keywords.matchPercent,
  };
}
