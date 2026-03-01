"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Printer,
  BarChart2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building2,
  Target,
  Lightbulb,
} from "lucide-react";

interface QuestionBreakdown {
  questionIndex: number;
  questionText: string;
  userAnswer: string;
  feedbackText: string;
  score: number;
  strengths: string[];
  improvements: string[];
  idealAnswerOpening: string;
}

interface ReportData {
  interviewId: string;
  company: string;
  roleLevel: string;
  overallScore: number;
  completedAt: string;
  finalSummary: string;
  executiveSummary: string;
  keyThemes: string[];
  topRecommendations: string[];
  questionBreakdown: QuestionBreakdown[];
}

interface MockInterviewForReport {
  id: string;
  company: string;
  roleLevel: string;
  status: string;
  overallScore: number | null;
  finalSummary: string | null;
  startedAt: Date | string;
  completedAt: Date | string | null;
  messages: unknown[];
}

function GaugeRing({ pct, color, size = 100, stroke = 8 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);
  const c = size / 2;
  return (
    <div className="relative no-print-transform" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={c} cy={c} r={r} stroke="#1e2d4a" strokeWidth={stroke} fill="none" />
        <circle
          cx={c} cy={c} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{pct}</span>
      </div>
    </div>
  );
}

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 8 ? "#34d399" : score >= 6 ? "#fbbf24" : "#f87171";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-bold"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {score}/10
    </span>
  );
}

function QuestionCard({ qa }: { qa: QuestionBreakdown }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl p-5 break-inside-avoid"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a", marginBottom: 16 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="flex items-center justify-center rounded-xl text-xs font-bold flex-shrink-0"
            style={{ width: 28, height: 28, background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
          >
            Q{qa.questionIndex}
          </div>
          <p className="text-sm font-medium text-white leading-snug">{qa.questionText}</p>
        </div>
        <ScoreChip score={qa.score} />
      </div>

      {/* Answer preview */}
      <div
        className="rounded-xl p-3 mb-3 text-xs leading-relaxed"
        style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#9ca3af" }}
      >
        <span className="font-semibold" style={{ color: "#6b7fa3" }}>Your answer: </span>
        {qa.userAnswer.length > 200 ? qa.userAnswer.slice(0, 200) + "…" : qa.userAnswer}
      </div>

      {/* Feedback */}
      <p className="text-xs leading-relaxed mb-3" style={{ color: "#c8d0e0" }}>
        {qa.feedbackText}
      </p>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="no-print flex items-center gap-1 text-xs mb-3 transition-colors hover:text-indigo-300"
        style={{ color: "#6b7fa3" }}
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Hide details" : "Show strengths & improvements"}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs font-semibold mb-1.5" style={{ color: "#34d399" }}>Strengths</div>
            {qa.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs mb-1" style={{ color: "#6b7fa3" }}>
                <CheckCircle2 size={9} style={{ color: "#34d399", marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5" style={{ color: "#f87171" }}>Improvements</div>
            {qa.improvements.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs mb-1" style={{ color: "#6b7fa3" }}>
                <AlertCircle size={9} style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ideal opening */}
      {qa.idealAnswerOpening && (
        <div
          className="rounded-xl p-3 text-xs"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <span className="font-semibold" style={{ color: "#fbbf24" }}>Ideal opening: </span>
          <span style={{ color: "#fef3c7" }}>&ldquo;{qa.idealAnswerOpening}&rdquo;</span>
        </div>
      )}
    </div>
  );
}

interface InterviewReportViewProps {
  interview: MockInterviewForReport;
}

export default function InterviewReportView({ interview }: InterviewReportViewProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      try {
        const res = await fetch(`/api/mock-interview/${interview.id}/report`, {
          method: "POST",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          setError(err.error ?? "Failed to generate report");
        } else {
          const data = await res.json();
          setReportData(data.reportData);
        }
      } catch {
        setError("Network error. Please reload the page.");
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [interview.id]);

  const companyColors: Record<string, string> = {
    Google: "#4285f4",
    Amazon: "#ff9900",
    Microsoft: "#00a4ef",
    Meta: "#0668e1",
    Apple: "#a3aaae",
  };
  const companyColor = companyColors[interview.company] ?? "#818cf8";
  const companyInitial = interview.company.charAt(0).toUpperCase();

  const formattedDate = reportData
    ? new Date(reportData.completedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0a0f1e" }}
      >
        <style>{`
          @media print {
            body { background: white !important; color: #111 !important; }
            .no-print { display: none !important; }
          }
        `}</style>
        <div
          className="flex items-center justify-center rounded-2xl mb-6"
          style={{ width: 64, height: 64, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <Sparkles size={28} color="white" className="animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Generating Your Report…</h2>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          AI is analyzing your interview performance. This takes about 10 seconds.
        </p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#0a0f1e" }}
      >
        <style>{`
          @media print {
            body { background: white !important; color: #111 !important; }
            .no-print { display: none !important; }
          }
        `}</style>
        <AlertCircle size={36} style={{ color: "#f87171", marginBottom: 16 }} />
        <h2 className="text-xl font-bold text-white mb-2">Report Generation Failed</h2>
        <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <style>{`
        @media print {
          body { background: white !important; color: #111 !important; }
          .no-print { display: none !important; }
          .print-card { background: #f9fafb !important; border-color: #e5e7eb !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-8">
        {/* Print button */}
        <div className="no-print flex justify-end mb-6">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Printer size={14} />
            Print / Save as PDF
          </button>
        </div>

        {/* ── Report Header ─────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 mb-6 print-card"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className="flex items-center justify-center rounded-2xl text-3xl font-bold text-white"
                style={{ width: 72, height: 72, background: companyColor, flexShrink: 0 }}
              >
                {companyInitial}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#818cf8" }}>
                  Interview Report Card
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {interview.company} — {interview.roleLevel === "vp" ? "VP" : "Director"} of Engineering
                </h1>
                <div className="text-sm" style={{ color: "#6b7fa3" }}>Completed {formattedDate}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#4a5980" }}
              >
                SPEAKSHARP
              </div>
              <GaugeRing pct={reportData.overallScore} color={companyColor} size={100} stroke={8} />
              <div className="text-xs mt-1" style={{ color: "#6b7fa3" }}>Overall Score / 100</div>
            </div>
          </div>
        </div>

        {/* ── Executive Summary ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 mb-6 print-card"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} style={{ color: "#fbbf24" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>
              Executive Summary
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#fef3c7" }}>
            {reportData.executiveSummary}
          </p>
        </div>

        {/* ── Key Themes + Top Recommendations ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Key Themes */}
          <div className="rounded-2xl p-5 print-card" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={12} style={{ color: "#818cf8" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                Key Themes
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {reportData.keyThemes.map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="rounded-2xl p-5 print-card" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={12} style={{ color: "#34d399" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                Top Recommendations
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {reportData.topRecommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                    style={{ width: 18, height: 18, background: "rgba(52,211,153,0.12)", color: "#34d399", fontSize: 9, marginTop: 1 }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs" style={{ color: "#c8d0e0" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Per-Question Breakdown ────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={13} style={{ color: "#818cf8" }} />
            <span className="text-sm font-semibold text-white">Question Breakdown</span>
            <span className="text-xs" style={{ color: "#4a5980" }}>
              ({reportData.questionBreakdown.length} questions)
            </span>
          </div>
          {reportData.questionBreakdown.map((qa) => (
            <QuestionCard key={qa.questionIndex} qa={qa} />
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div
          className="text-center py-6"
          style={{ borderTop: "1px solid #1e2d4a" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lightbulb size={12} style={{ color: "#4a5980" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5980" }}>
              SPEAKSHARP · Executive Communication Coach
            </span>
          </div>
          <p className="text-xs" style={{ color: "#2a3560" }}>
            This report was generated by AI and should be used as a coaching tool, not a hiring decision.
          </p>
        </div>
      </div>
    </div>
  );
}
