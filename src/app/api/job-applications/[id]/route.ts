import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["applied", "screening", "interview", "offer", "rejected"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const obj = body as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {};

    if (typeof obj.company === "string" && obj.company.trim()) {
      patch.company = obj.company.trim().slice(0, 200);
    }
    if (typeof obj.role === "string" && obj.role.trim()) {
      patch.role = obj.role.trim().slice(0, 200);
    }
    if (typeof obj.status === "string" && VALID_STATUSES.includes(obj.status)) {
      patch.status = obj.status;
    }
    if (typeof obj.notes === "string") {
      patch.notes = obj.notes.slice(0, 5000);
    }
    if (obj.interviewDate === null) {
      patch.interviewDate = null;
    } else if (typeof obj.interviewDate === "string" && obj.interviewDate.trim()) {
      const d = new Date(obj.interviewDate);
      if (!isNaN(d.getTime())) patch.interviewDate = d;
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: patch,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/job-applications/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/job-applications/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
