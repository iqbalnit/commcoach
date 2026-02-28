import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let lp = await prisma.learningPath.findUnique({
    where: { userId: session.user.id },
  });

  if (!lp) {
    lp = await prisma.learningPath.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json({
    ...lp,
    completedWeeks: JSON.parse(lp.completedWeeks),
    weekProgressData: JSON.parse(lp.weekProgressData),
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let lp = await prisma.learningPath.findUnique({
    where: { userId: session.user.id },
  });

  if (!lp) {
    lp = await prisma.learningPath.create({
      data: { userId: session.user.id },
    });
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

  const { currentWeek, completedWeeks, weekProgressData, targetInterviewDate } = body as {
    currentWeek?: unknown;
    completedWeeks?: unknown;
    weekProgressData?: unknown;
    targetInterviewDate?: unknown;
  };

  if (currentWeek !== undefined && (typeof currentWeek !== "number" || !isFinite(currentWeek) || currentWeek < 1 || currentWeek > 12)) {
    return NextResponse.json({ error: "currentWeek must be 1–12" }, { status: 400 });
  }
  if (completedWeeks !== undefined && !Array.isArray(completedWeeks)) {
    return NextResponse.json({ error: "completedWeeks must be an array" }, { status: 400 });
  }
  if (weekProgressData !== undefined && (typeof weekProgressData !== "object" || Array.isArray(weekProgressData) || weekProgressData === null)) {
    return NextResponse.json({ error: "weekProgressData must be an object" }, { status: 400 });
  }

  // At this point completedWeeks/weekProgressData/currentWeek have been validated above
  const validatedCompletedWeeks = completedWeeks as number[] | undefined;
  const validatedWeekProgressData = weekProgressData as Record<string, unknown> | undefined;
  const validatedCurrentWeek = currentWeek as number | undefined;
  const validatedTargetInterviewDate = targetInterviewDate as string | null | undefined;

  const existing = {
    completedWeeks: JSON.parse(lp.completedWeeks) as number[],
    weekProgressData: JSON.parse(lp.weekProgressData) as Record<string, unknown>,
  };

  const updatedCompletedWeeks =
    validatedCompletedWeeks !== undefined ? validatedCompletedWeeks : existing.completedWeeks;
  const updatedWeekProgressData =
    validatedWeekProgressData !== undefined
      ? { ...existing.weekProgressData, ...validatedWeekProgressData }
      : existing.weekProgressData;

  // Auto-advance currentWeek if a week was just completed
  let newCurrentWeek = validatedCurrentWeek !== undefined ? validatedCurrentWeek : lp.currentWeek;
  if (validatedCompletedWeeks !== undefined) {
    const maxCompleted = Math.max(0, ...updatedCompletedWeeks);
    newCurrentWeek = Math.min(12, maxCompleted + 1);
  }

  const updated = await prisma.learningPath.update({
    where: { userId: session.user.id },
    data: {
      currentWeek: newCurrentWeek,
      completedWeeks: JSON.stringify(updatedCompletedWeeks),
      weekProgressData: JSON.stringify(updatedWeekProgressData),
      ...(validatedTargetInterviewDate !== undefined && {
        targetInterviewDate: validatedTargetInterviewDate ? new Date(validatedTargetInterviewDate) : null,
      }),
    },
  });

  return NextResponse.json({
    ...updated,
    completedWeeks: JSON.parse(updated.completedWeeks),
    weekProgressData: JSON.parse(updated.weekProgressData),
  });
}
