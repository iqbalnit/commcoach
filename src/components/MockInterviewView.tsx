"use client";

import { useState, useRef, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useMockInterview, type MockInterviewMessage, type MockInterviewFull } from "@/lib/useMockInterview";
import { companyProfiles } from "@/lib/data";
import {
  MessageSquare,
  Play,
  Send,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  RotateCcw,
  Clock,
  Building2,
} from "lucide-react";

type Phase = "setup" | "active" | "complete";

const ROLE_LEVELS = [
  { id: "director", label: "Director of Engineering" },
  { id: "vp", label: "VP of Engineering" },
];

// ─── Setup Phase ─────────────────────────────────────────────────────────────

function SetupPhase({
  onStart,
}: {
  onStart: (company: string, roleLevel: string) => Promise<void>;
}) {
  const [company, setCompany] = useState("Google");
  const [roleLevel, setRoleLevel] = useState("director");
  const [starting, setStarting] = useState(false);

  const companies = companyProfiles.filter((c) => c.id !== "general").map((c) => ({
    id: c.id,
    label: c.name,
    color: c.color,
  }));

  const handleStart = async () => {
    setStarting(true);
    await onStart(company, roleLevel);
    setStarting(false);
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="mb-8 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <MessageSquare size={24} color="white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Configure Your Interview</h2>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Practice a realistic behavioral interview with AI coaching after each answer.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider mb-3 block" style={{ color: "#818cf8" }}>
          Target Company
        </label>
        <div className="grid grid-cols-3 gap-2">
          {companies.map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setCompany(label)}
              className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: company === label ? `${color}20` : "#0d1426",
                color: company === label ? color : "#6b7fa3",
                border: company === label ? `1px solid ${color}50` : "1px solid #1e2d4a",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="text-xs font-semibold uppercase tracking-wider mb-3 block" style={{ color: "#818cf8" }}>
          Role Level
        </label>
        <div className="flex flex-col gap-2">
          {ROLE_LEVELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRoleLevel(id)}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: roleLevel === id ? "rgba(99,102,241,0.2)" : "#0d1426",
                color: roleLevel === id ? "#a5b4fc" : "#6b7fa3",
                border: roleLevel === id ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2d4a",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-6 text-xs"
        style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }}
      >
        <strong>What to expect:</strong> 5 behavioral questions with streaming AI coaching after each answer. Sessions are saved for review.
      </div>

      <button
        onClick={handleStart}
        disabled={starting}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
      >
        <Play size={16} />
        {starting ? "Starting interview…" : `Start ${company} ${roleLevel === "vp" ? "VP" : "Director"} Interview`}
      </button>
    </div>
  );
}

// ─── Message Bubbles ─────────────────────────────────────────────────────────

function InterviewerBubble({ msg }: { msg: MockInterviewMessage }) {
  return (
    <div className="flex gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "#1e2d4a", border: "1px solid #2a3d6a" }}
      >
        <Building2 size={14} style={{ color: "#818cf8" }} />
      </div>
      <div className="flex-1">
        <div className="text-xs mb-1" style={{ color: "#4a5980" }}>
          Interviewer {msg.questionIndex ? `· Q${msg.questionIndex}` : ""}
        </div>
        <div
          className="rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed text-white"
          style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: MockInterviewMessage }) {
  return (
    <div className="flex gap-3 mb-4 flex-row-reverse">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(99,102,241,0.3)" }}
      >
        <span className="text-xs font-bold text-white">You</span>
      </div>
      <div className="flex-1">
        <div className="text-xs mb-1 text-right" style={{ color: "#4a5980" }}>Your answer</div>
        <div
          className="rounded-2xl rounded-tr-sm p-4 text-sm leading-relaxed"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", color: "#c8d0e0" }}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function FeedbackBubble({ msg }: { msg: MockInterviewMessage }) {
  return (
    <div
      className="rounded-2xl p-4 mb-4 text-sm"
      style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>
          AI Coaching
        </span>
        {msg.feedbackData && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
          >
            {msg.feedbackData.score}/10
          </span>
        )}
      </div>
      <p className="leading-relaxed mb-3" style={{ color: "#e8eaf0" }}>{msg.content}</p>
      {msg.feedbackData && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: "#34d399" }}>Strengths</div>
            {msg.feedbackData.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#6b7fa3" }}>
                <CheckCircle2 size={10} style={{ color: "#34d399", marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: "#f87171" }}>Improvements</div>
            {msg.feedbackData.improvements.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#6b7fa3" }}>
                <AlertCircle size={10} style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Active Phase ─────────────────────────────────────────────────────────────

function ActivePhase({
  interview,
  onComplete,
}: {
  interview: MockInterviewFull;
  onComplete: (updatedMessages: MockInterviewMessage[]) => void;
}) {
  const [messages, setMessages] = useState<MockInterviewMessage[]>(interview.messages);
  const [answer, setAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = messages.filter((m) => m.role === "interviewer").length;
  const totalQuestions = 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const submitAnswer = async () => {
    if (!answer.trim() || streaming) return;

    const userMsg: MockInterviewMessage = {
      role: "user",
      content: answer.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setAnswer("");
    setStreaming(true);
    setStreamText("");

    try {
      const res = await fetch(`/api/mock-interview/${interview.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer: answer.trim() }),
      });

      if (!res.ok || !res.body) {
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              accumulatedText += data.text;
              setStreamText(accumulatedText);
            }
            if (data.done) {
              if (data.isComplete) {
                setIsComplete(true);
              }
              // Fetch updated messages from DB
              const updated = await fetch(`/api/mock-interview/${interview.id}`);
              if (updated.ok) {
                const full = await updated.json();
                setMessages(full.messages);
                if (data.isComplete) {
                  onComplete(full.messages);
                }
              }
              setStreamText("");
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex h-full" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Conversation — Left 60% */}
      <div className="flex-1 flex flex-col" style={{ maxWidth: "60%" }}>
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          {messages.map((msg, i) => {
            if (msg.role === "interviewer") return <InterviewerBubble key={i} msg={msg} />;
            if (msg.role === "user") return <UserBubble key={i} msg={msg} />;
            if (msg.role === "feedback") return <FeedbackBubble key={i} msg={msg} />;
            return null;
          })}

          {/* Live stream preview */}
          {streaming && streamText && (
            <div
              className="rounded-2xl p-4 mb-4 text-sm animate-pulse"
              style={{ background: "rgba(251,191,36,0.04)", border: "1px dashed rgba(251,191,36,0.2)", color: "#9ca3af" }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: "#fbbf24" }}>
                Analyzing…
              </div>
              {streamText}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {!isComplete && (
          <div className="p-4 border-t" style={{ borderColor: "#1e2d4a" }}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={streaming}
              placeholder="Type your answer using the STAR framework…"
              rows={4}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none placeholder:opacity-40 mb-3"
              style={{ background: "#0d1426", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitAnswer();
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "#4a5980" }}>
                {answer.trim().split(/\s+/).filter(Boolean).length} words · Cmd+Enter to submit
              </span>
              <button
                onClick={submitAnswer}
                disabled={streaming || answer.trim().length < 5}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                {streaming ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel — 40% */}
      <div
        className="flex flex-col p-5 gap-5"
        style={{ width: "40%", borderLeft: "1px solid #1e2d4a", background: "#0d1426" }}
      >
        {/* Progress */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a5980" }}>
            Progress
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  background:
                    i < currentQuestion
                      ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                      : "#1e2d4a",
                }}
              />
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "#4a5980" }}>
            Question {Math.min(currentQuestion, totalQuestions)} of {totalQuestions}
          </p>
        </div>

        {/* Current question highlight */}
        {messages.filter((m) => m.role === "interviewer").slice(-1).map((msg, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <div className="text-xs font-semibold mb-2" style={{ color: "#818cf8" }}>
              Current Question
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#c8d0e0" }}>
              {msg.content}
            </p>
          </div>
        ))}

        {/* Tips */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: "#fbbf24" }}>
            Quick Tips
          </div>
          <ul className="flex flex-col gap-1.5 text-xs" style={{ color: "#6b7fa3" }}>
            <li>→ Use the STAR framework for every answer</li>
            <li>→ Include specific numbers and percentages</li>
            <li>→ Focus on YOUR actions, not the team</li>
            <li>→ End with the impact on the business</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Complete Phase ───────────────────────────────────────────────────────────

function CompletePhase({
  interview,
  messages,
  onReset,
}: {
  interview: MockInterviewFull;
  messages: MockInterviewMessage[];
  onReset: () => void;
}) {
  const feedbackMsgs = messages.filter((m) => m.role === "feedback");
  const avgScore =
    feedbackMsgs.length > 0
      ? Math.round(
          feedbackMsgs.reduce((sum, m) => sum + (m.feedbackData?.score ?? 0), 0) /
            feedbackMsgs.length
        )
      : 0;

  const summaryMsg = messages.filter((m) => m.role === "interviewer").slice(-1)[0];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <BarChart2 size={28} color="white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          {interview.company} · {interview.roleLevel === "vp" ? "VP" : "Director"} of Engineering
        </p>
      </div>

      {/* Overall Score */}
      <div
        className="rounded-2xl p-6 mb-6 text-center"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
      >
        <div className="text-5xl font-bold mb-2" style={{ color: "#a5b4fc" }}>
          {interview.overallScore ?? avgScore * 10}
        </div>
        <div className="text-sm" style={{ color: "#6b7fa3" }}>
          Overall Score / 100
        </div>
        {summaryMsg && (
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "#c8d0e0" }}>
            {summaryMsg.content}
          </p>
        )}
      </div>

      {/* Per-question breakdown */}
      <div className="grid grid-cols-1 gap-3 mb-8">
        {feedbackMsgs.map((msg, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: "#6b7fa3" }}>
                Question {i + 1}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
              >
                {msg.feedbackData?.score ?? 0}/10
              </span>
            </div>
            {msg.feedbackData?.strengths.map((s, j) => (
              <div key={j} className="flex items-start gap-1.5 text-xs mb-1" style={{ color: "#34d399" }}>
                <CheckCircle2 size={9} style={{ marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
            {msg.feedbackData?.improvements.map((s, j) => (
              <div key={j} className="flex items-start gap-1.5 text-xs" style={{ color: "#f87171" }}>
                <AlertCircle size={9} style={{ marginTop: 2, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          <RotateCcw size={14} />
          Start New Interview
        </button>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function MockInterviewView() {
  const { isAuthenticated } = useProgress();
  const { createInterview } = useMockInterview();
  const [phase, setPhase] = useState<Phase>("setup");
  const [interview, setInterview] = useState<MockInterviewFull | null>(null);
  const [finalMessages, setFinalMessages] = useState<MockInterviewMessage[]>([]);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96">
        <MessageSquare size={48} style={{ color: "#818cf8" }} className="mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Sign In to Start Mock Interview</h2>
        <p className="text-sm mb-2 text-center max-w-sm" style={{ color: "#6b7fa3" }}>
          Your interview sessions are saved so you can review your progress over time.
        </p>
      </div>
    );
  }

  const handleStart = async (company: string, roleLevel: string) => {
    setError("");
    const result = await createInterview(company, roleLevel);
    if (result) {
      setInterview(result);
      setPhase("active");
    } else {
      setError("Failed to start interview. Please check your API key and try again.");
    }
  };

  const handleComplete = (msgs: MockInterviewMessage[]) => {
    setFinalMessages(msgs);
    setPhase("complete");
  };

  const handleReset = () => {
    setInterview(null);
    setFinalMessages([]);
    setPhase("setup");
  };

  return (
    <div className="flex flex-col h-full">
      {phase === "setup" && (
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare size={14} style={{ color: "#818cf8" }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
              AI Mock Interview
            </span>
          </div>
          {error && (
            <div
              className="max-w-lg mx-auto mb-4 rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
            >
              {error}
            </div>
          )}
          <SetupPhase onStart={handleStart} />
        </div>
      )}

      {phase === "active" && interview && (
        <ActivePhase interview={interview} onComplete={handleComplete} />
      )}

      {phase === "complete" && interview && (
        <CompletePhase
          interview={interview}
          messages={finalMessages}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
