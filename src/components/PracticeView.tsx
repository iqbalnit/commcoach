"use client";

import { useState, useEffect, useRef } from "react";
import { scenarios, frameworks, type Scenario } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import {
  Mic,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Play,
  Square,
  Star,
  Shield,
} from "lucide-react";

const difficultyColors = {
  beginner: { bg: "rgba(16,185,129,0.12)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  intermediate: { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  advanced: { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(239,68,68,0.2)" },
};

const categoryColors: Record<string, string> = {
  Pitching: "#818cf8",
  "Spontaneous Speaking": "#38bdf8",
  "Executive Communication": "#a78bfa",
  Storytelling: "#fbbf24",
  "Difficult Conversations": "#f87171",
  "Leadership Communication": "#34d399",
};

function ScenarioCard({
  scenario,
  onClick,
  isCompleted,
}: {
  scenario: Scenario;
  onClick: () => void;
  isCompleted: boolean;
}) {
  const diff = difficultyColors[scenario.difficulty];
  const catColor = categoryColors[scenario.category] || "#818cf8";
  const fw = frameworks.find((f) => f.id === scenario.framework);

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}
          >
            {scenario.difficulty}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25` }}
          >
            {scenario.category}
          </span>
          {scenario.isExecutive && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "#fbbf2420", color: "#fbbf24", border: "1px solid #fbbf2440" }}>
              FAANG
            </span>
          )}
          {isCompleted && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#34d39920", color: "#34d399" }}>
              Done
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: "#4a5980" }}>
          <Clock size={11} />
          {scenario.timeLimit}s
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {scenario.title}
      </h3>

      <p className="text-xs leading-relaxed mb-3" style={{ color: "#6b7fa3" }}>
        {scenario.context}
      </p>

      <div className="flex items-center justify-between">
        {fw && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4a5980" }}>
            <BookOpen size={10} />
            <span>{fw.name}</span>
          </div>
        )}
        <ChevronRight size={14} style={{ color: "#2a3560" }} className="group-hover:text-indigo-400 transition-colors ml-auto" />
      </div>
    </button>
  );
}

function Timer({ limit, running, elapsed }: { limit: number; running: boolean; elapsed: number }) {
  const pct = Math.min(elapsed / limit, 1);
  const remaining = Math.max(limit - elapsed, 0);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining <= 15 && running;

  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);

  return (
    <div className="flex items-center gap-3">
      <svg width={72} height={72} className="-rotate-90">
        <circle cx={36} cy={36} r={r} stroke="#1e2d4a" strokeWidth={4} fill="none" />
        <circle
          cx={36}
          cy={36}
          r={r}
          stroke={urgent ? "#ef4444" : "#6366f1"}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div>
        <div
          className={`text-xl font-bold font-mono ${urgent ? "recording-pulse" : ""}`}
          style={{ color: urgent ? "#ef4444" : "#e8eaf0" }}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
        <div className="text-xs" style={{ color: "#4a5980" }}>remaining</div>
      </div>
    </div>
  );
}

function PracticeSession({
  scenario,
  onBack,
  onComplete,
}: {
  scenario: Scenario;
  onBack: () => void;
  onComplete: (elapsedSeconds: number) => void;
}) {
  const [phase, setPhase] = useState<"prep" | "delivering" | "review">("prep");
  const [elapsed, setElapsed] = useState(0);
  const [response, setResponse] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const fw = frameworks.find((f) => f.id === scenario.framework);

  const startDelivery = () => {
    setPhase("delivering");
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= scenario.timeLimit) {
          clearInterval(intervalRef.current!);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopDelivery = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("review");
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete(elapsed);
    }
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("prep");
    setElapsed(0);
    setResponse("");
    completedRef.current = false;
  };

  useEffect(() => {
    if (elapsed >= scenario.timeLimit && phase === "delivering") {
      stopDelivery();
    }
  }, [elapsed, scenario.timeLimit, phase]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const diff = difficultyColors[scenario.difficulty];
  const catColor = categoryColors[scenario.category] || "#818cf8";

  const analyzeResponse = () => {
    if (response.trim().length < 20) return null;
    const words = response.trim().split(/\s+/).length;
    const sentences = response.split(/[.!?]+/).filter(Boolean).length;
    const hasFillers = /\b(um|uh|like|you know|basically|sort of|kind of)\b/i.test(response);
    const hasNumbers = /\d/.test(response);
    const isLong = words > 200;
    const isTooShort = words < 30;
    return { words, sentences, hasFillers, hasNumbers, isLong, isTooShort };
  };

  const stats = phase === "review" ? analyzeResponse() : null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#4a5980" }}
      >
        <ArrowLeft size={14} /> Back to Scenarios
      </button>

      <div className="rounded-2xl p-6 mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <div className="flex gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
            {scenario.difficulty}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${catColor}15`, color: catColor }}>
            {scenario.category}
          </span>
          {fw && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
              {fw.acronym} Framework
            </span>
          )}
          {scenario.isExecutive && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#fbbf2420", color: "#fbbf24" }}>
              FAANG Executive
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-3">{scenario.title}</h2>
        <div className="text-sm px-4 py-3 rounded-xl italic leading-relaxed"
          style={{ background: "rgba(99,102,241,0.08)", color: "#a5b4fc", borderLeft: "3px solid rgba(99,102,241,0.4)" }}>
          Scenario: &ldquo;{scenario.context}&rdquo;
        </div>
      </div>

      {phase === "prep" && (
        <div className="fade-in">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {fw && (
              <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={13} style={{ color: "#818cf8" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                    Framework: {fw.name}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {fw.steps.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start text-xs">
                      <div className="flex items-center justify-center rounded text-white font-bold flex-shrink-0"
                        style={{ width: 20, height: 20, background: "#6366f1", fontSize: 9 }}>
                        {i + 1}
                      </div>
                      <div>
                        <span className="font-semibold text-white">{step.label}: </span>
                        <span style={{ color: "#6b7fa3" }}>{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
              <div className="flex items-center gap-2 mb-3">
                <Mic size={13} style={{ color: "#34d399" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                  Your Task
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white mb-3">{scenario.prompt}</p>
              {scenario.answerFrameworkHint && (
                <div className="rounded-lg px-3 py-2 mb-3 flex items-start gap-2"
                  style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
                  <Shield size={11} className="mt-0.5 shrink-0" style={{ color: "#818cf8" }} />
                  <p className="text-xs" style={{ color: "#818cf8" }}>{scenario.answerFrameworkHint}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs" style={{ color: "#4a5980" }}>
                <Clock size={11} />
                Time limit: {scenario.timeLimit}s
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={13} style={{ color: "#34d399" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                Key Points to Hit
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {scenario.keyPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#6b7fa3" }}>
                  <CheckCircle2 size={13} style={{ color: "#34d399", marginTop: 1, flexShrink: 0 }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-4 mb-6"
            style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div className="flex items-start gap-3">
              <Star size={14} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} />
              <p className="text-sm italic leading-relaxed" style={{ color: "#fbbf24" }}>
                {scenario.expertTip}
              </p>
            </div>
          </div>

          <button
            onClick={startDelivery}
            className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            <Play size={16} />
            Start Delivery ({scenario.timeLimit}s timer)
          </button>
        </div>
      )}

      {phase === "delivering" && (
        <div className="fade-in">
          <div className="rounded-2xl p-6 mb-6"
            style={{ background: "#0d1426", border: "1px solid rgba(99,102,241,0.3)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full recording-pulse" style={{ width: 10, height: 10, background: "#ef4444" }} />
                <span className="text-sm font-semibold text-white">Delivering</span>
              </div>
              <Timer limit={scenario.timeLimit} running={true} elapsed={elapsed} />
            </div>

            <div className="text-sm px-4 py-3 rounded-xl italic mb-4"
              style={{ background: "rgba(99,102,241,0.08)", color: "#a5b4fc", borderLeft: "3px solid rgba(99,102,241,0.4)" }}>
              {scenario.prompt}
            </div>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here (or just practice aloud and jot notes)..."
              className="w-full rounded-xl p-4 text-sm resize-none outline-none placeholder:opacity-40"
              style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0", minHeight: 150 }}
              rows={6}
            />
          </div>

          <button
            onClick={stopDelivery}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "#374151", border: "1px solid #4b5563" }}
          >
            <Square size={14} />
            Finish & Get Feedback
          </button>
        </div>
      )}

      {phase === "review" && (
        <div className="fade-in">
          <div className="rounded-2xl p-5 mb-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Delivery Stats</div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5" style={{ color: "#6b7fa3" }}>
                  <Clock size={11} />
                  Used: {elapsed}s / {scenario.timeLimit}s
                </div>
                {stats && (
                  <>
                    <div style={{ color: "#6b7fa3" }}>{stats.words} words</div>
                    <div style={{ color: "#6b7fa3" }}>{stats.sentences} sentences</div>
                  </>
                )}
              </div>
            </div>

            {stats && (
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.hasFillers && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                    ⚠ Filler words detected
                  </span>
                )}
                {stats.hasNumbers && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                    ✓ Used specific data
                  </span>
                )}
                {stats.isLong && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                    ⚠ Response may be too long
                  </span>
                )}
                {stats.isTooShort && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                    ⚠ Response may be too brief
                  </span>
                )}
              </div>
            )}
          </div>

          {response && (
            <div className="rounded-2xl p-5 mb-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a5980" }}>
                Your Response
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#c8d0e0" }}>
                {response}
              </p>
            </div>
          )}

          <div className="rounded-2xl p-5 mb-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={14} style={{ color: "#34d399" }} />
              <span className="text-sm font-semibold text-white">Self-Assessment Checklist</span>
            </div>
            <div className="flex flex-col gap-2">
              {scenario.keyPoints.map((p, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-0.5 accent-indigo-500" />
                  <span className="text-sm" style={{ color: "#6b7fa3" }}>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 mb-5"
            style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={13} style={{ color: "#f87171" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f87171" }}>
                Common Mistakes to Avoid
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {scenario.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9ca3af" }}>
                  <span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-4 mb-6"
            style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div className="flex items-start gap-3">
              <Star size={14} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} />
              <p className="text-sm italic leading-relaxed" style={{ color: "#fbbf24" }}>
                {scenario.expertTip}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "#1e2d4a", color: "#a5b4fc", border: "1px solid #2a3d6a" }}
            >
              <RotateCcw size={14} />
              Try Again
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              Next Scenario
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface PracticeViewProps {
  initialScenarioId?: string | null;
  onScenarioConsumed?: () => void;
}

export default function PracticeView({ initialScenarioId, onScenarioConsumed }: PracticeViewProps) {
  const { progress, markScenarioCompleted, markFrameworkViewed, isAuthenticated } = useProgress();
  const [selected, setSelected] = useState<Scenario | null>(() =>
    initialScenarioId ? (scenarios.find((s) => s.id === initialScenarioId) ?? null) : null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "standard" | "executive">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  // If initialScenarioId changes (deep link from exec interview), open that scenario
  useEffect(() => {
    if (initialScenarioId) {
      const s = scenarios.find((sc) => sc.id === initialScenarioId);
      if (s) {
        setSelected(s);
        onScenarioConsumed?.();
      }
    }
  }, [initialScenarioId]);

  const handleScenarioComplete = async (scenario: Scenario, elapsedSeconds: number) => {
    const minutes = Math.ceil(elapsedSeconds / 60);
    await markScenarioCompleted(scenario.id, minutes);
    await markFrameworkViewed(scenario.framework);
  };

  const categories = ["All", ...Array.from(new Set(scenarios.map((s) => s.category)))];
  const difficulties = ["All", "beginner", "intermediate", "advanced"];

  const filtered = scenarios.filter((s) => {
    if (categoryFilter !== "All" && s.category !== categoryFilter) return false;
    if (difficultyFilter !== "All" && s.difficulty !== difficultyFilter) return false;
    if (typeFilter === "standard" && s.isExecutive) return false;
    if (typeFilter === "executive" && !s.isExecutive) return false;
    return true;
  });

  if (selected) {
    return (
      <PracticeSession
        scenario={selected}
        onBack={() => setSelected(null)}
        onComplete={(elapsed) => handleScenarioComplete(selected, elapsed)}
      />
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Practice Scenarios
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Real-World Communication Scenarios
            </h1>
            <p className="text-sm" style={{ color: "#6b7fa3" }}>
              {scenarios.length} scenarios including {scenarios.filter((s) => s.isExecutive).length} executive FAANG interview questions.
              {isAuthenticated ? "" : " Sign in to track your progress."}
            </p>
          </div>
          {isAuthenticated && (
            <div className="text-right">
              <p className="text-xl font-bold text-white">{progress?.scenariosCompleted.length ?? 0}<span className="text-sm font-normal" style={{ color: "#6b7fa3" }}>/{scenarios.length}</span></p>
              <p className="text-xs" style={{ color: "#6b7fa3" }}>completed</p>
            </div>
          )}
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-3">
        {([["all", "All Scenarios"], ["standard", "Standard (8)"], ["executive", "FAANG Executive (15)"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTypeFilter(id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: typeFilter === id ? "rgba(251,191,36,0.2)" : "#0d1426",
              color: typeFilter === id ? "#fbbf24" : "#6b7fa3",
              border: typeFilter === id ? "1px solid rgba(251,191,36,0.4)" : "1px solid #1e2d4a",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: categoryFilter === cat ? "rgba(99,102,241,0.2)" : "#0d1426",
              color: categoryFilter === cat ? "#a5b4fc" : "#6b7fa3",
              border: categoryFilter === cat ? "1px solid rgba(99,102,241,0.3)" : "1px solid #1e2d4a",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 mb-6">
        {difficulties.map((diff) => (
          <button key={diff} onClick={() => setDifficultyFilter(diff)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={{
              background: difficultyFilter === diff ? "rgba(99,102,241,0.15)" : "#0d1426",
              color: difficultyFilter === diff ? "#a5b4fc" : "#6b7fa3",
              border: difficultyFilter === diff ? "1px solid rgba(99,102,241,0.25)" : "1px solid #1e2d4a",
            }}>
            {diff === "All" ? "All Levels" : diff}
          </button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color: "#4a5980" }}>
        Showing {filtered.length} of {scenarios.length} scenarios
      </p>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            onClick={() => setSelected(s)}
            isCompleted={progress?.scenariosCompleted.includes(s.id) ?? false}
          />
        ))}
      </div>
    </div>
  );
}
