"use client";

import { useState, useRef } from "react";
import { useProgress } from "@/lib/useProgress";
import type { StoryData } from "@/lib/useProgress";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
} from "lucide-react";

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

type Step = "upload" | "processing" | "review";
type InputMode = "file" | "text";

function truncate(text: string, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function DraftStoryCard({
  story,
  onSave,
  saved,
}: {
  story: DraftStory;
  onSave: () => Promise<void>;
  saved: boolean;
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1 truncate">{story.title}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
          >
            {story.category}
          </span>
        </div>
        {saved ? (
          <span
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium"
            style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}
          >
            <CheckCircle2 size={11} />
            Saved
          </span>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Plus size={11} />
            {saving ? "Saving…" : "Save to Story Bank"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: "S", text: story.situation },
          { label: "T", text: story.task },
          { label: "A", text: story.action },
          { label: "R", text: story.result },
        ].map(({ label, text }) => (
          <div key={label} className="flex gap-2 text-xs">
            <span
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded font-bold text-white"
              style={{ background: "#374151", fontSize: 10 }}
            >
              {label}
            </span>
            <span style={{ color: "#6b7fa3" }}>{truncate(text, 120)}</span>
          </div>
        ))}
      </div>

      {story.impact && (
        <div
          className="mt-3 text-xs px-3 py-2 rounded-lg italic"
          style={{ background: "rgba(251,191,36,0.06)", color: "#fbbf24" }}
        >
          Impact: {truncate(story.impact, 100)}
        </div>
      )}

      {(story.companiesRelevant.length > 0 || story.questionTypes.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {story.companiesRelevant.map((c) => (
            <span key={c} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#1e2d4a", color: "#6b7fa3" }}>
              {c}
            </span>
          ))}
          {story.questionTypes.map((q) => (
            <span key={q} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#1e2d4a", color: "#6b7fa3" }}>
              {q}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AIStoryGeneratorPanel() {
  const { isAuthenticated, addStory } = useProgress();
  const [step, setStep] = useState<Step>("upload");
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [textInput, setTextInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [stories, setStories] = useState<DraftStory[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [sourceInfo, setSourceInfo] = useState<{ chars: number; found: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError("");
    setProcessing(true);
    setStep("processing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/generate-stories", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStories(data.stories as DraftStory[]);
        setSourceInfo({ chars: data.sourceCharCount, found: data.storiesFound });
        setStep("review");
      } else {
        setError(data.error ?? "Failed to extract stories");
        setStep("upload");
      }
    } catch {
      setError("Network error — please try again");
      setStep("upload");
    } finally {
      setProcessing(false);
    }
  };

  const processText = async () => {
    if (!textInput.trim()) return;
    setError("");
    setProcessing(true);
    setStep("processing");

    try {
      const res = await fetch("/api/ai/generate-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setStories(data.stories as DraftStory[]);
        setSourceInfo({ chars: data.sourceCharCount, found: data.storiesFound });
        setStep("review");
      } else {
        setError(data.error ?? "Failed to extract stories");
        setStep("upload");
      }
    } catch {
      setError("Network error — please try again");
      setStep("upload");
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const handleSaveStory = async (story: DraftStory, idx: number) => {
    const saved = await addStory({
      title: story.title,
      category: story.category,
      situation: story.situation ?? "",
      task: story.task ?? "",
      action: story.action ?? "",
      result: story.result ?? "",
      impact: story.impact ?? "",
      companiesRelevant: story.companiesRelevant as StoryData["companiesRelevant"],
      questionTypes: story.questionTypes,
      tags: [],
      lastPracticed: null,
      notes: "",
    });
    if (saved) {
      setSavedIds((prev) => new Set([...prev, idx]));
    }
  };

  const reset = () => {
    setStep("upload");
    setSelectedFile(null);
    setTextInput("");
    setStories([]);
    setSavedIds(new Set());
    setSourceInfo(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Sparkles size={28} style={{ color: "#4a5980", margin: "0 auto 12px" }} />
        <p className="text-sm font-medium text-white mb-1">Sign in to use AI Story Generator</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          Upload your resume or paste text to extract STAR stories with AI.
        </p>
      </div>
    );
  }

  // ─── Processing State ───────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-6"
        />
        <p className="text-sm font-medium text-white mb-1">Extracting your stories…</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          Claude is analyzing your {selectedFile ? "document" : "text"} for STAR stories
        </p>
      </div>
    );
  }

  // ─── Review State ───────────────────────────────────────────────────────────
  if (step === "review") {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-white">
              {sourceInfo?.found} {sourceInfo?.found === 1 ? "story" : "stories"} extracted
            </p>
            <p className="text-xs" style={{ color: "#4a5980" }}>
              From {sourceInfo?.chars.toLocaleString()} characters of text
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: "#1e2d4a", color: "#a5b4fc" }}
          >
            <RotateCcw size={12} />
            Extract from another
          </button>
        </div>

        {stories.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
          >
            <AlertCircle size={28} style={{ color: "#f87171", margin: "0 auto 12px" }} />
            <p className="text-sm font-medium text-white mb-1">No stories found</p>
            <p className="text-xs" style={{ color: "#6b7fa3" }}>
              Try uploading a more detailed resume or paste your leadership narrative directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {stories.map((story, idx) => (
              <DraftStoryCard
                key={idx}
                story={story}
                onSave={() => handleSaveStory(story, idx)}
                saved={savedIds.has(idx)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Upload State ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      <p className="text-sm mb-5" style={{ color: "#6b7fa3" }}>
        Upload your resume or paste your leadership text. Claude will extract 3-5 STAR stories ready to save to your story bank.
      </p>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-5">
        {([["file", "Upload File"], ["text", "Paste Text"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setInputMode(id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: inputMode === id ? "rgba(99,102,241,0.2)" : "#0d1426",
              color: inputMode === id ? "#a5b4fc" : "#6b7fa3",
              border: inputMode === id ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2d4a",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {inputMode === "file" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
          style={{
            background: dragOver ? "rgba(99,102,241,0.1)" : "#0d1426",
            border: `2px dashed ${dragOver ? "rgba(99,102,241,0.5)" : "#1e2d4a"}`,
          }}
        >
          <Upload size={28} style={{ color: dragOver ? "#818cf8" : "#4a5980" }} />
          <div className="text-center">
            <p className="text-sm font-medium text-white mb-1">
              {selectedFile ? selectedFile.name : "Drop your resume here"}
            </p>
            <p className="text-xs" style={{ color: "#4a5980" }}>
              PDF, DOCX, or TXT — up to 5MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {inputMode === "text" && (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your resume, LinkedIn summary, or leadership narrative here…"
            rows={12}
            className="w-full rounded-xl p-4 text-sm resize-none outline-none placeholder:opacity-40 mb-3"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "#4a5980" }}>
              {textInput.length.toLocaleString()} / 50,000 characters
            </p>
            <button
              onClick={processText}
              disabled={processing || textInput.trim().length < 50}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              <Sparkles size={14} />
              Extract Stories
            </button>
          </div>
        </div>
      )}

      <div
        className="mt-5 rounded-xl px-4 py-3 text-xs"
        style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", color: "#6b7fa3" }}
      >
        <span className="font-semibold" style={{ color: "#818cf8" }}>
          <FileText size={10} className="inline mr-1" />
          How it works:
        </span>{" "}
        Claude analyzes your text and extracts complete STAR stories using your actual experiences. Review each story before saving — nothing is saved automatically.
      </div>
    </div>
  );
}
