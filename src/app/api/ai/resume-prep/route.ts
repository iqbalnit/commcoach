import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TEXT_CHARS = 50_000;
const MAX_CLAUDE_CHARS = 8_000;

const SYSTEM_PROMPT = `You are an expert executive career coach. Analyze this resume or professional background and return a comprehensive interview preparation package.

Return ONLY a valid JSON object with no markdown, no code blocks, and no extra text. Use this exact shape:
{
  "stories": [
    {
      "title": "Brief story title (max 80 chars)",
      "category": "Leadership",
      "situation": "Use 'I' statements. Context and challenge in 2-3 sentences.",
      "task": "Use 'I' statements. Your specific responsibility or goal.",
      "action": "Use 'I' statements. 3-5 specific actions you took. Include methodologies.",
      "result": "Use 'I' statements. MUST include specific numbers, percentages, or metrics.",
      "impact": "Use 'I' statements. Business impact and what you learned.",
      "companiesRelevant": ["Google"],
      "questionTypes": ["leadership"]
    }
  ],
  "predictedQuestions": [
    {
      "question": "Full behavioral question text",
      "principle": "Leadership principle or competency this maps to",
      "difficulty": "hard",
      "linkedScenarioId": null
    }
  ],
  "prepPlan": {
    "summary": "2-3 sentence personalized assessment of this candidate's strengths and gaps",
    "weeklyFocus": ["Week 1: ...", "Week 2: ...", "Week 3: ..."],
    "priorityFrameworks": ["star", "mece"],
    "topGaps": ["Gap 1", "Gap 2", "Gap 3"]
  }
}

Rules:
- Extract 3-5 STAR stories. If fewer exist, return fewer — do not fabricate.
- story.category must be one of: "Leadership", "Influence", "Conflict Resolution", "Innovation", "Execution", "Stakeholder Management", "Crisis Management", "Team Building", "Strategic Thinking", "Communication"
- story.companiesRelevant must be from: ["Google", "Amazon", "Microsoft", "Meta", "Apple"]
- story.questionTypes must be from: ["leadership", "influence", "conflict", "innovation", "execution", "stakeholder", "crisis", "teambuilding", "strategy", "communication"]
- Generate 5-8 predicted behavioral questions based on the candidate's actual background
- question.difficulty must be "easy", "medium", or "hard"
- question.linkedScenarioId must always be null (set by the client if applicable)
- prepPlan.priorityFrameworks must be from: ["prep", "scr", "star", "and-but-therefore", "listen-ask-respond", "woops", "mece", "pyramid", "ogsm", "five-whys"]
- prepPlan.topGaps should identify 3 specific weaknesses or gaps based on the resume`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") ?? "";
    let sourceText = "";
    let sourceCharCount = 0;
    let targetCompany = "";
    let roleLevel = "";

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
        try {
          // pdf-parse v2 (mehmet-kozan fork) uses class-based API
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { PDFParse } = await import("pdf-parse") as any;
          const parser = new PDFParse({ data: buffer });
          const result = await parser.getText();
          sourceText = result.text;
        } catch (pdfErr) {
          console.error("PDF parse error:", pdfErr);
          return NextResponse.json({ error: "Could not parse PDF. Try converting to TXT." }, { status: 422 });
        }
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          sourceText = result.value;
        } catch (docErr) {
          console.error("DOCX parse error:", docErr);
          return NextResponse.json({ error: "Could not parse DOCX. Try converting to TXT." }, { status: 422 });
        }
      } else if (fileName.endsWith(".txt")) {
        sourceText = buffer.toString("utf-8");
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
          { status: 400 }
        );
      }

      const tc = formData.get("targetCompany");
      const rl = formData.get("roleLevel");
      if (typeof tc === "string") targetCompany = tc;
      if (typeof rl === "string") roleLevel = rl;

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
        return NextResponse.json({ error: `Text too long (max ${MAX_TEXT_CHARS} characters)` }, { status: 400 });
      }
      if (typeof obj.targetCompany === "string") targetCompany = obj.targetCompany;
      if (typeof obj.roleLevel === "string") roleLevel = obj.roleLevel;
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

    const truncatedText =
      sourceText.length > MAX_CLAUDE_CHARS
        ? sourceText.slice(0, MAX_CLAUDE_CHARS) + "\n[... truncated for analysis]"
        : sourceText;

    const contextNote =
      targetCompany || roleLevel
        ? `\n\nContext: Target company: ${targetCompany || "not specified"}. Target role level: ${roleLevel || "not specified"}.`
        : "";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this resume and generate the interview prep package:${contextNote}\n\n${truncatedText}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip markdown code fences if Claude wraps in ```json ... ```
    const cleanedResponse = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedResponse);
      if (typeof parsed !== "object" || parsed === null) throw new Error("Not an object");
    } catch {
      console.error("Resume prep JSON parse error. Raw:", responseText.slice(0, 500));
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again.", raw: responseText.slice(0, 500) },
        { status: 422 }
      );
    }

    const result = parsed as {
      stories?: unknown[];
      predictedQuestions?: unknown[];
      prepPlan?: unknown;
    };

    return NextResponse.json({
      stories: Array.isArray(result.stories) ? result.stories : [],
      predictedQuestions: Array.isArray(result.predictedQuestions) ? result.predictedQuestions : [],
      prepPlan: result.prepPlan ?? { summary: "", weeklyFocus: [], priorityFrameworks: [], topGaps: [] },
      sourceCharCount,
    });

  } catch (err) {
    console.error("POST /api/ai/resume-prep unhandled error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
