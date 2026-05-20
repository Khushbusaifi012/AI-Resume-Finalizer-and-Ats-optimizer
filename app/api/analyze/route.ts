import { NextResponse } from "next/server";
import { parseResumeFromFormData } from "@/lib/parsers/resume";
import { scoreResume } from "@/lib/scoring/ats-scorer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = await parseResumeFromFormData(formData);
    const jobDescription = (formData.get("jobDescription") as string) || undefined;

    const result = scoreResume(
      parsed.text,
      parsed.sections.map((s) => s.name),
      jobDescription
    );

    return NextResponse.json({
      resume: {
        text: parsed.text,
        sections: parsed.sections,
        wordCount: parsed.wordCount,
        pageEstimate: parsed.pageEstimate,
      },
      score: result.score,
      issues: result.issues,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      keywordMatchPercent: result.keywordMatchPercent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
