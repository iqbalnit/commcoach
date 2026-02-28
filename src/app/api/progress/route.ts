import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let progress = await prisma.progress.findUnique({
    where: { userId: session.user.id },
  });

  if (!progress) {
    progress = await prisma.progress.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json({
    ...progress,
    scenariosCompleted: JSON.parse(progress.scenariosCompleted),
    frameworksViewed: JSON.parse(progress.frameworksViewed),
    principlesViewed: JSON.parse(progress.principlesViewed),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, payload } = body as { action: unknown; payload: unknown };

  const validActions = ["completeScenario", "viewFramework", "viewPrinciple", "updateQuizScore"];
  if (typeof action !== "string" || !validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let progress = await prisma.progress.findUnique({
    where: { userId: session.user.id },
  });

  if (!progress) {
    progress = await prisma.progress.create({
      data: { userId: session.user.id },
    });
  }

  const scenariosCompleted: string[] = JSON.parse(progress.scenariosCompleted);
  const frameworksViewed: string[] = JSON.parse(progress.frameworksViewed);
  const principlesViewed: string[] = JSON.parse(progress.principlesViewed);

  const today = new Date().toDateString();
  const lastDate = progress.lastPracticeDate
    ? new Date(progress.lastPracticeDate).toDateString()
    : null;

  let updates: Record<string, unknown> = {};

  const payloadObj = payload as Record<string, unknown>;

  if (action === "completeScenario") {
    const scenarioId = payloadObj.scenarioId;
    const minutes = payloadObj.minutes;
    if (typeof scenarioId !== "string" || scenarioId.length === 0 || scenarioId.length > 100) {
      return NextResponse.json({ error: "Invalid scenarioId" }, { status: 400 });
    }
    const mins = typeof minutes === "number" && isFinite(minutes) ? minutes : 0;
    if (!scenariosCompleted.includes(scenarioId)) {
      scenariosCompleted.push(scenarioId);
    }
    const isNewDay = lastDate !== today;
    const isConsecutive =
      lastDate ===
      new Date(Date.now() - 86400000).toDateString();

    updates = {
      scenariosCompleted: JSON.stringify(scenariosCompleted),
      practiceSessionCount: progress.practiceSessionCount + 1,
      totalPracticeMinutes: progress.totalPracticeMinutes + Math.max(1, mins),
      streakDays: isNewDay
        ? isConsecutive
          ? progress.streakDays + 1
          : 1
        : progress.streakDays,
      lastPracticeDate: isNewDay ? new Date() : progress.lastPracticeDate,
    };
  } else if (action === "viewFramework") {
    const frameworkId = payloadObj.frameworkId;
    if (typeof frameworkId !== "string" || frameworkId.length === 0 || frameworkId.length > 100) {
      return NextResponse.json({ error: "Invalid frameworkId" }, { status: 400 });
    }
    if (!frameworksViewed.includes(frameworkId)) {
      frameworksViewed.push(frameworkId);
    }
    updates = { frameworksViewed: JSON.stringify(frameworksViewed) };
  } else if (action === "viewPrinciple") {
    const principleId = payloadObj.principleId;
    if (typeof principleId !== "string" || principleId.length === 0 || principleId.length > 100) {
      return NextResponse.json({ error: "Invalid principleId" }, { status: 400 });
    }
    if (!principlesViewed.includes(principleId)) {
      principlesViewed.push(principleId);
    }
    updates = { principlesViewed: JSON.stringify(principlesViewed) };
  } else if (action === "updateQuizScore") {
    const score = payloadObj.score;
    if (typeof score !== "number" || !isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json({ error: "Invalid score (must be 0–100)" }, { status: 400 });
    }
    if (score > progress.quizHighScore) {
      updates = { quizHighScore: score };
    }
  }

  const updated = await prisma.progress.update({
    where: { userId: session.user.id },
    data: updates,
  });

  return NextResponse.json({
    ...updated,
    scenariosCompleted: JSON.parse(updated.scenariosCompleted),
    frameworksViewed: JSON.parse(updated.frameworksViewed),
    principlesViewed: JSON.parse(updated.principlesViewed),
  });
}
