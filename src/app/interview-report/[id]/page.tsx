import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InterviewReportView from "@/components/InterviewReportView";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;
  const interview = await prisma.mockInterview.findUnique({ where: { id } });

  if (!interview || interview.userId !== session.user.id) {
    redirect("/");
  }

  return (
    <InterviewReportView
      interview={{
        ...interview,
        messages: JSON.parse(interview.messages),
      }}
    />
  );
}
