"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import type { TranscriptData } from "@/lib/useProgress";

interface TranscriptsTabProps {
  isAuthenticated: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function AnalysisPanel({ analysis }: { analysis: NonNullable<TranscriptData["aiAnalysis"]> }) {
  return (
    <div
      className="mt-4 rounded-xl p-4"
      style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: "#818cf8" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
          AI Analysis
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
          style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
        >
          Score: {analysis.score}/100
        </span>
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: "#9ca3af" }}>
        {analysis.frameworkAdherence}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: "#34d399" }}>
            Strengths
          </div>
          <ul className="flex flex-col gap-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#6b7fa3" }}>
                <CheckCircle2 size={10} style={{ color: "#34d399", marginTop: 2, flexShrink: 0 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: "#f87171" }}>
            Improvements
          </div>
          <ul className="flex flex-col gap-1">
            {analysis.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#6b7fa3" }}>
                <AlertCircle size={10} style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TranscriptCard({
  transcript,
  onDelete,
  onAnalyze,
}: {
  transcript: TranscriptData;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await onAnalyze(transcript.id);
    setAnalyzing(false);
  };

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate mb-1">
            {transcript.scenarioTitle}
          </h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#4a5980" }}>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(transcript.elapsedSeconds)}
            </span>
            <span>{formatDate(transcript.createdAt)}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(transcript.id)}
          className="p-1.5 rounded-lg transition-colors hover:bg-red-900/30"
          style={{ color: "#4a5980" }}
          title="Delete transcript"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Stats badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}
        >
          {transcript.wordCount} words
        </span>
        {transcript.wpm && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}
          >
            {transcript.wpm} WPM
          </span>
        )}
        {transcript.fillerCount > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
          >
            {transcript.fillerCount} filler word{transcript.fillerCount !== 1 ? "s" : ""}
          </span>
        )}
        {transcript.hasNumbers && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}
          >
            ✓ Uses data
          </span>
        )}
        {transcript.aiAnalysis && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
          >
            <BarChart2 size={9} className="inline mr-1" />
            AI Score: {transcript.aiAnalysis.score}
          </span>
        )}
      </div>

      {/* Expand / Collapse */}
      {transcript.responseText && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs mb-3 transition-colors hover:text-indigo-300"
          style={{ color: "#6b7fa3" }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Hide response" : "Show full response"}
        </button>
      )}

      {expanded && transcript.responseText && (
        <div
          className="rounded-xl p-3 mb-3 text-xs leading-relaxed whitespace-pre-wrap"
          style={{ background: "#111827", color: "#c8d0e0", border: "1px solid #1e2d4a" }}
        >
          {transcript.responseText}
        </div>
      )}

      {/* AI Analysis result */}
      {transcript.aiAnalysis && <AnalysisPanel analysis={transcript.aiAnalysis} />}

      {/* Analyze button */}
      {!transcript.aiAnalysis && transcript.responseText && transcript.wordCount >= 10 && (
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <Sparkles size={11} />
          {analyzing ? "Analyzing…" : "Analyze with AI"}
        </button>
      )}
    </div>
  );
}

export default function TranscriptsTab({ isAuthenticated }: TranscriptsTabProps) {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTranscripts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch("/api/transcripts");
      if (res.ok) {
        setTranscripts(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTranscripts();
    }
  }, [isAuthenticated, fetchTranscripts]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/transcripts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTranscripts((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAnalyze = async (id: string) => {
    const res = await fetch(`/api/transcripts/${id}/analyze`, { method: "POST" });
    if (res.ok) {
      const updated = await res.json();
      setTranscripts((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <FileText size={28} style={{ color: "#4a5980", margin: "0 auto 12px" }} />
        <p className="text-sm font-medium text-white mb-1">Sign in to save transcripts</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          Your practice responses are automatically saved when you sign in.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm" style={{ color: "#4a5980" }}>Loading transcripts…</div>
      </div>
    );
  }

  if (!loading && transcripts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={36} style={{ color: "#1e2d4a", margin: "0 auto 12px" }} />
        <p className="text-sm font-medium text-white mb-1">No transcripts yet</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          Complete a practice scenario to save your first transcript.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs" style={{ color: "#4a5980" }}>
          {transcripts.length} session{transcripts.length !== 1 ? "s" : ""} recorded
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {transcripts.map((t) => (
          <TranscriptCard
            key={t.id}
            transcript={t}
            onDelete={handleDelete}
            onAnalyze={handleAnalyze}
          />
        ))}
      </div>
    </div>
  );
}
