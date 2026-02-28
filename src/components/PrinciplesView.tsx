"use client";

import { useState } from "react";
import { principles, Principle } from "@/lib/data";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Quote,
  Zap,
  Mic,
  BookOpen,
  Eye,
  Users,
  MessageSquare,
  Heart,
} from "lucide-react";

const categoryConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  Mindset: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    icon: <Brain size={13} />,
  },
  Clarity: {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.2)",
    icon: <Zap size={13} />,
  },
  Delivery: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    icon: <Mic size={13} />,
  },
  Structure: {
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.2)",
    icon: <BookOpen size={13} />,
  },
  Listening: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    icon: <Eye size={13} />,
  },
  Storytelling: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    icon: <MessageSquare size={13} />,
  },
  Presence: {
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
    icon: <Users size={13} />,
  },
  Influence: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    icon: <Heart size={13} />,
  },
};

function PrincipleCard({ principle }: { principle: Principle }) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryConfig[principle.category] ?? {
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.2)",
    icon: <Brain size={13} />,
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-5 text-left group"
      >
        <div className="flex items-start gap-4 flex-1">
          {/* Category badge icon */}
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              background: cat.bg,
              border: `1px solid ${cat.border}`,
              color: cat.color,
            }}
          >
            {cat.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: cat.bg,
                  color: cat.color,
                  border: `1px solid ${cat.border}`,
                }}
              >
                {principle.category}
              </span>
              <span className="text-xs" style={{ color: "#4a5980" }}>
                {principle.coach}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {principle.title}
            </h3>
          </div>
        </div>

        <div className="flex-shrink-0 ml-3 mt-1">
          {expanded ? (
            <ChevronUp size={16} style={{ color: "#4a5980" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "#4a5980" }} />
          )}
        </div>
      </button>

      {/* Description always visible */}
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed" style={{ color: "#6b7fa3" }}>
          {principle.description}
        </p>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-5 pb-5 fade-in">
          {/* Quote */}
          <div
            className="rounded-xl p-4 mb-4 flex items-start gap-3"
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderLeft: "3px solid rgba(99,102,241,0.5)",
            }}
          >
            <Quote size={14} style={{ color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm italic leading-relaxed" style={{ color: "#a5b4fc" }}>
              {principle.quote}
            </p>
          </div>

          {/* Action items */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#4a5980" }}
            >
              Put It Into Practice
            </div>
            <div className="flex flex-col gap-2">
              {principle.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "#111827", border: "1px solid #1e2d4a" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold"
                    style={{
                      width: 22,
                      height: 22,
                      background: cat.color,
                      fontSize: 10,
                      minWidth: 22,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#c8d0e0" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PrinciplesView() {
  const [filter, setFilter] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(principles.map((p) => p.category))),
  ];

  const filtered =
    filter === "All"
      ? principles
      : principles.filter((p) => p.category === filter);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={14} style={{ color: "#818cf8" }} />
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "#818cf8" }}
          >
            Core Principles
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          The Principles Behind Great Communication
        </h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Distilled from Matt Abrahams, executive coaching traditions, and
          behavioral research. These are the mental models and habits that
          separate good communicators from great ones.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const cfg = categoryConfig[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background:
                  filter === cat
                    ? cfg
                      ? cfg.bg
                      : "rgba(99,102,241,0.2)"
                    : "#0d1426",
                color:
                  filter === cat
                    ? cfg
                      ? cfg.color
                      : "#a5b4fc"
                    : "#6b7fa3",
                border:
                  filter === cat
                    ? `1px solid ${cfg ? cfg.border : "rgba(99,102,241,0.3)"}`
                    : "1px solid #1e2d4a",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Principles count */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs" style={{ color: "#4a5980" }}>
          {filtered.length} principle{filtered.length !== 1 ? "s" : ""}
          {filter !== "All" ? ` in ${filter}` : ""}
        </span>
      </div>

      {/* Principles list */}
      <div className="flex flex-col gap-4">
        {filtered.map((p) => (
          <PrincipleCard key={p.id} principle={p} />
        ))}
      </div>

      {/* Bottom insight */}
      <div
        className="mt-8 rounded-2xl p-5"
        style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="flex items-start gap-3">
          <Quote size={16} style={{ color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm italic leading-relaxed mb-2" style={{ color: "#a5b4fc" }}>
              &ldquo;Communication is not about being perfect — it&apos;s about being
              present, clear, and genuinely interested in the other person.&rdquo;
            </p>
            <p className="text-xs" style={{ color: "#4a5980" }}>
              — Matt Abrahams, Think Fast, Talk Smart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
