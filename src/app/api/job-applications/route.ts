import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["applied", "screening", "interview", "offer", "rejected"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: [{ interviewDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(applications);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;

  if (typeof obj.company !== "string" || obj.company.trim().length === 0) {
    return NextResponse.json({ error: "company is required" }, { status: 400 });
  }
  if (typeof obj.role !== "string" || obj.role.trim().length === 0) {
    return NextResponse.json({ error: "role is required" }, { status: 400 });
  }

  const status =
    typeof obj.status === "string" && VALID_STATUSES.includes(obj.status)
      ? obj.status
      : "applied";

  let interviewDate: Date | null = null;
  if (typeof obj.interviewDate === "string" && obj.interviewDate.trim()) {
    const d = new Date(obj.interviewDate);
    if (!isNaN(d.getTime())) interviewDate = d;
  }

  const notes = typeof obj.notes === "string" ? obj.notes.slice(0, 5000) : "";

  const application = await prisma.jobApplication.create({
    data: {
      userId,
      company: obj.company.trim().slice(0, 200),
      role: obj.role.trim().slice(0, 200),
      interviewDate,
      status,
      notes,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
