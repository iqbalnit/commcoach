import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.story.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    title,
    category,
    situation,
    task,
    action,
    result,
    impact,
    companiesRelevant,
    questionTypes,
    tags,
    notes,
  } = body as {
    title?: string;
    category?: string;
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    impact?: string;
    companiesRelevant?: unknown[];
    questionTypes?: string[];
    tags?: unknown[];
    notes?: string;
  };

  const updated = {
    situation: situation ?? existing.situation,
    task: task ?? existing.task,
    action: action ?? existing.action,
    result: result ?? existing.result,
    impact: impact ?? existing.impact,
    questionTypes: questionTypes ?? JSON.parse(existing.questionTypes),
  };

  const strengthScore = computeStrengthScore(updated);

  const story = await prisma.story.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(category !== undefined && { category }),
      ...updated,
      ...(companiesRelevant !== undefined && {
        companiesRelevant: JSON.stringify(companiesRelevant),
      }),
      questionTypes: JSON.stringify(updated.questionTypes),
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(notes !== undefined && { notes }),
      strengthScore,
    },
  });

  return NextResponse.json({
    ...story,
    companiesRelevant: JSON.parse(story.companiesRelevant),
    questionTypes: JSON.parse(story.questionTypes),
    tags: JSON.parse(story.tags),
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.story.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.story.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
