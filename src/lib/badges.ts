import { quizzes } from "@/lib/data";
import type { ProgressData, StoryData } from "@/lib/useProgress";

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: "practice" | "stories" | "mock-interview" | "streaks" | "quiz" | "learning-path";
}

export interface EarnedBadge extends BadgeDefinition {
  earned: boolean;
}

export interface ComputeBadgesInput {
  progress: ProgressData | null;
  stories: StoryData[];
  mockCompletedCount: number;
  weeksCompleted: number;
}

export function computeBadges({
  progress,
  stories,
  mockCompletedCount,
  weeksCompleted,
}: ComputeBadgesInput): EarnedBadge[] {
  const totalQuiz = quizzes.length;
  const scenariosDone = progress?.scenariosCompleted.length ?? 0;
  const frameworksDone = progress?.frameworksViewed.length ?? 0;
  const quizBest = progress?.quizHighScore ?? 0;
  const streak = progress?.streakDays ?? 0;
  const storyCount = stories.length;

  // Total scenarios available (used for "completionist" badge)
  // We import lazily to avoid circular dep issues — use a reasonable constant
  const TOTAL_SCENARIOS = 24;

  const badges: EarnedBadge[] = [
    {
      id: "first-pitch",
      title: "First Pitch",
      description: "Completed your first practice scenario",
      icon: "🎤",
      color: "#818cf8",
      category: "practice",
      earned: scenariosDone >= 1,
    },
    {
      id: "scenario-5",
      title: "Practice Veteran",
      description: "Completed 5 practice scenarios",
      icon: "🎯",
      color: "#a78bfa",
      category: "practice",
      earned: scenariosDone >= 5,
    },
    {
      id: "scenario-10",
      title: "Scenario Expert",
      description: "Completed 10 or more practice scenarios",
      icon: "🏅",
      color: "#6366f1",
      category: "practice",
      earned: scenariosDone >= 10,
    },
    {
      id: "scenario-all",
      title: "Completionist",
      description: `Completed all ${TOTAL_SCENARIOS} practice scenarios`,
      icon: "🌟",
      color: "#fbbf24",
      category: "practice",
      earned: scenariosDone >= TOTAL_SCENARIOS,
    },
    {
      id: "framework-explorer",
      title: "Framework Explorer",
      description: "Explored communication frameworks",
      icon: "📚",
      color: "#a78bfa",
      category: "practice",
      earned: frameworksDone >= 3,
    },
    {
      id: "storyteller",
      title: "Storyteller",
      description: "Added your first STAR story to the bank",
      icon: "✨",
      color: "#fbbf24",
      category: "stories",
      earned: storyCount >= 1,
    },
    {
      id: "story-bank-5",
      title: "Interview Ready",
      description: "Built a Story Bank of 5+ STAR stories",
      icon: "💼",
      color: "#ec4899",
      category: "stories",
      earned: storyCount >= 5,
    },
    {
      id: "story-bank-10",
      title: "Story Master",
      description: "Amassed 10+ STAR stories in your bank",
      icon: "📖",
      color: "#f97316",
      category: "stories",
      earned: storyCount >= 10,
    },
    {
      id: "first-mock",
      title: "First Mock",
      description: "Completed your first AI mock interview",
      icon: "🤖",
      color: "#38bdf8",
      category: "mock-interview",
      earned: mockCompletedCount >= 1,
    },
    {
      id: "mock-5",
      title: "Interviewer Tested",
      description: "Completed 5 AI mock interviews",
      icon: "🎙️",
      color: "#0ea5e9",
      category: "mock-interview",
      earned: mockCompletedCount >= 5,
    },
    {
      id: "streak-3",
      title: "3-Day Streak",
      description: "Practiced 3 days in a row",
      icon: "🔥",
      color: "#f59e0b",
      category: "streaks",
      earned: streak >= 3,
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Practiced 7 days in a row",
      icon: "⚡",
      color: "#ef4444",
      category: "streaks",
      earned: streak >= 7,
    },
    {
      id: "quiz-contender",
      title: "Quiz Contender",
      description: "Scored 75%+ on the knowledge check",
      icon: "🧠",
      color: "#38bdf8",
      category: "quiz",
      earned: quizBest / totalQuiz >= 0.75,
    },
    {
      id: "perfect-quiz",
      title: "Perfect Score",
      description: "Scored 100% on the knowledge check",
      icon: "🏆",
      color: "#f97316",
      category: "quiz",
      earned: quizBest >= totalQuiz,
    },
    {
      id: "executive-track",
      title: "Executive Track",
      description: "Completed Week 1 of the learning path",
      icon: "🗓️",
      color: "#34d399",
      category: "learning-path",
      earned: weeksCompleted >= 1,
    },
    {
      id: "halfway-path",
      title: "Halfway There",
      description: "Completed 6 weeks of the learning path",
      icon: "🗺️",
      color: "#10b981",
      category: "learning-path",
      earned: weeksCompleted >= 6,
    },
  ];

  return badges;
}
