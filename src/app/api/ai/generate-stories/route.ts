import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TEXT_CHARS = 50_000;
const MAX_CLAUDE_CHARS = 8_000;

const SYSTEM_PROMPT = `You are an expert executive career coach. Extract 3-5 STAR (Situation, Task, Action, Result) stories from the provided resume or text.

Return ONLY a valid JSON array with no markdown, no code blocks, and no extra text. Each story must follow this exact shape:
[
  {
    "title": "Brief story title (max 80 chars)",
    "category": "Leadership",
    "situation": "Use 'I' statements. Describe the context and challenge in 2-3 sentences.",
    "task": "Use 'I' statements. What was your specific responsibility or goal?",
    "action": "Use 'I' statements. List 3-5 specific actions you took. Include methodologies.",
    "result": "Use 'I' statements. Quantified outcomes. MUST include specific numbers, percentages, or metrics.",
    "impact": "Use 'I' statements. Business impact and what you learned.",
    "companiesRelevant": ["Google"],
    "questionTypes": ["leadership", "influence"]
  }
]

Category must be one of: "Leadership", "Influence", "Conflict Resolution", "Innovation", "Execution", "Stakeholder Management", "Crisis Management", "Team Building", "Strategic Thinking", "Communication".
companiesRelevant must be from: ["Google", "Amazon", "Microsoft", "Meta", "Apple"].
questionTypes must be from: ["leadership", "influence", "conflict", "innovation", "execution", "stakeholder", "crisis", "teambuilding", "strategy", "communication"].
If you cannot find enough stories, return fewer than 3 — do not fabricate.`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let sourceText = "";
  let sourceCharCount = 0;

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const fileName = (file as File).name?.toLowerCase() ?? "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileName.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParseMod = await import("pdf-parse") as any;
      const pdfParse = pdfParseMod.default ?? pdfParseMod;
      const data = await pdfParse(buffer);
      sourceText = data.text;
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      sourceText = result.value;
    } else if (fileName.endsWith(".txt")) {
      sourceText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }
  } else if (contentType.includes("application/json")) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const obj = body as Record<string, unknown>;
    if (typeof obj.text !== "string" || obj.text.trim().length === 0) {
      return NextResponse.json({ error: "text field is required" }, { status: 400 });
    }

    sourceText = obj.text;
    if (sourceText.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: `Text too long (max ${MAX_TEXT_CHARS} characters)` },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Content-Type must be multipart/form-data or application/json" },
      { status: 415 }
    );
  }

  sourceCharCount = sourceText.length;
  if (sourceCharCount === 0) {
    return NextResponse.json({ error: "No text could be extracted from the file" }, { status: 400 });
  }

  // Truncate to Claude limit
  const truncatedText =
    sourceText.length > MAX_CLAUDE_CHARS
      ? sourceText.slice(0, MAX_CLAUDE_CHARS) + "\n[... truncated for analysis]"
      : sourceText;

  const message = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Extract STAR stories from this text:\n\n${truncatedText}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  let stories: unknown[];
  try {
    stories = JSON.parse(responseText);
    if (!Array.isArray(stories)) throw new Error("Not an array");
  } catch {
    return NextResponse.json(
      { error: "Could not parse stories from AI response", raw: responseText },
      { status: 422 }
    );
  }

  return NextResponse.json({
    stories,
    sourceCharCount,
    storiesFound: stories.length,
  });
}
