"use client";

import { View } from "@/app/page";
import { frameworks, scenarios, principles, learningPath as lpData } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import { useJobApplications } from "@/lib/useJobApplications";
import {
  BookOpen,
  Mic,
  Lightbulb,
  Brain,
  ChevronRight,
  Star,
  Target,
  Zap,
  MessageSquare,
  Map,
  Building2,
  BookMarked,
  Flame,
  LogIn,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DashboardProps {
  setActiveView: (v: View) => void;
}

const featuredFrameworks = frameworks.slice(0, 3);

const coachInsights = [
  {
    coach: "The Structured Thinker",
    role: "Executive Communication Research",
    insight:
      "Most communication anxiety comes from focusing on yourself instead of your audience. Shift the focus and watch the anxiety dissolve.",
    avatar: "ST",
    color: "#6366f1",
  },
  {
    coach: "The Candid Leader",
    role: "Leadership & Feedback Research",
    insight:
      "Feedback is a gift. Withholding it to spare feelings is selfish. Care personally AND challenge directly.",
    avatar: "CL",
    color: "#10b981",
  },
  {
    coach: "The Executive Coach",
    role: "Coaching Psychology",
    insight:
      "The advice-giving impulse is the enemy of great coaching. Ask 'And what else?' before you offer any answer.",
    avatar: "EC",
    color: "#f59e0b",
  },
];

// Circular gauge SVG helper
function GaugeRing({
  pct,
  color,
  size = 64,
  stroke = 5,
  label,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);
  const c = size / 2;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} stroke="#1e2d4a" strokeWidth={stroke} fill="none" />
        <circle
          cx={c}
          cy={c}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white">{pct}%</span>
        {label && <span className="text-xs" style={{ color: "#4a5980", fontSize: 8 }}>{label}</span>}
      </div>
    </div>
  );
}

export default function Dashboard({ setActiveView }: DashboardProps) {
  const { progress, stories, learningPath, loading, isAuthenticated, faangReadinessScore } =
    useProgress();
  const { nextInterview, daysUntilNext } = useJobApplications();

  // ── Derived counts ──────────────────────────────────────────────────────────
  const totalFrameworks = frameworks.length;
  const totalScenarios = scenarios.length;
  const totalPrinciples = principles.length;
  const totalQuizQ = 8;

  const frameworksDone = progress?.frameworksViewed.length ?? 0;
  const scenariosDone = progress?.scenariosCompleted.length ?? 0;
  const principlesDone = progress?.principlesViewed.length ?? 0;
  const quizBest = progress?.quizHighScore ?? 0;
  const streakDays = progress?.streakDays ?? 0;
  const storyCount = stories.length;
  const currentWeek = learningPath?.currentWeek ?? 1;
  const weeksCompleted = learningPath?.completedWeeks.length ?? 0;

  // ── Dynamic CTA logic ───────────────────────────────────────────────────────
  type CtaConfig = { label: string; sub: string; view: View; color: string };
  function getSmartCta(): CtaConfig {
    if (!isAuthenticated) {
      return { label: "Sign in to track progress", sub: "Google OAuth — free", view: "practice", color: "#818cf8" };
    }
    if (storyCount === 0) {
      return { label: "Build your Story Bank", sub: "Add your first STAR story", view: "story-bank", color: "#10b981" };
    }
    if (currentWeek < 4) {
      return { label: "Continue Foundations", sub: `Week ${currentWeek} of 12 in progress`, view: "learning-path", color: "#6366f1" };
    }
    if (currentWeek >= 9) {
      return { label: "Begin FAANG Prep", sub: "You're ready for interview drills", view: "exec-interview", color: "#f59e0b" };
    }
    if (faangReadinessScore < 40) {
      return { label: "Practice Scenarios", sub: `${scenariosDone} done — keep going`, view: "practice", color: "#0ea5e9" };
    }
    return { label: "Open Interview Prep Hub", sub: `FAANG Readiness: ${faangReadinessScore}%`, view: "exec-interview", color: "#a855f7" };
  }

  const smartCta = getSmartCta();

  // ── Quick cards (dynamic counts when signed in) ─────────────────────────────
  const quickCards = [
    {
      icon: <BookOpen size={20} />,
      title: isAuthenticated ? `${frameworksDone}/${totalFrameworks} Frameworks` : `${totalFrameworks} Frameworks`,
      sub: "PREP, SCR, STAR & more",
      view: "frameworks" as View,
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      icon: <Mic size={20} />,
      title: isAuthenticated ? `${scenariosDone}/${totalScenarios} Scenarios` : `${totalScenarios} Scenarios`,
      sub: "Practice real situations",
      view: "practice" as View,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    },
    {
      icon: <Lightbulb size={20} />,
      title: isAuthenticated ? `${principlesDone}/${totalPrinciples} Principles` : `${totalPrinciples} Principles`,
      sub: "From top coaches",
      view: "principles" as View,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      icon: <Brain size={20} />,
      title: isAuthenticated ? `${quizBest}/${totalQuizQ} Quiz Best` : "Knowledge Quiz",
      sub: isAuthenticated ? `${Math.round((quizBest / totalQuizQ) * 100)}% best score` : "Test your understanding",
      view: "quiz" as View,
      gradient: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
    },
    {
      icon: <Map size={20} />,
      title: isAuthenticated ? `Week ${currentWeek}/12` : "12-Week Path",
      sub: isAuthenticated ? `${weeksCompleted} week${weeksCompleted !== 1 ? "s" : ""} complete` : "Structured executive track",
      view: "learning-path" as View,
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    },
    {
      icon: <Building2 size={20} />,
      title: "FAANG Prep Hub",
      sub: "Google, Amazon, Meta & more",
      view: "exec-interview" as View,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Your Communication Coach
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Sharpen Your Executive Voice.</h1>
            <p className="text-base" style={{ color: "#6b7fa3" }}>
              Frameworks, practice scenarios, and executive presence —
              engineered for FAANG Director and VP interviews.
            </p>
          </div>
          {isAuthenticated && streakDays > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl flex-shrink-0"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <Flame size={14} style={{ color: "#f59e0b" }} />
              <span className="text-sm font-bold" style={{ color: "#fbbf24" }}>
                {streakDays} day streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Executive Path Status Bar (authenticated only) ───────────────────── */}
      {isAuthenticated && !loading && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} style={{ color: "#818cf8" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
              Executive Track Status
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* FAANG Readiness Gauge */}
            <div className="flex items-center gap-4">
              <GaugeRing pct={faangReadinessScore} color="#818cf8" size={64} />
              <div>
                <div className="text-sm font-semibold text-white">FAANG Ready</div>
                <div className="text-xs" style={{ color: "#4a5980" }}>Overall score</div>
              </div>
            </div>

            {/* Learning Path */}
            <div className="flex items-center gap-4">
              <GaugeRing
                pct={Math.round((weeksCompleted / 12) * 100)}
                color="#10b981"
                size={64}
              />
              <div>
                <div className="text-sm font-semibold text-white">Week {currentWeek}/12</div>
                <div className="text-xs" style={{ color: "#4a5980" }}>{weeksCompleted} complete</div>
              </div>
            </div>

            {/* Story Bank */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 64, height: 64, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#fbbf24" }}>{storyCount}</div>
                  <div className="text-xs" style={{ color: "#4a5980" }}>stories</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Story Bank</div>
                <div className="text-xs" style={{ color: storyCount >= 5 ? "#34d399" : "#4a5980" }}>
                  {storyCount >= 5 ? "Interview ready ✓" : `${5 - storyCount} more needed`}
                </div>
              </div>
            </div>

            {/* Scenario Coverage */}
            <div className="flex items-center gap-4">
              <GaugeRing
                pct={Math.round((scenariosDone / totalScenarios) * 100)}
                color="#0ea5e9"
                size={64}
              />
              <div>
                <div className="text-sm font-semibold text-white">Scenarios</div>
                <div className="text-xs" style={{ color: "#4a5980" }}>
                  {scenariosDone}/{totalScenarios} practiced
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: "#4a5980" }}>Overall FAANG Readiness</span>
              <span className="text-xs font-semibold" style={{ color: "#818cf8" }}>{faangReadinessScore}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{
                  width: `${faangReadinessScore}%`,
                  background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Job Interview Countdown Banner ──────────────────────────────────── */}
      {isAuthenticated && nextInterview && daysUntilNext !== null && daysUntilNext <= 14 && (
        <div
          className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 48, height: 48, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.25)" }}
          >
            <Clock size={22} style={{ color: "#fbbf24" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">
              {nextInterview.company} Interview in{" "}
              <span style={{ color: "#fbbf24" }}>
                {daysUntilNext === 0 ? "Today!" : `${daysUntilNext} day${daysUntilNext !== 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="text-xs" style={{ color: "#6b7fa3" }}>
              {nextInterview.role} · {new Date(nextInterview.interviewDate!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveView("prep-packs")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
            >
              View Prep Pack →
            </button>
            <button
              onClick={() => setActiveView("mock-interview")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              Start Mock Interview →
            </button>
          </div>
        </div>
      )}

      {/* ── Stats row (always visible) ──────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 p-4 rounded-2xl"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
      >
        {[
          {
            icon: <BookOpen size={16} />,
            label: "Frameworks",
            value: isAuthenticated && !loading ? `${frameworksDone}/${totalFrameworks}` : `${totalFrameworks}`,
            color: "#818cf8",
          },
          {
            icon: <Mic size={16} />,
            label: "Scenarios",
            value: isAuthenticated && !loading ? `${scenariosDone}/${totalScenarios}` : `${totalScenarios}`,
            color: "#38bdf8",
          },
          {
            icon: <Lightbulb size={16} />,
            label: "Principles",
            value: isAuthenticated && !loading ? `${principlesDone}/${totalPrinciples}` : `${totalPrinciples}`,
            color: "#fbbf24",
          },
          {
            icon: <Brain size={16} />,
            label: "Quiz Best",
            value: isAuthenticated && !loading ? `${Math.round((quizBest / totalQuizQ) * 100)}%` : `${totalQuizQ} Qs`,
            color: "#34d399",
          },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, background: `${s.color}1a`, color: s.color }}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-white">{loading && isAuthenticated ? "…" : s.value}</div>
              <div className="text-xs" style={{ color: "#4a5980" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick access cards (6-card 2×3 grid) ───────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        {quickCards.map((card) => (
          <button
            key={card.view}
            onClick={() => setActiveView(card.view)}
            className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(99,102,241,0.04)" }}
            />
            <div className="flex items-start justify-between">
              <div
                className="flex items-center justify-center rounded-xl mb-3"
                style={{ width: 44, height: 44, background: card.gradient }}
              >
                <span className="text-white">{card.icon}</span>
              </div>
              <ChevronRight
                size={16}
                style={{ color: "#2a3560" }}
                className="group-hover:text-indigo-400 transition-colors mt-1"
              />
            </div>
            <div className="text-base font-semibold text-white mb-0.5">{card.title}</div>
            <div className="text-sm" style={{ color: "#6b7fa3" }}>{card.sub}</div>
          </button>
        ))}
      </div>

      {/* ── Two-column: featured frameworks + coach insights ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Featured Frameworks */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <Target size={14} style={{ color: "#818cf8" }} />
              Core Frameworks
            </div>
            <button
              onClick={() => setActiveView("frameworks")}
              className="text-xs flex items-center gap-1 transition-colors hover:text-indigo-300"
              style={{ color: "#818cf8" }}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {featuredFrameworks.map((fw) => {
              const isViewed = progress?.frameworksViewed.includes(fw.id);
              return (
                <button
                  key={fw.id}
                  onClick={() => setActiveView("frameworks")}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{ background: "#111827", border: "1px solid #1e2d4a" }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: isViewed ? "rgba(52,211,153,0.15)" : "rgba(99,102,241,0.15)",
                      color: isViewed ? "#34d399" : "#818cf8",
                      fontFamily: "monospace",
                    }}
                  >
                    {isViewed ? <CheckCircle2 size={16} /> : fw.acronym.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{fw.name}</div>
                    <div className="text-xs truncate" style={{ color: "#4a5980" }}>
                      {fw.source}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: "#2a3560" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Coach Insights */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
        >
          <div className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <Star size={14} style={{ color: "#fbbf24" }} />
            Coach Insights
          </div>
          <div className="flex flex-col gap-3">
            {coachInsights.map((c) => (
              <div
                key={c.coach}
                className="p-3 rounded-xl"
                style={{ background: "#111827", border: "1px solid #1e2d4a" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                    style={{ width: 28, height: 28, background: c.color, fontSize: 9 }}
                  >
                    {c.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{c.coach}</div>
                    <div className="text-xs" style={{ color: "#4a5980", fontSize: 9 }}>
                      {c.role}
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: "#8892a4" }}>
                  &ldquo;{c.insight}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Smart CTA ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.25)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            <MessageSquare size={22} color="white" />
          </div>
          <div>
            <div className="text-base font-bold text-white">{smartCta.label}</div>
            <div className="text-sm" style={{ color: "#6b7fa3" }}>{smartCta.sub}</div>
          </div>
        </div>
        <button
          onClick={() => setActiveView(smartCta.view)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${smartCta.color} 0%, #8b5cf6 100%)` }}
        >
          {isAuthenticated ? "Continue" : "Get Started"}
        </button>
      </div>

      {/* ── Sign-in nudge (unauthenticated) ────────────────────────────────── */}
      {!isAuthenticated && !loading && (
        <div
          className="mt-4 rounded-xl p-4 flex items-center gap-4"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
        >
          <LogIn size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "#6b7fa3" }}>
            <span className="text-white font-medium">Sign in with Google</span> to track your progress,
            save stories, and unlock the Executive Learning Path.
          </p>
          <BookMarked size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
        </div>
      )}
    </div>
  );
}
