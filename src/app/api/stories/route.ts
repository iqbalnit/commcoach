import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ValidationError, validateBody } from "@/lib/validate";

function computeStrengthScore(data: {
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  questionTypes: string[];
}): number {
  let score = 0;
  if (data.situation.length > 100) score += 15;
  if (data.task.length > 80) score += 20;
  if (data.action.length > 200) score += 25;
  if (data.result.length > 100) score += 20;
  if (/\d/.test(data.impact)) score += 10;
  if (data.questionTypes.length >= 2) score += 10;
  return Math.min(score, 100);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stories = await prisma.story.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    stories.map((s) => ({
      ...s,
      companiesRelevant: JSON.parse(s.companiesRelevant),
      questionTypes: JSON.parse(s.questionTypes),
      tags: JSON.parse(s.tags),
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
      title:     { type: "string", minLength: 1, maxLength: 200 },
      category:  { type: "string", minLength: 1, maxLength: 100 },
      situation: { type: "string", minLength: 1, maxLength: 5000 },
      task:      { type: "string", minLength: 1, maxLength: 5000 },
      action:    { type: "string", minLength: 1, maxLength: 5000 },
      result:    { type: "string", minLength: 1, maxLength: 5000 },
      impact:    { type: "string", minLength: 1, maxLength: 2000 },
      companiesRelevant: { type: "array", optional: true },
      questionTypes:     { type: "array", optional: true },
      tags:              { type: "array", optional: true },
      notes:             { type: "string", optional: true, maxLength: 5000 },
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }

  const {
    title,
    category,
    situation,
    task,
    action,
    result,
    impact,
    companiesRelevant = [],
    questionTypes = [],
    tags = [],
    notes = "",
  } = validated as {
    title: string;
    category: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    impact: string;
    companiesRelevant?: unknown[];
    questionTypes?: unknown[];
    tags?: unknown[];
    notes?: string;
  };

  const strengthScore = computeStrengthScore({
    situation,
    task,
    action,
    result,
    impact,
    questionTypes: questionTypes as string[],
  });

  const story = await prisma.story.create({
    data: {
      userId: session.user.id,
      title,
      category,
      situation,
      task,
      action,
      result,
      impact,
      companiesRelevant: JSON.stringify(companiesRelevant),
      questionTypes: JSON.stringify(questionTypes),
      tags: JSON.stringify(tags),
      strengthScore,
      notes,
    },
  });

  return NextResponse.json({
    ...story,
    companiesRelevant: JSON.parse(story.companiesRelevant),
    questionTypes: JSON.parse(story.questionTypes),
    tags: JSON.parse(story.tags),
  });
}
