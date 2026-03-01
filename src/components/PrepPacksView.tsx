"use client";

import { useState } from "react";
import { View } from "@/app/page";
import { companyProfiles, frameworks } from "@/lib/data";
import { prepPackExtensions, type PrepPackCompanyKey } from "@/lib/prepPacksData";
import {
  Briefcase,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react";

interface PrepPacksViewProps {
  setActiveView: (v: View) => void;
}

const COMPANY_ORDER: PrepPackCompanyKey[] = ["google", "amazon", "microsoft", "meta", "apple"];
type Tab = "principles" | "questions" | "tips" | "culture";

function ValueCard({ value }: { value: { name: string; description: string; exampleQuestion: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-white">{value.name}</span>
        {open ? (
          <ChevronUp size={14} style={{ color: "#4a5980", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={14} style={{ color: "#4a5980", flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#9ca3af" }}>
            {value.description}
          </p>
          <div
            className="rounded-lg px-3 py-2 flex items-start gap-2"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            <HelpCircle size={11} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs italic" style={{ color: "#fbbf24" }}>
              {value.exampleQuestion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PrepPacksView({ setActiveView }: PrepPacksViewProps) {
  const [selectedCompany, setSelectedCompany] = useState<PrepPackCompanyKey>("google");
  const [activeTab, setActiveTab] = useState<Tab>("principles");

  const profile = companyProfiles.find((c) => c.id === selectedCompany)!;
  const pack = prepPackExtensions[selectedCompany];

  const linkedFrameworks = frameworks.filter((f) =>
    pack.linkedFrameworkIds.includes(f.id)
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "principles", label: "Leadership Principles" },
    { id: "questions", label: "Must-Know Questions" },
    { id: "tips", label: "Insider Tips" },
    { id: "culture", label: "Culture" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Prep Packs
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Company Prep Packs</h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Deep-dive preparation guides for FAANG and tier-1 companies.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left — Company Selector */}
        <div className="flex flex-col gap-2" style={{ width: 200, flexShrink: 0 }}>
          {COMPANY_ORDER.map((key) => {
            const p = companyProfiles.find((c) => c.id === key)!;
            const isActive = selectedCompany === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedCompany(key);
                  setActiveTab("principles");
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all"
                style={{
                  background: isActive ? `${p.color}15` : "#0d1426",
                  border: isActive ? `1px solid ${p.color}50` : "1px solid #1e2d4a",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: isActive ? p.color : "#1e2d4a",
                    color: isActive ? "#fff" : "#4a5980",
                  }}
                >
                  {p.initial}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: isActive ? "#e8eaf0" : "#6b7fa3" }}
                >
                  {p.name}
                </span>
              </button>
            );
          })}

          {/* Linked frameworks */}
          {linkedFrameworks.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #1e2d4a" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#2a3560" }}>
                Key Frameworks
              </p>
              {linkedFrameworks.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setActiveView("frameworks")}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all hover:bg-indigo-900/20 mb-1"
                  style={{ color: "#6b7fa3" }}
                >
                  <BookOpen size={10} style={{ color: "#4a5980" }} />
                  {fw.acronym}
                  <ChevronRight size={10} className="ml-auto" style={{ color: "#2a3560" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Detail Panel */}
        <div className="flex-1 min-w-0">
          {/* Company header */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: `${profile.color}10`, border: `1px solid ${profile.color}30` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-2xl text-white text-xl font-bold flex-shrink-0"
                style={{ width: 52, height: 52, background: profile.color }}
              >
                {profile.initial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{profile.name}</h2>
                <p className="text-xs" style={{ color: "#9ca3af" }}>{profile.tagline}</p>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeTab === id ? `${profile.color}20` : "#0d1426",
                  color: activeTab === id ? profile.color : "#6b7fa3",
                  border: activeTab === id ? `1px solid ${profile.color}50` : "1px solid #1e2d4a",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Leadership Principles */}
          {activeTab === "principles" && (
            <div className="fade-in">
              <div className="flex flex-col gap-3 mb-6">
                {profile.values.map((v, i) => (
                  <ValueCard key={i} value={v} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Red flags */}
                <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={13} style={{ color: "#f87171" }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f87171" }}>
                      Red Flags
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {profile.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#9ca3af" }}>
                        <span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Green flags */}
                <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={13} style={{ color: "#34d399" }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                      Green Flags
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {profile.greenFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#9ca3af" }}>
                        <CheckCircle2 size={10} style={{ color: "#34d399", flexShrink: 0, marginTop: 1 }} />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Must-Know Questions */}
          {activeTab === "questions" && (
            <div className="fade-in flex flex-col gap-3">
              {pack.prepQuestions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-4"
                  style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0"
                    style={{ width: 28, height: 28, background: `${profile.color}20`, color: profile.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-relaxed">{q}</p>
                  </div>
                  <button
                    onClick={() => setActiveView("exec-interview")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                    style={{
                      background: `${profile.color}15`,
                      color: profile.color,
                      border: `1px solid ${profile.color}30`,
                    }}
                  >
                    Practice
                    <ChevronRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Insider Tips */}
          {activeTab === "tips" && (
            <div className="fade-in flex flex-col gap-3">
              {pack.insiderTips.map((tip, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{
                    background: "rgba(251,191,36,0.05)",
                    border: "1px solid rgba(251,191,36,0.15)",
                  }}
                >
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: 28, height: 28, background: "rgba(251,191,36,0.12)" }}>
                    <Lightbulb size={13} style={{ color: "#fbbf24" }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#c8d0e0" }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Culture */}
          {activeTab === "culture" && (
            <div className="fade-in flex flex-col gap-4">
              <div
                className="rounded-2xl p-5"
                style={{ background: `${profile.color}08`, border: `1px solid ${profile.color}25` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={13} style={{ color: profile.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: profile.color }}>
                    Culture Overview
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#c8d0e0" }}>
                  {pack.cultureNotes}
                </p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={13} style={{ color: "#818cf8" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
                    Interview Style
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                  {profile.interviewStyle}
                </p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={13} style={{ color: "#34d399" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>
                    Hiring Bar Notes
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                  {profile.hiringBarNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
