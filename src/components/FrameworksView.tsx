"use client";

import { useState } from "react";
import { frameworks, Framework } from "@/lib/data";
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Target, Lightbulb } from "lucide-react";

function FrameworkCard({ fw }: { fw: Framework }) {
  const [expanded, setExpanded] = useState(false);

  const stepColors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b"];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl font-bold flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)",
              color: "#818cf8",
              fontFamily: "monospace",
              fontSize: 13,
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            {fw.acronym.length > 4 ? fw.id.slice(0, 3).toUpperCase() : fw.acronym}
          </div>
          <div>
            <div className="text-base font-semibold text-white">{fw.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "#4a5980" }}>
              {fw.source}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {fw.steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{ width: 6, height: 6, background: stepColors[i % stepColors.length] }}
              />
            ))}
          </div>
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
          {fw.description}
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 fade-in">
          {/* Steps */}
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a5980" }}>
              The Steps
            </div>
            <div className="flex flex-col gap-3">
              {fw.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ background: "#111827", border: "1px solid #1e2d4a" }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 text-white"
                    style={{
                      width: 32,
                      height: 32,
                      background: stepColors[i % stepColors.length],
                      fontSize: 10,
                    }}
                  >
                    {step.label.slice(0, 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{step.label}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "#6b7fa3" }}>
                      {step.description}
                    </p>
                    <div
                      className="text-xs italic px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        color: "#a5b4fc",
                        borderLeft: "2px solid rgba(99,102,241,0.4)",
                      }}
                    >
                      &ldquo;{step.example}&rdquo;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use cases and tips */}
          <div className="grid grid-cols-2 gap-4">
            {/* Use cases */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#111827", border: "1px solid #1e2d4a" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target size={12} style={{ color: "#34d399" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                  Use When
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {fw.useCases.map((u, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b7fa3" }}>
                    <CheckCircle2 size={10} style={{ color: "#34d399", marginTop: 2, flexShrink: 0 }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#111827", border: "1px solid #1e2d4a" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={12} style={{ color: "#fbbf24" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>
                  Pro Tips
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {fw.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b7fa3" }}>
                    <span style={{ color: "#fbbf24", flexShrink: 0 }}>→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FrameworksView() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Communication Frameworks
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Proven Structures for Every Situation
        </h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Frameworks from McKinsey, behavioral interview research, and executive leadership training. Click any framework to explore steps, examples, and when to use it.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.id} fw={fw} />
        ))}
      </div>
    </div>
  );
}
