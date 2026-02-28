"use client";

import { useState } from "react";
import { Map, Lock, CheckCircle, Circle, ChevronDown, ChevronUp, BookOpen, Play, Eye, Lightbulb, Calendar, Target, Trophy, LogIn } from "lucide-react";
import { learningPath, type LearningPathWeek, type LearningResource } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import type { View } from "@/app/page";

interface Props {
  setActiveView: (v: View) => void;
}

const PHASE_CONFIG = [
  { weeks: [1, 2], label: "Foundations", color: "#818cf8" },
  { weeks: [3, 4], label: "Identity", color: "#a78bfa" },
  { weeks: [5, 6], label: "Presence", color: "#ec4899" },
  { weeks: [7, 8], label: "Strategy", color: "#38bdf8" },
  { weeks: [9, 10], label: "FAANG Prep", color: "#fbbf24" },
  { weeks: [11, 12], label: "Polish", color: "#34d399" },
];

function getPhaseColor(week: number): string {
  const phase = PHASE_CONFIG.find((p) => p.weeks.includes(week));
  return phase?.color ?? "#818cf8";
}

function getPhaseLabel(week: number): string {
  const phase = PHASE_CONFIG.find((p) => p.weeks.includes(week));
  return phase?.label ?? "";
}

function resourceIcon(type: LearningResource["type"]) {
  if (type === "read") return <BookOpen size={12} />;
  if (type === "practice") return <Play size={12} />;
  if (type === "watch") return <Eye size={12} />;
  return <Lightbulb size={12} />;
}

function resourceColor(type: LearningResource["type"]): string {
  if (type === "read") return "#38bdf8";
  if (type === "practice") return "#34d399";
  if (type === "watch") return "#f59e0b";
  return "#a78bfa";
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

export default function LearningPathView({ setActiveView }: Props) {
  const { learningPath: lpData, loading, isAuthenticated, updateLearningPath, faangReadinessScore } = useProgress();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState<string>("");

  const completedWeeks: number[] = lpData?.completedWeeks ?? [];
  const currentWeek = lpData?.currentWeek ?? 1;

  const getWeekStatus = (week: number) => {
    if (completedWeeks.includes(week)) return "completed";
    if (week === currentWeek) return "in-progress";
    if (week === 1 || completedWeeks.includes(week - 1)) return "available";
    return "locked";
  };

  const handleMarkComplete = async (weekNum: number) => {
    const newCompleted = completedWeeks.includes(weekNum)
      ? completedWeeks
      : [...completedWeeks, weekNum];
    await updateLearningPath({ completedWeeks: newCompleted });
  };

  const handleSetTargetDate = async (date: string) => {
    setTargetDate(date);
    await updateLearningPath({ targetInterviewDate: date || null });
  };

  const interviewDate = lpData?.targetInterviewDate ?? targetDate;
  const daysLeft = interviewDate ? daysUntil(interviewDate) : null;

  const selectedWeekData = selectedWeek ? learningPath.find((w) => w.week === selectedWeek) : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Map size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Learning Path
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your 12-Week Executive Roadmap</h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          A structured path from communication foundations to FAANG interview readiness. Complete each week's work to unlock the next.
        </p>
      </div>

      {/* Sign-in nudge (read-only mode) */}
      {!isAuthenticated && !loading && (
        <div
          className="flex items-center gap-3 rounded-xl p-4 mb-6"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <LogIn size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
          <p className="text-sm flex-1" style={{ color: "#6b7fa3" }}>
            <span className="text-white font-medium">Sign in</span> to track your weekly progress, mark milestones, and save your interview date.
          </p>
        </div>
      )}

      {/* Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} style={{ color: "#818cf8" }} />
            <span className="text-xs" style={{ color: "#6b7fa3" }}>Current Week</span>
          </div>
          <p className="text-2xl font-bold text-white">{currentWeek}<span className="text-base font-normal" style={{ color: "#6b7fa3" }}>/12</span></p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} style={{ color: "#fbbf24" }} />
            <span className="text-xs" style={{ color: "#6b7fa3" }}>FAANG Readiness</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#fbbf24" }}>{faangReadinessScore}<span className="text-base font-normal" style={{ color: "#6b7fa3" }}>/100</span></p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} style={{ color: "#34d399" }} />
            <span className="text-xs" style={{ color: "#6b7fa3" }}>Weeks Complete</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#34d399" }}>{completedWeeks.length}<span className="text-base font-normal" style={{ color: "#6b7fa3" }}>/12</span></p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} style={{ color: daysLeft !== null && daysLeft <= 14 ? "#f87171" : "#38bdf8" }} />
            <span className="text-xs" style={{ color: "#6b7fa3" }}>Days to Interview</span>
          </div>
          {daysLeft !== null ? (
            <p className="text-2xl font-bold" style={{ color: daysLeft <= 14 ? "#f87171" : "#38bdf8" }}>
              {daysLeft}<span className="text-xs font-normal ml-1" style={{ color: "#6b7fa3" }}>days</span>
            </p>
          ) : (
            <input type="date" value={targetDate}
              onChange={(e) => handleSetTargetDate(e.target.value)}
              className="text-xs rounded-lg p-1.5 outline-none w-full"
              style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#6b7fa3" }}
              placeholder="Set date" />
          )}
        </div>
      </div>

      {/* Phase Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PHASE_CONFIG.map((phase) => (
          <div key={phase.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: phase.color + "22", border: `1px solid ${phase.color}44` }}>
            <span className="w-2 h-2 rounded-full" style={{ background: phase.color }} />
            <span className="text-xs font-medium" style={{ color: phase.color }}>
              Wk {phase.weeks[0]}–{phase.weeks[1]}: {phase.label}
            </span>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1" style={{ color: "#6b7fa3" }}>
          <span>Overall Progress</span>
          <span>{Math.round((completedWeeks.length / 12) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "#1e2d4a" }}>
          <div className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${(completedWeeks.length / 12) * 100}%`, background: "linear-gradient(90deg, #6366f1, #34d399)" }} />
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {learningPath.map((week) => {
          const status = getWeekStatus(week.week);
          const color = getPhaseColor(week.week);
          const isSelected = selectedWeek === week.week;
          const isLocked = status === "locked";

          return (
            <button key={week.week}
              onClick={() => !isLocked && setSelectedWeek(isSelected ? null : week.week)}
              disabled={isLocked}
              className="rounded-2xl p-4 text-left transition-all relative"
              style={{
                background: "#0d1426",
                border: `1px solid ${isSelected ? color : status === "in-progress" ? color + "66" : "#1e2d4a"}`,
                opacity: isLocked ? 0.4 : 1,
                boxShadow: isSelected ? `0 0 0 2px ${color}44` : "none",
              }}>
              {/* Phase color accent */}
              <div className="w-full h-1 rounded-full mb-2" style={{ background: color + (isLocked ? "44" : "88") }} />

              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "#4a5980" }}>Week {week.week}</span>
                {status === "completed" ? (
                  <CheckCircle size={14} style={{ color: "#34d399" }} />
                ) : status === "in-progress" ? (
                  <div className="w-3 h-3 rounded-full border-2 animate-pulse" style={{ borderColor: color }} />
                ) : isLocked ? (
                  <Lock size={12} style={{ color: "#2a3560" }} />
                ) : (
                  <Circle size={14} style={{ color: "#4a5980" }} />
                )}
              </div>

              <p className="text-xs font-semibold text-white leading-tight">{week.title}</p>
              <p className="text-xs mt-1" style={{ color: "#4a5980" }}>{getPhaseLabel(week.week)}</p>

              {isSelected && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <ChevronDown size={14} style={{ color }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Detail Panel */}
      {selectedWeekData && (
        <WeekDetailPanel
          week={selectedWeekData}
          status={getWeekStatus(selectedWeekData.week)}
          color={getPhaseColor(selectedWeekData.week)}
          onMarkComplete={() => handleMarkComplete(selectedWeekData.week)}
          onClose={() => setSelectedWeek(null)}
          setActiveView={setActiveView}
        />
      )}
    </div>
  );
}

function WeekDetailPanel({
  week,
  status,
  color,
  onMarkComplete,
  onClose,
  setActiveView,
}: {
  week: LearningPathWeek;
  status: string;
  color: string;
  onMarkComplete: () => void;
  onClose: () => void;
  setActiveView: (v: View) => void;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#0d1426", border: `1px solid ${color}44` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: color + "22", color }}>
              Week {week.week} — {getPhaseLabel(week.week)}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{week.title}</h2>
          <p className="text-xs mt-1" style={{ color: "#6b7fa3" }}>{week.description}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1e2d4a] transition-colors">
          <ChevronUp size={16} style={{ color: "#6b7fa3" }} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Objectives */}
        <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
          <p className="text-xs font-semibold mb-2" style={{ color }}>This Week's Objectives</p>
          <ul className="space-y-1.5">
            {week.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color }} />
                <span className="text-xs" style={{ color: "#6b7fa3" }}>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Milestone Check */}
        <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#fbbf24" }}>Milestone Check</p>
          <p className="text-xs italic" style={{ color: "#6b7fa3" }}>"{week.milestoneCheck}"</p>
          <p className="text-xs mt-2" style={{ color: "#4a5980" }}>Answer this honestly before marking the week complete.</p>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Resources & Activities</p>
        <div className="space-y-2">
          {week.resources.map((res, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
              <div className="mt-0.5 shrink-0" style={{ color: resourceColor(res.type) }}>
                {resourceIcon(res.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{res.title}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded capitalize"
                    style={{ background: resourceColor(res.type) + "22", color: resourceColor(res.type) }}>
                    {res.type}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: "#4a5980" }}>{res.estimatedMinutes} min</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#6b7fa3" }}>{res.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Scenarios */}
      {week.practiceScenarioIds.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Practice Scenarios This Week</p>
          <div className="flex flex-wrap gap-2">
            {week.practiceScenarioIds.map((id) => (
              <button key={id} onClick={() => setActiveView("practice")}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ background: "#34d39922", border: "1px solid #34d39944", color: "#34d399" }}>
                <Play size={10} className="inline mr-1" />
                {id.startsWith("exec-") ? `Exec Scenario ${id.replace("exec-", "")}` : `Scenario ${id.replace("s", "")}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mark Complete Button */}
      <div className="flex gap-3 mt-4">
        {status !== "completed" ? (
          <button onClick={onMarkComplete}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff" }}>
            <CheckCircle size={14} className="inline mr-2" />
            Mark Week {week.week} Complete
          </button>
        ) : (
          <div className="px-6 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: "#34d39922", border: "1px solid #34d39944", color: "#34d399" }}>
            <CheckCircle size={14} />
            Week {week.week} Complete
          </div>
        )}
      </div>
    </div>
  );
}
