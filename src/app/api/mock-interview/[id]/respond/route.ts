import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";

interface MockInterviewMessage {
  role: "interviewer" | "user" | "feedback";
  content: string;
  timestamp: string;
  questionIndex?: number;
  feedbackData?: {
    strengths: string[];
    improvements: string[];
    score: number;
  };
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await params;
  const interview = await prisma.mockInterview.findUnique({ where: { id } });

  if (!interview || interview.userId !== session.user.id) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (interview.status !== "in_progress") {
    return new Response(JSON.stringify({ error: "Interview is not in progress" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const obj = body as Record<string, unknown>;
  if (typeof obj.userAnswer !== "string" || obj.userAnswer.trim().length < 5) {
    return new Response(JSON.stringify({ error: "userAnswer is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages: MockInterviewMessage[] = JSON.parse(interview.messages);
  const questionCount = messages.filter((m) => m.role === "interviewer").length;
  const isLastQuestion = questionCount >= 5;

  // Build conversation history for Claude
  const conversationHistory: { role: "user" | "assistant"; content: string }[] = [];
  for (const msg of messages) {
    if (msg.role === "interviewer") {
      conversationHistory.push({ role: "assistant", content: msg.content });
    } else if (msg.role === "user") {
      conversationHistory.push({ role: "user", content: msg.content });
    }
  }
  conversationHistory.push({ role: "user", content: obj.userAnswer as string });

  const systemPrompt = `You are a ${interview.company} senior engineering leader conducting a behavioral interview for a ${interview.roleLevel === "vp" ? "VP" : "Director"} of Engineering candidate.

After each answer, provide coaching feedback AND your next question (unless the interview is complete).

Format your response EXACTLY as follows with no deviations:
---FEEDBACK---
[2-3 sentences of specific coaching feedback on structure, specificity, and executive presence]
FEEDBACK_SCORE: [score 1-10]
STRENGTHS: [comma-separated list of 1-3 strengths]
IMPROVEMENTS: [comma-separated list of 1-3 specific improvements]
${isLastQuestion ? `---INTERVIEW_COMPLETE---
[1-2 sentence overall assessment paragraph]
OVERALL_SCORE: [score 0-100]` : `---NEXT_QUESTION---
[Your next behavioral interview question]
QUESTION_INDEX: ${questionCount + 1}`}`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await anthropic.messages.stream({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          system: systemPrompt,
          messages: conversationHistory,
        });

        let fullText = "";

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const text = chunk.delta.text;
            fullText += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        // Parse and persist after stream completes
        const newMessages: MockInterviewMessage[] = [...messages];

        // Add user answer
        newMessages.push({
          role: "user",
          content: obj.userAnswer as string,
          timestamp: new Date().toISOString(),
        });

        // Parse feedback
        const feedbackMatch = fullText.match(/---FEEDBACK---\n([\s\S]*?)(?=---(?:NEXT_QUESTION|INTERVIEW_COMPLETE)---|$)/);
        const feedbackText = feedbackMatch ? feedbackMatch[1].trim() : "";

        const scoreMatch = feedbackText.match(/FEEDBACK_SCORE:\s*(\d+)/);
        const feedbackScore = scoreMatch ? parseInt(scoreMatch[1]) : 5;

        const strengthsMatch = feedbackText.match(/STRENGTHS:\s*(.+)/);
        const strengths = strengthsMatch
          ? strengthsMatch[1].split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        const improvementsMatch = feedbackText.match(/IMPROVEMENTS:\s*(.+)/);
        const improvements = improvementsMatch
          ? improvementsMatch[1].split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        const cleanFeedback = feedbackText
          .replace(/FEEDBACK_SCORE:\s*\d+/g, "")
          .replace(/STRENGTHS:\s*.+/g, "")
          .replace(/IMPROVEMENTS:\s*.+/g, "")
          .trim();

        newMessages.push({
          role: "feedback",
          content: cleanFeedback,
          timestamp: new Date().toISOString(),
          feedbackData: { strengths, improvements, score: feedbackScore },
        });

        let overallScore: number | null = null;
        let finalSummary: string | null = null;
        let newStatus = "in_progress";

        if (isLastQuestion) {
          const completeMatch = fullText.match(/---INTERVIEW_COMPLETE---\n([\s\S]*?)(?=OVERALL_SCORE:|$)/);
          finalSummary = completeMatch ? completeMatch[1].trim() : "";
          const overallMatch = fullText.match(/OVERALL_SCORE:\s*(\d+)/);
          overallScore = overallMatch ? parseInt(overallMatch[1]) : null;
          newStatus = "completed";

          newMessages.push({
            role: "interviewer",
            content: finalSummary ?? "Interview complete.",
            timestamp: new Date().toISOString(),
          });
        } else {
          const nextQMatch = fullText.match(/---NEXT_QUESTION---\n([\s\S]*?)(?=QUESTION_INDEX:|$)/);
          const nextQuestion = nextQMatch ? nextQMatch[1].trim() : "";

          if (nextQuestion) {
            newMessages.push({
              role: "interviewer",
              content: nextQuestion,
              timestamp: new Date().toISOString(),
              questionIndex: questionCount + 1,
            });
          }
        }

        await prisma.mockInterview.update({
          where: { id },
          data: {
            messages: JSON.stringify(newMessages),
            totalTurns: interview.totalTurns + 1,
            status: newStatus,
            overallScore: overallScore ?? undefined,
            finalSummary: finalSummary ?? undefined,
            completedAt: newStatus === "completed" ? new Date() : undefined,
          },
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, isComplete: isLastQuestion })}\n\n`));
        controller.close();
      } catch (err) {
        console.error("Streaming error:", err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
