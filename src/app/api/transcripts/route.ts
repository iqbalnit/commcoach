import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ValidationError, validateBody } from "@/lib/validate";

const FILLER_REGEX = /\b(um|uh|like|you know|basically|sort of|kind of)\b/gi;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transcripts = await prisma.transcript.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    transcripts.map((t) => ({
      ...t,
      aiAnalysis: t.aiAnalysis ? JSON.parse(t.aiAnalysis) : null,
    }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let validated: Record<string, unknown>;
  try {
    validated = validateBody(rawBody, {
      scenarioId:     { type: "string", minLength: 1, maxLength: 200 },
      scenarioTitle:  { type: "string", minLength: 1, maxLength: 500 },
      responseText:   { type: "string", maxLength: 50000, optional: true },
      elapsedSeconds: { type: "number", min: 0, max: 86400 },
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }

  const {
    scenarioId,
    scenarioTitle,
    responseText = "",
    elapsedSeconds,
  } = validated as {
    scenarioId: string;
    scenarioTitle: string;
    responseText?: string;
    elapsedSeconds: number;
  };

  const text = responseText ?? "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const fillerCount = (text.match(FILLER_REGEX) || []).length;
  const hasNumbers = /\d/.test(text);
  const wpm = elapsedSeconds > 0 ? Math.round((words / elapsedSeconds) * 60) : null;

  const transcript = await prisma.transcript.create({
    data: {
      userId: session.user.id,
      scenarioId,
      scenarioTitle,
      responseText: text,
      elapsedSeconds,
      wordCount: words,
      fillerCount,
      hasNumbers,
      wpm,
    },
  });

  return NextResponse.json({
    ...transcript,
    aiAnalysis: null,
  });
}
