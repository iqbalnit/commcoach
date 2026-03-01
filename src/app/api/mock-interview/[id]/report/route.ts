import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";

interface MockInterviewMessage {
  role: "interviewer" | "user" | "feedback";
  content: string;
  timestamp: string;
  questionIndex?: number;
  feedbackData?: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const interview = await prisma.mockInterview.findUnique({ where: { id } });

  if (!interview || interview.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages: MockInterviewMessage[] = JSON.parse(interview.messages);
  const interviewerMsgs = messages.filter((m) => m.role === "interviewer");
  const userMsgs = messages.filter((m) => m.role === "user");
  const feedbackMsgs = messages.filter((m) => m.role === "feedback");

  // Build per-question summary for Claude
  const questionAnswers = interviewerMsgs
    .slice(0, 5)
    .map((q, i) => {
      const answer = userMsgs[i]?.content ?? "(no answer provided)";
      const feedback = feedbackMsgs[i];
      return {
        questionIndex: i + 1,
        question: q.content,
        answer,
        existingScore: feedback?.feedbackData?.score ?? null,
        existingStrengths: feedback?.feedbackData?.strengths ?? [],
        existingImprovements: feedback?.feedbackData?.improvements ?? [],
      };
    });

  const avgScore =
    feedbackMsgs.length > 0
      ? Math.round(
          feedbackMsgs.reduce((s, m) => s + (m.feedbackData?.score ?? 0), 0) /
            feedbackMsgs.length
        ) * 10
      : interview.overallScore ?? 50;

  const prompt = `You are an executive communication coach writing a formal interview performance report.

Here is a completed ${interview.company} mock interview for a ${interview.roleLevel === "vp" ? "VP" : "Director"} of Engineering candidate.

Questions and Answers:
${questionAnswers.map((qa) => `
Q${qa.questionIndex}: ${qa.question}
Answer: ${qa.answer}
Existing score: ${qa.existingScore}/10
Existing strengths: ${qa.existingStrengths.join(", ")}
Existing improvements: ${qa.existingImprovements.join(", ")}
`).join("\n---\n")}

Overall score: ${avgScore}/100
Final summary from interviewer: ${interview.finalSummary ?? "None provided"}

Return ONLY valid JSON with this exact shape (no markdown, no code blocks):
{
  "executiveSummary": "A 2-3 sentence professional summary of the candidate's performance",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "topRecommendations": ["rec1", "rec2", "rec3"],
  "questionBreakdown": [
    {
      "questionIndex": 1,
      "questionText": "...",
      "userAnswer": "...",
      "feedbackText": "...",
      "score": 7,
      "strengths": ["...", "..."],
      "improvements": ["...", "..."],
      "idealAnswerOpening": "A strong opening line that would anchor a better answer"
    }
  ]
}

For questionBreakdown, include all ${questionAnswers.length} questions. Use the existing scores and feedback but enhance the feedbackText and add idealAnswerOpening for each.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4000,
    system: "You are an executive communication expert. Return only valid JSON, no other text.",
    messages: [{ role: "user", content: prompt }],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  let aiData: {
    executiveSummary: string;
    keyThemes: string[];
    topRecommendations: string[];
    questionBreakdown: {
      questionIndex: number;
      questionText: string;
      userAnswer: string;
      feedbackText: string;
      score: number;
      strengths: string[];
      improvements: string[];
      idealAnswerOpening: string;
    }[];
  };

  try {
    aiData = JSON.parse(responseText);
  } catch {
    return NextResponse.json(
      { error: "Could not parse AI response", raw: responseText },
      { status: 422 }
    );
  }

  const reportData = {
    interviewId: interview.id,
    company: interview.company,
    roleLevel: interview.roleLevel,
    overallScore: avgScore,
    completedAt: (interview.completedAt ?? interview.startedAt).toISOString(),
    finalSummary: interview.finalSummary ?? "",
    executiveSummary: aiData.executiveSummary,
    keyThemes: aiData.keyThemes,
    topRecommendations: aiData.topRecommendations,
    questionBreakdown: aiData.questionBreakdown,
  };

  return NextResponse.json({ reportData });
}
