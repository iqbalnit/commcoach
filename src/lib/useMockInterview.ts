"use client";

import { useState, useCallback } from "react";

export interface MockInterviewMessage {
  role: "interviewer" | "user" | "feedback";
  content: string;
  timestamp: string;
  questionIndex?: number;
  feedbackData?: {
    strengths: string[];
    improvements: string[];
    score: number;
  };
}

export interface MockInterviewSummary {
  id: string;
  company: string;
  roleLevel: string;
  status: string;
  totalTurns: number;
  overallScore: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface MockInterviewFull extends MockInterviewSummary {
  messages: MockInterviewMessage[];
  finalSummary: string | null;
}

export function useMockInterview() {
  const [pastInterviews, setPastInterviews] = useState<MockInterviewSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPastInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mock-interview");
      if (res.ok) {
        setPastInterviews(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createInterview = useCallback(
    async (company: string, roleLevel: string): Promise<MockInterviewFull | null> => {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, roleLevel }),
      });
      if (res.ok) {
        return res.json();
      }
      return null;
    },
    []
  );

  const completeInterview = useCallback(async (id: string): Promise<void> => {
    await fetch(`/api/mock-interview/${id}/complete`, { method: "POST" });
  }, []);

  return {
    pastInterviews,
    loading,
    fetchPastInterviews,
    createInterview,
    completeInterview,
  };
}
