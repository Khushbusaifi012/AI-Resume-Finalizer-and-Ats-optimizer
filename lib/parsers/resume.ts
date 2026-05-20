export interface ParsedResume {
  text: string;
  sections: ResumeSection[];
  wordCount: number;
  pageEstimate: number;
}

export interface ResumeSection {
  name: string;
  content: string;
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  return result.text ?? "";
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

export async function parseResumeFile(
  buffer: Buffer,
  filename: string
): Promise<ParsedResume> {
  const ext = filename.split(".").pop()?.toLowerCase();
  let text = "";

  if (ext === "pdf") {
    text = await parsePdf(buffer);
  } else if (ext === "docx") {
    text = await parseDocx(buffer);
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }

  text = normalizeText(text);

  if (text.trim().length < 50) {
    throw new Error(
      "Could not extract enough text. Your file may be a scanned image — try a text-based PDF or DOCX."
    );
  }

  const sections = extractSections(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    sections,
    wordCount,
    pageEstimate: Math.max(1, Math.ceil(wordCount / 450)),
  };
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const SECTION_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "Contact", pattern: /^(contact|personal\s+info)/i },
  { name: "Summary", pattern: /^(summary|profile|objective|about\s+me)/i },
  { name: "Experience", pattern: /^(experience|work\s+history|employment)/i },
  { name: "Education", pattern: /^(education|academic)/i },
  { name: "Skills", pattern: /^(skills|technical\s+skills|core\s+competencies)/i },
  { name: "Projects", pattern: /^(projects|portfolio)/i },
  { name: "Certifications", pattern: /^(certifications?|licenses?)/i },
];

function extractSections(text: string): ResumeSection[] {
  const lines = text.split("\n");
  const sections: ResumeSection[] = [];
  let current: ResumeSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matched = SECTION_PATTERNS.find(({ pattern }) =>
      pattern.test(trimmed.replace(/:$/, ""))
    );

    if (matched && trimmed.length < 40) {
      if (current) sections.push(current);
      current = { name: matched.name, content: "" };
    } else if (current) {
      current.content += (current.content ? "\n" : "") + trimmed;
    }
  }

  if (current) sections.push(current);

  if (sections.length === 0) {
    sections.push({ name: "Full Resume", content: text.slice(0, 2000) });
  }

  return sections;
}

export async function parseResumeFromFormData(
  formData: FormData
): Promise<ParsedResume> {
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("No resume file uploaded.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return parseResumeFile(buffer, file.name);
}
