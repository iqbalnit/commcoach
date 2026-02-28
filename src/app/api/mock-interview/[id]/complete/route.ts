import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const updated = await prisma.mockInterview.update({
    where: { id },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
  });

  return NextResponse.json({
    ...updated,
    messages: JSON.parse(updated.messages),
  });
}
