import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const transcript = await prisma.transcript.findUnique({ where: { id } });

  if (!transcript || transcript.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!transcript.responseText || transcript.responseText.trim().length < 20) {
    return NextResponse.json({ error: "Response too short to analyze" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    system: `You are an executive communication coach. Analyze a practice response and return ONLY valid JSON with no markdown or extra text. The JSON must have this exact shape:
{
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "frameworkAdherence": "brief assessment of how well the response follows communication frameworks",
  "score": 75
}
Score is 0-100. Be concise but specific.`,
    messages: [
      {
        role: "user",
        content: `Scenario: "${transcript.scenarioTitle}"\n\nResponse (${transcript.wordCount} words, ${transcript.elapsedSeconds}s):\n\n${transcript.responseText}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  let analysis: { strengths: string[]; improvements: string[]; frameworkAdherence: string; score: number };
  try {
    analysis = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Could not parse AI analysis", raw }, { status: 422 });
  }

  const updated = await prisma.transcript.update({
    where: { id },
    data: { aiAnalysis: JSON.stringify(analysis) },
  });

  return NextResponse.json({
    ...updated,
    aiAnalysis: analysis,
  });
}
