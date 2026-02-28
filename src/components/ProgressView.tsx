"use client";

import { useState } from "react";
import {
  TrendingUp,
  BookOpen,
  Mic,
  Brain,
  Trophy,
  Target,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
  Award,
  BarChart2,
  LogIn,
  Map,
  BookMarked,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { frameworks, scenarios, principles, quizzes, companyProfiles } from "@/lib/data";
import { useProgress, computeFaangReadiness } from "@/lib/useProgress";
import type { View } from "@/app/page";

interface ProgressViewProps {
  setActiveView?: (v: View) => void;
}

// ── Badge definitions ─────────────────────────────────────────────────────────
function buildBadges(
  scenariosDone: number,
  frameworksDone: number,
  quizBest: number,
  streak: number,
  storyCount: number,
  weeksCompleted: number
) {
  const totalQuiz = quizzes.length;
  return [
    {
      id: "first-pitch",
      title: "First Pitch",
      description: "Completed your first practice scenario",
      icon: "🎤",
      earned: scenariosDone >= 1,
      color: "#818cf8",
    },
    {
      id: "framework-explorer",
      title: "Framework Explorer",
      description: `Opened all ${frameworks.length} communication frameworks`,
      icon: "📚",
      earned: frameworksDone >= frameworks.length,
      color: "#a78bfa",
    },
    {
      id: "quiz-contender",
      title: "Quiz Contender",
      description: "Scored 75%+ on the knowledge check",
      icon: "🧠",
      earned: quizBest / totalQuiz >= 0.75,
      color: "#38bdf8",
    },
    {
      id: "storyteller",
      title: "Storyteller",
      description: "Added your first STAR story to the bank",
      icon: "✨",
      earned: storyCount >= 1,
      color: "#fbbf24",
    },
    {
      id: "streak-week",
      title: "7-Day Streak",
      description: "Practiced 7 days in a row",
      icon: "🔥",
      earned: streak >= 7,
      color: "#f59e0b",
    },
    {
      id: "executive-track",
      title: "Executive Track",
      description: "Completed Week 1 of the learning path",
      icon: "🗓️",
      earned: weeksCompleted >= 1,
      color: "#34d399",
    },
    {
      id: "story-bank-5",
      title: "Interview Ready",
      description: "Built a Story Bank of 5+ STAR stories",
      icon: "💼",
      earned: storyCount >= 5,
      color: "#ec4899",
    },
    {
      id: "perfect-quiz",
      title: "Perfect Score",
      description: "Scored 100% on the knowledge check",
      icon: "🏆",
      earned: quizBest >= totalQuiz,
      color: "#f97316",
    },
    {
      id: "halfway-path",
      title: "Halfway There",
      description: "Completed 6 weeks of the learning path",
      icon: "🗺️",
      earned: weeksCompleted >= 6,
      color: "#10b981",
    },
    {
      id: "scenario-10",
      title: "Scenario Veteran",
      description: "Completed 10 or more practice scenarios",
      icon: "🎯",
      earned: scenariosDone >= 10,
      color: "#6366f1",
    },
  ];
}

// ── Skill area computation ────────────────────────────────────────────────────
function computeSkillAreas(
  completedIds: string[],
  viewedFrameworkIds: string[],
  quizBest: number
) {
  const totalQuiz = quizzes.length;

  // Map scenario categories to skill areas
  const categoryMap: Record<string, string[]> = {
    "Spontaneous Speaking": ["Impromptu", "Q&A", "spontaneous"],
    "Storytelling": ["Storytelling", "STAR", "narrative"],
    "Executive Presence": ["Executive", "Leadership", "presence"],
    "Listening & Inquiry": ["Listening", "Coaching", "inquiry"],
    "Difficult Conversations": ["Feedback", "Conflict", "Difficult"],
    "Clarity & Conciseness": ["Clarity", "Structure", "Concise"],
  };

  const skillColors: Record<string, string> = {
    "Spontaneous Speaking": "#818cf8",
    "Storytelling": "#fbbf24",
    "Executive Presence": "#a78bfa",
    "Listening & Inquiry": "#38bdf8",
    "Difficult Conversations": "#f87171",
    "Clarity & Conciseness": "#34d399",
  };

  return Object.entries(categoryMap).map(([skillName, keywords]) => {
    // Count scenarios in this skill area that are completed
    const relevant = scenarios.filter((s) =>
      keywords.some(
        (k) =>
          s.category.toLowerCase().includes(k.toLowerCase()) ||
          s.title.toLowerCase().includes(k.toLowerCase())
      )
    );
    const total = Math.max(relevant.length, 1);
    const done = relevant.filter((s) => completedIds.includes(s.id)).length;

    // Framework contribution (proportional to quiz score)
    const frameworkBonus = (viewedFrameworkIds.length / frameworks.length) * 20;
    const quizBonus = (quizBest / totalQuiz) * 10;

    const base = (done / total) * 70;
    const pct = Math.min(Math.round(base + frameworkBonus + quizBonus), 100);

    return { label: skillName, pct, color: skillColors[skillName] };
  });
}

// ── FAANG readiness per company ───────────────────────────────────────────────
function computeCompanyReadiness(
  completedIds: string[],
  storyCount: number,
  weeksCompleted: number,
  quizBest: number
) {
  const totalQuiz = quizzes.length;
  return companyProfiles.map((co) => {
    // Company-specific scenarios completed
    const companyScenarios = scenarios.filter(
      (s) => s.isExecutive && s.companies?.includes(co.id)
    );
    const done = companyScenarios.filter((s) => completedIds.includes(s.id)).length;
    const scenarioScore = companyScenarios.length > 0 ? (done / companyScenarios.length) * 40 : 20;
    const storyScore = Math.min(storyCount / 5, 1) * 30;
    const pathScore = Math.min(weeksCompleted / 12, 1) * 20;
    const quizScore = (quizBest / totalQuiz) * 10;
    return {
      id: co.id,
      name: co.name,
      initial: co.initial,
      color: co.color,
      score: Math.round(scenarioScore + storyScore + pathScore + quizScore),
    };
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
      <div
        className="flex items-center justify-center rounded-xl mb-3"
        style={{ width: 36, height: 36, background: `${color}18`, color, border: `1px solid ${color}28` }}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs font-medium" style={{ color: "#6b7fa3" }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "#4a5980" }}>{sub}</div>}
    </div>
  );
}

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium" style={{ color: "#c8d0e0" }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: ReturnType<typeof buildBadges>[0] }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col items-center text-center transition-all duration-200"
      style={{
        background: badge.earned ? "#0d1426" : "#080d1a",
        border: badge.earned ? `1px solid ${badge.color}30` : "1px solid #12192e",
        opacity: badge.earned ? 1 : 0.45,
      }}
    >
      <div
        className="text-2xl mb-2 flex items-center justify-center rounded-xl"
        style={{ width: 48, height: 48, background: badge.earned ? `${badge.color}15` : "#1e2d4a", fontSize: 22 }}
      >
        {badge.icon}
      </div>
      <div className="text-xs font-semibold mb-0.5 leading-tight" style={{ color: badge.earned ? "#e8eaf0" : "#4a5980" }}>
        {badge.title}
      </div>
      <div className="text-xs leading-tight" style={{ color: "#4a5980" }}>{badge.description}</div>
      {!badge.earned && (
        <div className="mt-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "#1e2d4a", color: "#4a5980" }}>
          Locked
        </div>
      )}
    </div>
  );
}

function GaugeRing({ pct, color, size = 80, stroke = 7 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);
  const c = size / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} stroke="#1e2d4a" strokeWidth={stroke} fill="none" />
        <circle
          cx={c} cy={c} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{pct}%</span>
      </div>
    </div>
  );
}

function OverallProgress({
  frameworksDone, scenariosDone, principlesDone, quizBest,
}: {
  frameworksDone: number; scenariosDone: number; principlesDone: number; quizBest: number;
}) {
  const sections = [
    { label: "Frameworks", done: frameworksDone, total: frameworks.length, color: "#818cf8", icon: <BookOpen size={12} /> },
    { label: "Scenarios", done: scenariosDone, total: scenarios.length, color: "#34d399", icon: <Mic size={12} /> },
    { label: "Principles", done: principlesDone, total: principles.length, color: "#a78bfa", icon: <Brain size={12} /> },
    { label: "Quiz Questions", done: quizBest, total: quizzes.length, color: "#fbbf24", icon: <Star size={12} /> },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {sections.map((s) => {
        const pct = Math.round((s.done / s.total) * 100);
        const r = 28;
        const circ = 2 * Math.PI * r;
        const dash = circ * (1 - pct / 100);
        return (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="relative flex-shrink-0">
              <svg width={68} height={68} className="-rotate-90">
                <circle cx={34} cy={34} r={r} stroke="#1e2d4a" strokeWidth={5} fill="none" />
                <circle cx={34} cy={34} r={r} stroke={s.color} strokeWidth={5} fill="none"
                  strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-white">{pct}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>
                {s.icon}
                <span className="text-xs font-semibold">{s.label}</span>
              </div>
              <div className="text-xs" style={{ color: "#6b7fa3" }}>{s.done} of {s.total} completed</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Auth gate ─────────────────────────────────────────────────────────────────
function AuthGate() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="flex items-center justify-center rounded-2xl mb-5"
        style={{ width: 64, height: 64, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <LogIn size={28} style={{ color: "#818cf8" }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Sign in to view your progress</h3>
      <p className="text-sm max-w-xs" style={{ color: "#6b7fa3" }}>
        Your learning journey, badge collection, FAANG readiness score, and practice history are
        all stored securely. Sign in with Google to get started.
      </p>
    </div>
  );
}

// ── FAANG Readiness Tab ───────────────────────────────────────────────────────
function FaangTab({
  faangReadinessScore,
  companyReadiness,
  scenariosDone,
  storyCount,
  weeksCompleted,
  frameworksDone,
  quizBest,
  setActiveView,
}: {
  faangReadinessScore: number;
  companyReadiness: ReturnType<typeof computeCompanyReadiness>;
  scenariosDone: number;
  storyCount: number;
  weeksCompleted: number;
  frameworksDone: number;
  quizBest: number;
  setActiveView?: (v: View) => void;
}) {
  const totalQuiz = quizzes.length;

  // Skill gap recommendations
  const gaps: { label: string; done: boolean; cta: string; view: View; icon: React.ReactNode }[] = [
    {
      label: `Practice 15 exec scenarios (${scenariosDone}/15)`,
      done: scenariosDone >= 15,
      cta: "Practice Now",
      view: "practice",
      icon: <Mic size={13} />,
    },
    {
      label: `Build 5+ STAR stories (${storyCount}/5)`,
      done: storyCount >= 5,
      cta: "Story Bank",
      view: "story-bank",
      icon: <BookMarked size={13} />,
    },
    {
      label: `Complete 12-week path (${weeksCompleted}/12 weeks)`,
      done: weeksCompleted >= 12,
      cta: "Learning Path",
      view: "learning-path",
      icon: <Map size={13} />,
    },
    {
      label: `View all ${frameworks.length} frameworks (${frameworksDone}/${frameworks.length})`,
      done: frameworksDone >= frameworks.length,
      cta: "Frameworks",
      view: "frameworks",
      icon: <BookOpen size={13} />,
    },
    {
      label: `Score 100% on quiz (${Math.round((quizBest / totalQuiz) * 100)}% best)`,
      done: quizBest >= totalQuiz,
      cta: "Take Quiz",
      view: "quiz",
      icon: <Brain size={13} />,
    },
  ];

  const getReadinessLabel = (score: number) => {
    if (score >= 80) return { label: "Interview Ready", color: "#34d399" };
    if (score >= 60) return { label: "Almost There", color: "#fbbf24" };
    if (score >= 40) return { label: "In Progress", color: "#818cf8" };
    return { label: "Getting Started", color: "#f87171" };
  };

  const overall = getReadinessLabel(faangReadinessScore);

  return (
    <div className="fade-in">
      {/* Overall gauge */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-8"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <GaugeRing pct={faangReadinessScore} color="#818cf8" size={100} stroke={8} />
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: overall.color }}
          >
            {overall.label}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            FAANG Readiness Score
          </h3>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>
            Composite of: Scenarios (30%) · Frameworks (20%) · Story Bank (25%) · Quiz (15%) · Learning Path (10%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Company breakdown */}
        <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={13} style={{ color: "#f59e0b" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f59e0b" }}>
              Company Readiness
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {companyReadiness.map((co) => (
              <div key={co.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ width: 22, height: 22, background: co.color, fontSize: 9 }}
                    >
                      {co.initial}
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#c8d0e0" }}>{co.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: co.color }}>{co.score}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${co.score}%`, background: co.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill gaps / recommendations */}
        <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={13} style={{ color: "#f87171" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f87171" }}>
              Skill Gaps &amp; Next Steps
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {gaps.map((gap, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#111827", border: "1px solid #1e2d4a" }}
              >
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    background: gap.done ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.12)",
                    color: gap.done ? "#34d399" : "#f87171",
                  }}
                >
                  {gap.done ? <CheckCircle2 size={13} /> : gap.icon}
                </div>
                <span className="flex-1 text-xs" style={{ color: gap.done ? "#4a5980" : "#c8d0e0", textDecoration: gap.done ? "line-through" : "none" }}>
                  {gap.label}
                </span>
                {!gap.done && setActiveView && (
                  <button
                    onClick={() => setActiveView(gap.view)}
                    className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
                  >
                    {gap.cta}
                    <ChevronRight size={10} className="inline ml-0.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function ProgressView({ setActiveView }: ProgressViewProps) {
  const [tab, setTab] = useState<"overview" | "skills" | "badges" | "faang">("overview");

  const { progress, stories, learningPath, loading, isAuthenticated, faangReadinessScore } =
    useProgress();

  // Derived values
  const frameworksDone = progress?.frameworksViewed.length ?? 0;
  const scenariosDone = progress?.scenariosCompleted.length ?? 0;
  const principlesDone = progress?.principlesViewed.length ?? 0;
  const quizBest = progress?.quizHighScore ?? 0;
  const streak = progress?.streakDays ?? 0;
  const totalSessions = progress?.practiceSessionCount ?? 0;
  const totalMinutes = progress?.totalPracticeMinutes ?? 0;
  const storyCount = stories.length;
  const weeksCompleted = learningPath?.completedWeeks.length ?? 0;
  const currentWeek = learningPath?.currentWeek ?? 1;

  const BADGES = buildBadges(scenariosDone, frameworksDone, quizBest, streak, storyCount, weeksCompleted);
  const earnedBadges = BADGES.filter((b) => b.earned).length;

  const skillAreas = computeSkillAreas(
    progress?.scenariosCompleted ?? [],
    progress?.frameworksViewed ?? [],
    quizBest
  );

  const companyReadiness = computeCompanyReadiness(
    progress?.scenariosCompleted ?? [],
    storyCount,
    weeksCompleted,
    quizBest
  );

  // Level label
  const level =
    faangReadinessScore >= 80
      ? "FAANG Ready"
      : faangReadinessScore >= 60
      ? "Advanced Communicator"
      : faangReadinessScore >= 30
      ? "Developing Leader"
      : "Emerging Communicator";

  // Lowest skill for focus area
  const lowestSkill = [...skillAreas].sort((a, b) => a.pct - b.pct)[0];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Your Progress
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {isAuthenticated ? "Your Coaching Journey" : "Progress Tracker"}
            </h1>
            {isAuthenticated && !loading && (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  {level}
                </span>
                <span className="text-xs" style={{ color: "#4a5980" }}>
                  Week {currentWeek} of Learning Path
                </span>
              </div>
            )}
          </div>
          {isAuthenticated && streak > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <Flame size={14} style={{ color: "#f59e0b" }} />
              <span className="text-sm font-bold" style={{ color: "#fbbf24" }}>
                {streak} day streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Not signed in ─────────────────────────────────────────────────── */}
      {!loading && !isAuthenticated ? (
        <AuthGate />
      ) : (
        <>
          {/* ── Top stats ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Target size={16} />}
              label="Practice Sessions"
              value={loading ? "…" : totalSessions}
              sub="all time"
              color="#818cf8"
            />
            <StatCard
              icon={<Clock size={16} />}
              label="Minutes Practiced"
              value={loading ? "…" : totalMinutes}
              sub={totalMinutes > 0 ? `~${Math.round(totalMinutes / 60 * 10) / 10}h total` : "just starting"}
              color="#38bdf8"
            />
            <StatCard
              icon={<Trophy size={16} />}
              label="Badges Earned"
              value={loading ? "…" : `${earnedBadges}/${BADGES.length}`}
              sub="keep going"
              color="#fbbf24"
            />
            <StatCard
              icon={<Zap size={16} />}
              label="Quiz Best Score"
              value={loading ? "…" : `${Math.round((quizBest / quizzes.length) * 100)}%`}
              sub={`${quizBest}/${quizzes.length} correct`}
              color="#34d399"
            />
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <div
            className="flex gap-1 mb-6 p-1 rounded-xl"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a", width: "fit-content" }}
          >
            {(["overview", "skills", "badges", "faang"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
                  color: tab === t ? "#a5b4fc" : "#4a5980",
                  border: tab === t ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                }}
              >
                {t === "faang" ? "FAANG Readiness" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ──────────────────────────────────────────────── */}
          {tab === "overview" && (
            <div className="fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 size={13} style={{ color: "#818cf8" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                        Content Coverage
                      </span>
                    </div>
                    <OverallProgress
                      frameworksDone={frameworksDone}
                      scenariosDone={scenariosDone}
                      principlesDone={principlesDone}
                      quizBest={quizBest}
                    />
                  </div>

                  {/* Learning Path progress */}
                  <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Map size={13} style={{ color: "#34d399" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                        Executive Learning Path
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-white">{weeksCompleted}</div>
                      <div>
                        <div className="text-sm font-medium text-white">Weeks Complete</div>
                        <div className="text-xs" style={{ color: "#4a5980" }}>of 12 total · Week {currentWeek} active</div>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#1e2d4a" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.round((weeksCompleted / 12) * 100)}%`,
                          background: "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: "#4a5980" }}>
                        {Math.round((weeksCompleted / 12) * 100)}% complete
                      </span>
                      {setActiveView && (
                        <button
                          onClick={() => setActiveView("learning-path")}
                          className="text-xs flex items-center gap-1"
                          style={{ color: "#34d399" }}
                        >
                          Open Path <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Recommended next */}
                  <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={13} style={{ color: "#34d399" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                        Recommended Next
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        storyCount === 0 && {
                          title: "Add your first STAR story",
                          reason: "Story Bank is empty — critical for interviews",
                          icon: <BookMarked size={13} />,
                          color: "#fbbf24",
                          tag: "Story Bank",
                          view: "story-bank" as View,
                        },
                        scenariosDone < 15 && {
                          title: `Practice exec scenarios (${scenariosDone}/15)`,
                          reason: "Executive scenarios build FAANG readiness",
                          icon: <Mic size={13} />,
                          color: "#818cf8",
                          tag: "Practice",
                          view: "practice" as View,
                        },
                        frameworksDone < frameworks.length && {
                          title: `Explore more frameworks (${frameworksDone}/${frameworks.length})`,
                          reason: "Framework fluency unlocks structured answers",
                          icon: <BookOpen size={13} />,
                          color: "#a78bfa",
                          tag: "Framework",
                          view: "frameworks" as View,
                        },
                        weeksCompleted < 12 && {
                          title: `Continue Week ${currentWeek} of Learning Path`,
                          reason: "Structured weekly goals accelerate growth",
                          icon: <Map size={13} />,
                          color: "#34d399",
                          tag: "Learning Path",
                          view: "learning-path" as View,
                        },
                      ]
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((item, i) => (
                          item && (
                            <button
                              key={i}
                              onClick={() => setActiveView && item.view && setActiveView(item.view)}
                              className="flex items-start gap-3 p-3 rounded-xl group cursor-pointer hover:scale-[1.01] transition-all text-left w-full"
                              style={{ background: "#111827", border: "1px solid #1e2d4a" }}
                            >
                              <div
                                className="flex items-center justify-center rounded-lg flex-shrink-0"
                                style={{ width: 32, height: 32, background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}
                              >
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">
                                  {item.title}
                                </div>
                                <div className="text-xs" style={{ color: "#4a5980" }}>{item.reason}</div>
                                <span
                                  className="mt-1.5 inline-block text-xs px-1.5 py-0.5 rounded"
                                  style={{ background: `${item.color}12`, color: item.color }}
                                >
                                  {item.tag}
                                </span>
                              </div>
                              <ChevronRight size={13} style={{ color: "#2a3560", flexShrink: 0 }} className="group-hover:text-indigo-400 transition-colors mt-1" />
                            </button>
                          )
                        ))}
                    </div>
                  </div>

                  {/* Coach insight */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Award size={13} style={{ color: "#818cf8" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                        Coach&rsquo;s Note
                      </span>
                    </div>
                    <p className="text-sm italic leading-relaxed mb-3" style={{ color: "#a5b4fc" }}>
                      &ldquo;Consistency beats intensity. Fifteen minutes of deliberate practice
                      daily will outperform a two-hour session once a week. You&rsquo;re building
                      a communication habit — keep showing up.&rdquo;
                    </p>
                    <p className="text-xs" style={{ color: "#4a5980" }}>— Matt Abrahams, Think Fast, Talk Smart</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Skills Tab ────────────────────────────────────────────────── */}
          {tab === "skills" && (
            <div className="fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp size={13} style={{ color: "#818cf8" }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                      Skill Breakdown
                    </span>
                  </div>
                  {skillAreas.map((s) => (
                    <SkillBar key={s.label} label={s.label} pct={s.pct} color={s.color} />
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={13} style={{ color: "#34d399" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                        How Scores Are Calculated
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        ["Scenarios practiced in this category", "#818cf8"],
                        ["Framework views across all content", "#34d399"],
                        ["Quiz accuracy on related questions", "#fbbf24"],
                        ["Principles reviewed in this area", "#a78bfa"],
                      ].map(([text, color], i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 6, height: 6, background: color }} />
                          <span className="text-xs" style={{ color: "#6b7fa3" }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {lowestSkill && (
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={13} style={{ color: "#fbbf24" }} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>
                          Focus Area
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{lowestSkill.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#6b7fa3" }}>
                        Your lowest skill area at {lowestSkill.pct}%. Practice more scenarios in this
                        category and review relevant frameworks to level up quickly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Badges Tab ────────────────────────────────────────────────── */}
          {tab === "badges" && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm" style={{ color: "#6b7fa3" }}>
                  {earnedBadges} of {BADGES.length} badges earned
                </p>
                <div className="h-1.5 rounded-full flex-1 mx-4" style={{ background: "#1e2d4a" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)",
                      width: `${(earnedBadges / BADGES.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>
                  {Math.round((earnedBadges / BADGES.length) * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {BADGES.map((b) => (
                  <BadgeCard key={b.id} badge={b} />
                ))}
              </div>
              <div
                className="mt-6 rounded-2xl p-5"
                style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award size={13} style={{ color: "#34d399" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                    Next Badge to Earn
                  </span>
                </div>
                {BADGES.filter((b) => !b.earned).slice(0, 1).map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div
                      className="text-2xl flex items-center justify-center rounded-xl"
                      style={{ width: 44, height: 44, background: "#1e2d4a" }}
                    >
                      {b.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{b.title}</div>
                      <div className="text-xs" style={{ color: "#6b7fa3" }}>{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAANG Tab ─────────────────────────────────────────────────── */}
          {tab === "faang" && (
            <FaangTab
              faangReadinessScore={faangReadinessScore}
              companyReadiness={companyReadiness}
              scenariosDone={scenariosDone}
              storyCount={storyCount}
              weeksCompleted={weeksCompleted}
              frameworksDone={frameworksDone}
              quizBest={quizBest}
              setActiveView={setActiveView}
            />
          )}
        </>
      )}
    </div>
  );
}
