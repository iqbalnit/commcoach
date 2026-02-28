import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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

  return NextResponse.json({
    ...interview,
    messages: JSON.parse(interview.messages),
  });
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
  const interview = await prisma.mockInterview.findUnique({ where: { id } });

  if (!interview || interview.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;
  const validStatuses = ["in_progress", "completed", "abandoned"];
  if (typeof obj.status !== "string" || !validStatuses.includes(obj.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.mockInterview.update({
    where: { id },
    data: {
      status: obj.status,
      completedAt: obj.status === "completed" || obj.status === "abandoned" ? new Date() : undefined,
    },
  });

  return NextResponse.json({
    ...updated,
    messages: JSON.parse(updated.messages),
  });
}
