"use client";

import { useState, useEffect, useCallback } from "react";
import type { CompanyKey } from "./data";

// ─── Types (user-generated data, not static content) ──────────────────────────
export interface StoryData {
  id: string;
  userId: string;
  title: string;
  category: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  companiesRelevant: CompanyKey[];
  questionTypes: string[];
  tags: string[];
  strengthScore: number;
  lastPracticed: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressData {
  id: string;
  userId: string;
  scenariosCompleted: string[];
  frameworksViewed: string[];
  principlesViewed: string[];
  quizHighScore: number;
  practiceSessionCount: number;
  totalPracticeMinutes: number;
  streakDays: number;
  lastPracticeDate: string | null;
  updatedAt: string;
}

export interface LearningPathData {
  id: string;
  userId: string;
  currentWeek: number;
  completedWeeks: number[];
  weekProgressData: Record<string, unknown>;
  startedAt: string;
  targetInterviewDate: string | null;
  updatedAt: string;
}

// ─── FAANG Readiness Score ────────────────────────────────────────────────────
export function computeFaangReadiness(
  progress: ProgressData | null,
  stories: StoryData[],
  learningPath: LearningPathData | null
): number {
  if (!progress) return 0;
  const scenarioScore = Math.min(progress.scenariosCompleted.length / 15, 1) * 30;
  const frameworkScore = Math.min(progress.frameworksViewed.length / 14, 1) * 20;
  const storyBankScore = Math.min(stories.length / 5, 1) * 25;
  const quizScore = (progress.quizHighScore / 8) * 15;
  const lpScore = learningPath
    ? Math.min(learningPath.completedWeeks.length / 12, 1) * 10
    : 0;
  return Math.round(scenarioScore + frameworkScore + storyBankScore + quizScore + lpScore);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [stories, setStories] = useState<StoryData[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, sRes, lpRes] = await Promise.all([
        fetch("/api/progress"),
        fetch("/api/stories"),
        fetch("/api/learning-path"),
      ]);

      if (pRes.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      const [p, s, lp] = await Promise.all([
        pRes.json(),
        sRes.json(),
        lpRes.json(),
      ]);

      setProgress(p);
      setStories(Array.isArray(s) ? s : []);
      setLearningPath(lp);
    } catch {
      // Network error — keep unauthenticated state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const markScenarioCompleted = useCallback(
    async (scenarioId: string, minutes: number) => {
      if (!isAuthenticated) return;
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeScenario", payload: { scenarioId, minutes } }),
      });
      if (res.ok) setProgress(await res.json());
    },
    [isAuthenticated]
  );

  const markFrameworkViewed = useCallback(
    async (frameworkId: string) => {
      if (!isAuthenticated) return;
      if (progress?.frameworksViewed.includes(frameworkId)) return;
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "viewFramework", payload: { frameworkId } }),
      });
      if (res.ok) setProgress(await res.json());
    },
    [isAuthenticated, progress]
  );

  const markPrincipleViewed = useCallback(
    async (principleId: string) => {
      if (!isAuthenticated) return;
      if (progress?.principlesViewed.includes(principleId)) return;
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "viewPrinciple", payload: { principleId } }),
      });
      if (res.ok) setProgress(await res.json());
    },
    [isAuthenticated, progress]
  );

  const updateQuizScore = useCallback(
    async (score: number) => {
      if (!isAuthenticated) return;
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateQuizScore", payload: { score } }),
      });
      if (res.ok) setProgress(await res.json());
    },
    [isAuthenticated]
  );

  const updateLearningPath = useCallback(
    async (patch: Partial<{ currentWeek: number; completedWeeks: number[]; weekProgressData: Record<string, unknown>; targetInterviewDate: string | null }>) => {
      if (!isAuthenticated) return;
      const res = await fetch("/api/learning-path", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) setLearningPath(await res.json());
    },
    [isAuthenticated]
  );

  const addStory = useCallback(
    async (storyData: Omit<StoryData, "id" | "userId" | "strengthScore" | "createdAt" | "updatedAt">) => {
      if (!isAuthenticated) return null;
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });
      if (res.ok) {
        const story = await res.json();
        setStories((prev) => [story, ...prev]);
        return story as StoryData;
      }
      return null;
    },
    [isAuthenticated]
  );

  const updateStory = useCallback(
    async (id: string, patch: Partial<StoryData>) => {
      if (!isAuthenticated) return null;
      const res = await fetch(`/api/stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        setStories((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return updated as StoryData;
      }
      return null;
    },
    [isAuthenticated]
  );

  const deleteStory = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== id));
      }
    },
    [isAuthenticated]
  );

  const faangReadinessScore = computeFaangReadiness(progress, stories, learningPath);

  return {
    progress,
    stories,
    learningPath,
    loading,
    isAuthenticated,
    faangReadinessScore,
    markScenarioCompleted,
    markFrameworkViewed,
    markPrincipleViewed,
    updateQuizScore,
    updateLearningPath,
    addStory,
    updateStory,
    deleteStory,
    refresh: fetchAll,
  };
}
