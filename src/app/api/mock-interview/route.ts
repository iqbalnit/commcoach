import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";
import { ValidationError, validateBody } from "@/lib/validate";

const VALID_COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple"];
const VALID_ROLES = ["director", "vp"];

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  if (url.searchParams.get("summary") === "true") {
    const [total, completed] = await Promise.all([
      prisma.mockInterview.count({ where: { userId: session.user.id } }),
      prisma.mockInterview.count({ where: { userId: session.user.id, status: "completed" } }),
    ]);
    return NextResponse.json({ total, completed });
  }

  const interviews = await prisma.mockInterview.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      company: true,
      roleLevel: true,
      status: true,
      totalTurns: true,
      overallScore: true,
      startedAt: true,
      completedAt: true,
    },
  });

  return NextResponse.json(interviews);
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
      company:   { type: "string", minLength: 1, maxLength: 100 },
      roleLevel: { type: "string", minLength: 1, maxLength: 50 },
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }

  const { company, roleLevel } = validated as { company: string; roleLevel: string };

  if (!VALID_COMPANIES.includes(company)) {
    return NextResponse.json({ error: "Invalid company" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(roleLevel)) {
    return NextResponse.json({ error: "Invalid roleLevel (must be director or vp)" }, { status: 400 });
  }

  // Generate first question from Claude
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 512,
    system: `You are a ${company} senior engineering leader conducting a behavioral interview for a ${roleLevel === "vp" ? "VP" : "Director"} of Engineering candidate.
Ask one focused behavioral interview question. Return only the question text, nothing else.
Focus on leadership, influence, strategic thinking, and cross-functional impact.`,
    messages: [
      {
        role: "user",
        content: "Please ask your first interview question.",
      },
    ],
  });

  const firstQuestion =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  const initialMessages = JSON.stringify([
    {
      role: "interviewer",
      content: firstQuestion,
      timestamp: new Date().toISOString(),
      questionIndex: 1,
    },
  ]);

  const interview = await prisma.mockInterview.create({
    data: {
      userId: session.user.id,
      company,
      roleLevel,
      messages: initialMessages,
    },
  });

  return NextResponse.json({
    ...interview,
    messages: JSON.parse(interview.messages),
  });
}
