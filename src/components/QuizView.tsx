"use client";

import { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Star,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { quizzes, Quiz } from "@/lib/data";

const categoryColors: Record<string, string> = {
  Frameworks: "#818cf8",
  Mindset: "#a78bfa",
  "Difficult Conversations": "#f87171",
  Delivery: "#34d399",
  Coaching: "#fbbf24",
};

function ScoreCard({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);

  const getMessage = () => {
    if (pct === 100) return { title: "Perfect Score!", sub: "You've mastered the fundamentals of elite communication.", color: "#34d399" };
    if (pct >= 80) return { title: "Excellent Work!", sub: "You have a strong command of communication principles.", color: "#818cf8" };
    if (pct >= 60) return { title: "Good Foundation", sub: "Review the frameworks you missed and practice applying them.", color: "#fbbf24" };
    return { title: "Keep Practicing", sub: "Revisit the Frameworks and Principles sections, then try again.", color: "#f87171" };
  };

  const msg = getMessage();
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);

  return (
    <div className="max-w-2xl mx-auto p-8 fade-in">
      <div
        className="rounded-2xl p-8 mb-6 text-center"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
      >
        {/* Circular score */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <svg width={128} height={128} className="-rotate-90">
              <circle cx={64} cy={64} r={r} stroke="#1e2d4a" strokeWidth={6} fill="none" />
              <circle
                cx={64}
                cy={64}
                r={r}
                stroke={msg.color}
                strokeWidth={6}
                fill="none"
                strokeDasharray={circ}
                strokeDashoffset={dash}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-white">{pct}%</span>
              <span className="text-xs" style={{ color: "#4a5980" }}>{score}/{total}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={18} style={{ color: msg.color }} />
          <h2 className="text-xl font-bold text-white">{msg.title}</h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7fa3" }}>
          {msg.sub}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-1 mt-4">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              size={20}
              style={{
                color: i <= Math.ceil((score / total) * 3) ? "#fbbf24" : "#1e2d4a",
                fill: i <= Math.ceil((score / total) * 3) ? "#fbbf24" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#4a5980" }}>
          Performance by Category
        </div>
        {Array.from(new Set(quizzes.map((q) => q.category))).map((cat) => {
          const catQuizzes = quizzes.filter((q) => q.category === cat);
          const catColor = categoryColors[cat] ?? "#818cf8";
          return (
            <div key={cat} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-xs w-36 flex-shrink-0" style={{ color: "#6b7fa3" }}>
                {cat}
              </span>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ background: catColor, width: `${(catQuizzes.length / quizzes.length) * 100}%` }}
                />
              </div>
              <span className="text-xs w-12 text-right" style={{ color: "#4a5980" }}>
                {catQuizzes.length}Q
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 flex-1 justify-center"
          style={{ background: "#1e2d4a", color: "#a5b4fc", border: "1px solid #2a3d6a" }}
        >
          <RotateCcw size={14} />
          Retake Quiz
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 flex-1 justify-center"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          <BookOpen size={14} />
          Review Frameworks
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  quiz,
  index,
  total,
  onAnswer,
}: {
  quiz: Quiz;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const catColor = categoryColors[quiz.category] ?? "#818cf8";

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setTimeout(() => {
      onAnswer(i === quiz.correct);
    }, 1400);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 fade-in">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e2d4a" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              width: `${(index / total) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: "#4a5980" }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Category */}
      <div className="mb-4">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: `${catColor}15`,
            color: catColor,
            border: `1px solid ${catColor}25`,
          }}
        >
          {quiz.category}
        </span>
      </div>

      {/* Question */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
      >
        <div className="flex items-start gap-3 mb-1">
          <HelpCircle size={18} style={{ color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
          <h2 className="text-base font-semibold text-white leading-relaxed">
            {quiz.question}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {quiz.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === quiz.correct;
          const showResult = answered;

          let bg = "#0d1426";
          let border = "1px solid #1e2d4a";
          let textColor = "#c8d0e0";

          if (showResult) {
            if (isCorrect) {
              bg = "rgba(16,185,129,0.12)";
              border = "1px solid rgba(16,185,129,0.3)";
              textColor = "#34d399";
            } else if (isSelected && !isCorrect) {
              bg = "rgba(239,68,68,0.1)";
              border = "1px solid rgba(239,68,68,0.25)";
              textColor = "#f87171";
            }
          } else if (isSelected) {
            bg = "rgba(99,102,241,0.15)";
            border = "1px solid rgba(99,102,241,0.35)";
            textColor = "#a5b4fc";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] disabled:cursor-default disabled:hover:scale-100"
              style={{ background: bg, border, color: textColor }}
            >
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold transition-all"
                style={{
                  width: 28,
                  height: 28,
                  background: showResult
                    ? isCorrect
                      ? "rgba(16,185,129,0.2)"
                      : isSelected
                      ? "rgba(239,68,68,0.15)"
                      : "#1e2d4a"
                    : isSelected
                    ? "rgba(99,102,241,0.2)"
                    : "#1e2d4a",
                  color: showResult
                    ? isCorrect
                      ? "#34d399"
                      : isSelected
                      ? "#f87171"
                      : "#4a5980"
                    : isSelected
                    ? "#818cf8"
                    : "#4a5980",
                }}
              >
                {showResult && isCorrect ? (
                  <CheckCircle2 size={14} />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle size={14} />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </div>
              <span className="text-sm font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {answered && (
        <div
          className="rounded-xl p-4 fade-in"
          style={{
            background:
              selected === quiz.correct
                ? "rgba(16,185,129,0.06)"
                : "rgba(239,68,68,0.06)",
            border:
              selected === quiz.correct
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            {selected === quiz.correct ? (
              <CheckCircle2 size={14} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
            ) : (
              <XCircle size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }} />
            )}
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: selected === quiz.correct ? "#34d399" : "#f87171" }}
            >
              {selected === quiz.correct ? "Correct!" : "Not quite."}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#c8d0e0" }}>
            {quiz.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QuizView() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    if (current + 1 >= quizzes.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return <ScoreCard score={score} total={quizzes.length} onRestart={restart} />;
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-8 pt-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={14} style={{ color: "#818cf8" }} />
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "#818cf8" }}
          >
            Knowledge Check
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Test Your Communication IQ
        </h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          {quizzes.length} questions on frameworks, principles, and executive
          coaching best practices. Take your time.
        </p>
      </div>

      {/* Question */}
      <QuestionCard
        key={current}
        quiz={quizzes[current]}
        index={current}
        total={quizzes.length}
        onAnswer={handleAnswer}
      />

      {/* Skip / navigation hint */}
      <div className="flex justify-center pb-8">
        <button
          onClick={() => handleAnswer(false)}
          className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
          style={{ color: "#2a3560" }}
        >
          Skip question
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
