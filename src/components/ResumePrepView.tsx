"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  Mic,
  Target,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Building2,
} from "lucide-react";
import { companyProfiles } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import type { View } from "@/app/page";
import type { StoryData } from "@/lib/useProgress";

interface ResumePrepViewProps {
  setActiveView: (v: View) => void;
  setPreselectedScenarioId: (id: string | null) => void;
}

type Step = "upload" | "analyzing" | "results";
type InputMode = "file" | "text";

interface DraftStory {
  title: string;
  category: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  companiesRelevant: string[];
  questionTypes: string[];
}

interface PredictedQuestion {
  question: string;
  principle: string;
  difficulty: "easy" | "medium" | "hard";
  linkedScenarioId: string | null;
}

interface PrepPlan {
  summary: string;
  weeklyFocus: string[];
  priorityFrameworks: string[];
  topGaps: string[];
}

interface ResumePrepResult {
  stories: DraftStory[];
  predictedQuestions: PredictedQuestion[];
  prepPlan: PrepPlan;
  sourceCharCount: number;
}

const ROLE_LEVELS = [
  { id: "ic", label: "Individual Contributor" },
  { id: "manager", label: "Manager" },
  { id: "director", label: "Director" },
  { id: "vp", label: "VP / Executive" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#34d399",
  medium: "#fbbf24",
  hard: "#f87171",
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const color = DIFFICULTY_COLORS[difficulty] ?? "#818cf8";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {difficulty}
    </span>
  );
}

function StoryCard({
  story,
  index,
  onSave,
  saved,
}: {
  story: DraftStory;
  index: number;
  onSave: () => void;
  saved: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl text-xs font-bold flex-shrink-0"
            style={{ width: 28, height: 28, background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-1 truncate">{story.title}</h4>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}
              >
                {story.category}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saved}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all hover:scale-105 disabled:cursor-default"
          style={
            saved
              ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }
              : { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
          }
        >
          {saved ? (
            <>
              <CheckCircle2 size={11} />
              Saved
            </>
          ) : (
            <>
              <BookMarked size={11} />
              Save to Story Bank
            </>
          )}
        </button>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs mb-2 transition-colors hover:text-indigo-300"
        style={{ color: "#6b7fa3" }}
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Hide details" : "Show STAR details"}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 mt-2">
          {(["situation", "task", "action", "result", "impact"] as const).map((field) => (
            <div key={field} className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#4a5980" }}>
                {field}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#c8d0e0" }}>
                {story[field]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResumePrepView({ setActiveView, setPreselectedScenarioId }: ResumePrepViewProps) {
  const [step, setStep] = useState<Step>("upload");
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [roleLevel, setRoleLevel] = useState("director");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumePrepResult | null>(null);
  const [savedStories, setSavedStories] = useState<Set<number>>(new Set());

  // Expand/collapse panels
  const [showStories, setShowStories] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showPlan, setShowPlan] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addStory } = useProgress();

  const companies = companyProfiles.filter((c) => c.id !== "general");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleAnalyze = async () => {
    setError(null);
    setStep("analyzing");

    try {
      let res: Response;

      if (inputMode === "file" && selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        if (targetCompany) form.append("targetCompany", targetCompany);
        if (roleLevel) form.append("roleLevel", roleLevel);
        res = await fetch("/api/ai/resume-prep", { method: "POST", body: form });
      } else {
        res = await fetch("/api/ai/resume-prep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pastedText, targetCompany, roleLevel }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(errData.error ?? "Analysis failed. Please try again.");
        setStep("upload");
        return;
      }

      const data: ResumePrepResult = await res.json();
      setResult(data);
      setStep("results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("upload");
    }
  };

  const handleSaveStory = async (story: DraftStory, index: number) => {
    const storyToSave: Partial<StoryData> = {
      title: story.title,
      category: story.category,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      impact: story.impact,
      companiesRelevant: (story.companiesRelevant ?? []).map((c) => c.toLowerCase()) as StoryData["companiesRelevant"],
      questionTypes: story.questionTypes ?? [],
      tags: [],
      notes: "Extracted from resume by AI",
    };
    await addStory(storyToSave as Parameters<typeof addStory>[0]);
    setSavedStories((prev) => new Set(prev).add(index));
  };

  const canAnalyze =
    (inputMode === "file" && selectedFile !== null) ||
    (inputMode === "text" && pastedText.trim().length > 50);

  // ── Upload Step ──────────────────────────────────────────────────────────────
  if (step === "upload") {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} style={{ color: "#818cf8" }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
              AI Resume Analysis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Resume → Interview Prep</h1>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>
            Upload your resume and get AI-extracted STAR stories, predicted interview questions,
            and a personalized prep plan.
          </p>
        </div>

        {error && (
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertCircle size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
            <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
          </div>
        )}

        {/* Input mode toggle */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6"
          style={{ background: "#0d1426", border: "1px solid #1e2d4a", width: "fit-content" }}
        >
          {(["file", "text"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: inputMode === mode ? "rgba(99,102,241,0.2)" : "transparent",
                color: inputMode === mode ? "#a5b4fc" : "#4a5980",
                border: inputMode === mode ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              }}
            >
              {mode === "file" ? "Upload File" : "Paste Text"}
            </button>
          ))}
        </div>

        {/* File input */}
        {inputMode === "file" ? (
          <div
            className="rounded-2xl p-8 text-center mb-6 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragging ? "#818cf8" : "#1e2d4a"}`,
              background: dragging ? "rgba(99,102,241,0.06)" : "#0a0f1e",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <div
              className="flex items-center justify-center rounded-2xl mx-auto mb-4"
              style={{ width: 52, height: 52, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Upload size={22} style={{ color: "#818cf8" }} />
            </div>
            {selectedFile ? (
              <>
                <p className="text-sm font-semibold text-white mb-1">{selectedFile.name}</p>
                <p className="text-xs" style={{ color: "#4a5980" }}>
                  {(selectedFile.size / 1024).toFixed(0)} KB — click or drag to replace
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-white mb-1">
                  Drop your resume here or click to browse
                </p>
                <p className="text-xs" style={{ color: "#4a5980" }}>Supports PDF, DOCX, TXT up to 5MB</p>
              </>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume text here…"
              rows={10}
              className="w-full rounded-2xl p-4 text-sm resize-none outline-none transition-all"
              style={{
                background: "#0d1426",
                border: "1px solid #1e2d4a",
                color: "#c8d0e0",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "#4a5980" }}>
              {pastedText.length.toLocaleString()} characters
              {pastedText.length < 50 && " — need at least 50 characters"}
            </p>
          </div>
        )}

        {/* Optional: target company */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: "#818cf8" }}>
            Target Company <span style={{ color: "#4a5980", fontWeight: 400, textTransform: "none" }}>(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => setTargetCompany(targetCompany === c.name ? "" : c.name)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: targetCompany === c.name ? `${c.color}20` : "#0d1426",
                  color: targetCompany === c.name ? c.color : "#6b7fa3",
                  border: targetCompany === c.name ? `1px solid ${c.color}50` : "1px solid #1e2d4a",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Role level */}
        <div className="mb-8">
          <label className="text-xs font-semibold uppercase tracking-wider block mb-3" style={{ color: "#818cf8" }}>
            Role Level
          </label>
          <div className="flex flex-wrap gap-2">
            {ROLE_LEVELS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoleLevel(r.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: roleLevel === r.id ? "rgba(99,102,241,0.2)" : "#0d1426",
                  color: roleLevel === r.id ? "#a5b4fc" : "#6b7fa3",
                  border: roleLevel === r.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2d4a",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
          }}
        >
          <Sparkles size={16} />
          Analyze Resume
        </button>
      </div>
    );
  }

  // ── Analyzing Step ───────────────────────────────────────────────────────────
  if (step === "analyzing") {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="flex items-center justify-center rounded-2xl mb-6"
          style={{ width: 64, height: 64, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <Sparkles size={28} color="white" className="animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Analyzing Your Resume…</h2>
        <p className="text-sm text-center" style={{ color: "#6b7fa3" }}>
          Extracting your STAR stories and predicting interview questions.
          <br />
          This usually takes 10–20 seconds.
        </p>
        <div
          className="mt-8 h-1 rounded-full overflow-hidden"
          style={{ width: 200, background: "#1e2d4a" }}
        >
          <div
            className="h-1 rounded-full animate-pulse"
            style={{ width: "60%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
          />
        </div>
      </div>
    );
  }

  // ── Results Step ─────────────────────────────────────────────────────────────
  if (!result) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: "#818cf8" }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
              Analysis Complete
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Your Interview Prep Plan</h1>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>
            Analyzed {result.sourceCharCount.toLocaleString()} characters from your resume
          </p>
        </div>
        <button
          onClick={() => { setStep("upload"); setResult(null); setSavedStories(new Set()); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
          style={{ background: "#0d1426", color: "#6b7fa3", border: "1px solid #1e2d4a" }}
        >
          <RotateCcw size={12} />
          Analyze Another
        </button>
      </div>

      {/* ── Panel A: Extracted Stories ──────────────────────────────────────── */}
      <div className="rounded-2xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <button
          onClick={() => setShowStories((v) => !v)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
            >
              <BookMarked size={15} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Extracted STAR Stories</div>
              <div className="text-xs" style={{ color: "#4a5980" }}>
                {result.stories.length} stories found · {savedStories.size} saved to Story Bank
              </div>
            </div>
          </div>
          {showStories ? <ChevronUp size={16} style={{ color: "#4a5980" }} /> : <ChevronDown size={16} style={{ color: "#4a5980" }} />}
        </button>
        {showStories && (
          <div className="px-5 pb-5 flex flex-col gap-3">
            {result.stories.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "#4a5980" }}>
                No STAR stories could be extracted. Try pasting more detailed resume content.
              </p>
            ) : (
              result.stories.map((story, i) => (
                <StoryCard
                  key={i}
                  story={story}
                  index={i}
                  saved={savedStories.has(i)}
                  onSave={() => handleSaveStory(story, i)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Panel B: Predicted Questions ────────────────────────────────────── */}
      <div className="rounded-2xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <button
          onClick={() => setShowQuestions((v) => !v)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
            >
              <Target size={15} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Predicted Interview Questions</div>
              <div className="text-xs" style={{ color: "#4a5980" }}>
                {result.predictedQuestions.length} questions tailored to your profile
              </div>
            </div>
          </div>
          {showQuestions ? <ChevronUp size={16} style={{ color: "#4a5980" }} /> : <ChevronDown size={16} style={{ color: "#4a5980" }} />}
        </button>
        {showQuestions && (
          <div className="px-5 pb-5 flex flex-col gap-3">
            {result.predictedQuestions.map((q, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ background: "#111827", border: "1px solid #1e2d4a" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0"
                    style={{ width: 24, height: 24, background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white mb-2 leading-relaxed">{q.question}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DifficultyBadge difficulty={q.difficulty} />
                      {q.principle && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}
                        >
                          {q.principle}
                        </span>
                      )}
                      {q.linkedScenarioId && (
                        <button
                          onClick={() => {
                            setPreselectedScenarioId(q.linkedScenarioId);
                            setActiveView("practice");
                          }}
                          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all hover:scale-105"
                          style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                        >
                          <Mic size={9} />
                          Practice →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Panel C: Prep Plan ──────────────────────────────────────────────── */}
      <div className="rounded-2xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <button
          onClick={() => setShowPlan((v) => !v)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "rgba(52,211,153,0.1)", color: "#34d399" }}
            >
              <Lightbulb size={15} />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Your Personalized Prep Plan</div>
              <div className="text-xs" style={{ color: "#4a5980" }}>
                Gaps, frameworks, and weekly focus
              </div>
            </div>
          </div>
          {showPlan ? <ChevronUp size={16} style={{ color: "#4a5980" }} /> : <ChevronDown size={16} style={{ color: "#4a5980" }} />}
        </button>
        {showPlan && (
          <div className="px-5 pb-5 flex flex-col gap-4">
            {/* Summary */}
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#fef3c7" }}>
                {result.prepPlan.summary}
              </p>
            </div>

            {/* Top Gaps */}
            {result.prepPlan.topGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={12} style={{ color: "#f87171" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f87171" }}>
                    Top Gaps to Address
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {result.prepPlan.topGaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle size={11} style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }} />
                      <span className="text-xs" style={{ color: "#9ca3af" }}>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Frameworks */}
            {result.prepPlan.priorityFrameworks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={12} style={{ color: "#818cf8" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                    Priority Frameworks to Master
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.prepPlan.priorityFrameworks.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveView("frameworks")}
                      className="text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all hover:scale-105"
                      style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}
                    >
                      {f}
                      <ArrowRight size={9} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Focus */}
            {result.prepPlan.weeklyFocus.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={12} style={{ color: "#34d399" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                    Weekly Focus Areas
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {result.prepPlan.weeklyFocus.map((focus, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div
                        className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                        style={{ width: 18, height: 18, background: "rgba(52,211,153,0.12)", color: "#34d399", fontSize: 9 }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs" style={{ color: "#9ca3af" }}>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveView("story-bank")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <BookMarked size={14} />
          View Story Bank
        </button>
        <button
          onClick={() => setActiveView("prep-packs")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
        >
          <Building2 size={14} />
          Company Prep Packs
        </button>
      </div>
    </div>
  );
}
