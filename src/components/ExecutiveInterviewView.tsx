"use client";

import { useState, useMemo } from "react";
import { Building2, ChevronDown, ChevronUp, Play, BookMarked, Trophy, Shield, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { scenarios, companyProfiles, roleLevelProfiles, type CompanyKey, type RoleLevel } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import type { View } from "@/app/page";

interface Props {
  setActiveView: (v: View) => void;
  setPreselectedScenarioId?: (id: string | null) => void;
}

const COMPANY_CONFIG: { id: CompanyKey; initial: string; color: string; name: string }[] = [
  { id: "general", initial: "All", color: "#818cf8", name: "General" },
  { id: "google", initial: "G", color: "#4285F4", name: "Google" },
  { id: "amazon", initial: "A", color: "#FF9900", name: "Amazon" },
  { id: "microsoft", initial: "M", color: "#00A4EF", name: "Microsoft" },
  { id: "meta", initial: "Me", color: "#0082FB", name: "Meta" },
  { id: "apple", initial: "Ap", color: "#888888", name: "Apple" },
];

const ROLE_LEVELS: { id: RoleLevel; label: string; scope: string }[] = [
  { id: "director", label: "Director", scope: "Manages managers · 20–100 people" },
  { id: "vp", label: "VP", scope: "P&L owner · 100–500 people" },
];

function QuestionCard({
  scenario: s,
  onPractice,
  progress,
}: {
  scenario: import("@/lib/data").Scenario;
  onPractice: () => void;
  progress: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = progress.includes(s.id);
  const companyColor = COMPANY_CONFIG.find((c) => s.companies?.includes(c.id))?.color ?? "#818cf8";

  return (
    <div className="rounded-2xl p-5 transition-all" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {s.companies?.slice(0, 2).map((c) => {
              const co = COMPANY_CONFIG.find((cc) => cc.id === c);
              return co ? (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: co.color + "22", color: co.color }}>
                  {co.name}
                </span>
              ) : null;
            })}
            {s.roleLevel?.map((rl) => (
              <span key={rl} className="text-xs px-2 py-0.5 rounded-full capitalize"
                style={{ background: "#1e2d4a", color: "#6b7fa3" }}>
                {rl}
              </span>
            ))}
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#34d39922", color: "#34d399" }}>
                Practiced
              </span>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug">{s.title}</h3>
          {s.leadershipPrinciple && (
            <p className="text-xs mt-1" style={{ color: companyColor }}>LP: {s.leadershipPrinciple}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs" style={{ color: "#4a5980" }}>{Math.round(s.timeLimit / 60)} min</span>
        </div>
      </div>

      <p className="text-xs mb-3" style={{ color: "#6b7fa3" }}>{s.context}</p>

      {s.answerFrameworkHint && (
        <div className="rounded-xl px-3 py-2 mb-3 flex items-start gap-2"
          style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
          <Shield size={12} className="mt-0.5 shrink-0" style={{ color: "#818cf8" }} />
          <p className="text-xs" style={{ color: "#818cf8" }}>{s.answerFrameworkHint}</p>
        </div>
      )}

      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs mb-3 transition-colors"
        style={{ color: "#4a5980" }}>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Hide details" : "View key points"}
      </button>

      {expanded && (
        <div className="space-y-3 mb-3">
          <div className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#34d399" }}>Key Points to Hit</p>
            <ul className="space-y-1">
              {s.keyPoints.map((kp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={10} className="mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                  <span className="text-xs" style={{ color: "#6b7fa3" }}>{kp}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#f87171" }}>Common Mistakes</p>
            <ul className="space-y-1">
              {s.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle size={10} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                  <span className="text-xs" style={{ color: "#6b7fa3" }}>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#fbbf24" }}>Expert Tip</p>
            <p className="text-xs italic" style={{ color: "#6b7fa3" }}>{s.expertTip}</p>
          </div>
        </div>
      )}

      <button onClick={onPractice}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
        <Play size={14} />
        Practice This Question
      </button>
    </div>
  );
}

function CompanyIntelTab({ companyId }: { companyId: CompanyKey }) {
  const profile = companyProfiles.find((p) => p.id === companyId);
  if (!profile) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: profile.color + "33", color: profile.color }}>
            {profile.initial}
          </div>
          <div>
            <h2 className="font-bold text-white">{profile.name}</h2>
            <p className="text-xs italic" style={{ color: "#6b7fa3" }}>"{profile.tagline}"</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7fa3" }}>{profile.interviewStyle}</p>
      </div>

      {/* Hiring Bar Notes */}
      <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} style={{ color: "#fbbf24" }} />
          <h3 className="font-semibold text-white">The Hiring Bar</h3>
        </div>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>{profile.hiringBarNotes}</p>
      </div>

      {/* Green Flags / Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #34d39933" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} style={{ color: "#34d399" }} />
            <h3 className="font-semibold text-white">Green Flags</h3>
          </div>
          <ul className="space-y-2">
            {profile.greenFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                <span className="text-xs" style={{ color: "#6b7fa3" }}>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #f8717133" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={14} style={{ color: "#f87171" }} />
            <h3 className="font-semibold text-white">Red Flags</h3>
          </div>
          <ul className="space-y-2">
            {profile.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle size={12} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                <span className="text-xs" style={{ color: "#6b7fa3" }}>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Values / Leadership Principles */}
      <div>
        <h3 className="font-semibold text-white mb-3">
          {profile.id === "amazon" ? "Amazon's 16 Leadership Principles" : `${profile.name} Values`}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {profile.values.map((value) => (
            <div key={value.name} className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: profile.color }} />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{value.name}</p>
                  <p className="text-xs mb-2" style={{ color: "#6b7fa3" }}>{value.description}</p>
                  <div className="rounded-lg px-3 py-2" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
                    <p className="text-xs" style={{ color: "#4a5980" }}>
                      <span style={{ color: "#818cf8" }}>Example Q: </span>
                      {value.exampleQuestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryMappingTab({
  companyId,
  stories,
  onAddStory,
}: {
  companyId: CompanyKey;
  stories: ReturnType<typeof useProgress>["stories"];
  onAddStory: () => void;
}) {
  const QUESTION_TYPE_MAP = [
    { type: "leadership", label: "Leadership", description: "Leading people, teams, and culture" },
    { type: "ambiguity", label: "Ambiguity", description: "Navigating uncertainty and incomplete information" },
    { type: "impact", label: "Impact", description: "Measurable business outcomes you drove" },
    { type: "failure", label: "Failure & Learning", description: "Times you fell short and what you changed" },
    { type: "innovation", label: "Innovation", description: "Inventing new approaches or simplifying complexity" },
    { type: "collaboration", label: "Collaboration", description: "Influencing and aligning cross-functionally" },
    { type: "growth", label: "Growth & Learning", description: "How you've evolved as a leader" },
    { type: "culture", label: "Culture", description: "Building and maintaining team/org culture" },
  ];

  const relevantStories = companyId === "general"
    ? stories
    : stories.filter((s) => s.companiesRelevant.includes(companyId) || s.companiesRelevant.includes("general"));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <p className="text-sm font-semibold text-white mb-1">Map Your Stories to Question Types</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          For each question category, you should have at least one strong story ready. Gaps mean interview risk.
        </p>
      </div>

      {QUESTION_TYPE_MAP.map(({ type, label, description }) => {
        const matching = relevantStories.filter((s) => s.questionTypes.includes(type));
        const hasGap = matching.length === 0;

        return (
          <div key={type} className="rounded-2xl p-4"
            style={{ background: "#0d1426", border: `1px solid ${hasGap ? "#f8717133" : "#1e2d4a"}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  {hasGap
                    ? <AlertCircle size={14} style={{ color: "#f87171" }} />
                    : <CheckCircle size={14} style={{ color: "#34d399" }} />}
                  <span className="text-sm font-semibold text-white">{label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: hasGap ? "#f8717122" : "#34d39922", color: hasGap ? "#f87171" : "#34d399" }}>
                    {matching.length} {matching.length === 1 ? "story" : "stories"}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#4a5980" }}>{description}</p>
              </div>
              {hasGap && (
                <button onClick={onAddStory}
                  className="text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                  style={{ background: "#818cf822", color: "#818cf8" }}>
                  <ArrowRight size={10} />
                  Add Story
                </button>
              )}
            </div>

            {matching.length > 0 && (
              <div className="mt-2 space-y-1">
                {matching.map((story) => (
                  <div key={story.id} className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: story.strengthScore >= 70 ? "#34d399" : story.strengthScore >= 40 ? "#fbbf24" : "#f87171" }} />
                    <span className="text-xs text-white flex-1">{story.title}</span>
                    <span className="text-xs" style={{ color: "#4a5980" }}>{story.strengthScore}/100</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoleLevelCard({ level }: { level: typeof roleLevelProfiles[0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white">{level.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "#6b7fa3" }}>{level.scopeDescription}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-[#1e2d4a]">
          {expanded ? <ChevronUp size={14} style={{ color: "#6b7fa3" }} /> : <ChevronDown size={14} style={{ color: "#6b7fa3" }} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Core Competencies", items: level.coreCompetencies, color: "#818cf8" },
            { title: "Signature Behaviors", items: level.signatureBehaviors, color: "#34d399" },
            { title: "Common Gaps", items: level.commonGaps, color: "#f87171" },
            { title: "Typical Interview Questions", items: level.typicalQuestions, color: "#fbbf24" },
          ].map(({ title, items, color }) => (
            <div key={title} className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
              <p className="text-xs font-semibold mb-2" style={{ color }}>{title}</p>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-xs" style={{ color: "#6b7fa3" }}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExecutiveInterviewView({ setActiveView, setPreselectedScenarioId }: Props) {
  const { stories, progress, faangReadinessScore } = useProgress();
  const [selectedCompany, setSelectedCompany] = useState<CompanyKey>("general");
  const [selectedLevel, setSelectedLevel] = useState<RoleLevel>("director");
  const [activeTab, setActiveTab] = useState<"questions" | "company" | "storymap" | "roleprofile">("questions");

  const filteredScenarios = useMemo(() =>
    scenarios.filter((s) => {
      if (!s.isExecutive) return false;
      const companyMatch = selectedCompany === "general" || !s.companies || s.companies.includes(selectedCompany) || s.companies.includes("general");
      const levelMatch = !s.roleLevel || s.roleLevel.includes(selectedLevel);
      return companyMatch && levelMatch;
    }),
    [selectedCompany, selectedLevel]
  );

  const handlePractice = (scenarioId: string) => {
    if (setPreselectedScenarioId) setPreselectedScenarioId(scenarioId);
    setActiveView("practice");
  };

  const tabs = [
    { id: "questions" as const, label: `Questions (${filteredScenarios.length})` },
    { id: "company" as const, label: "Company Intel" },
    { id: "storymap" as const, label: "Story Mapping" },
    { id: "roleprofile" as const, label: "Role Profile" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Executive Interview Prep
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">FAANG Interview Prep Hub</h1>
            <p className="text-sm" style={{ color: "#6b7fa3" }}>
              Company-specific question banks, leadership principles, and story mapping for Director and VP interviews.
            </p>
          </div>
          <div className="rounded-xl px-4 py-2 text-center" style={{ background: "#fbbf2422", border: "1px solid #fbbf2444" }}>
            <p className="text-xl font-bold" style={{ color: "#fbbf24" }}>{faangReadinessScore}</p>
            <p className="text-xs" style={{ color: "#6b7fa3" }}>Readiness</p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Company Selector */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Target Company</p>
          <div className="flex flex-wrap gap-2">
            {COMPANY_CONFIG.map((co) => (
              <button key={co.id} onClick={() => setSelectedCompany(co.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
                style={{
                  background: selectedCompany === co.id ? co.color + "33" : "#0d1426",
                  border: `1px solid ${selectedCompany === co.id ? co.color : "#1e2d4a"}`,
                  color: selectedCompany === co.id ? co.color : "#6b7fa3",
                }}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: co.color + "33", color: co.color }}>
                  {co.initial}
                </span>
                {co.name}
              </button>
            ))}
          </div>
        </div>

        {/* Role Level Selector */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Target Role Level</p>
          <div className="flex gap-3">
            {ROLE_LEVELS.map((rl) => (
              <button key={rl.id} onClick={() => setSelectedLevel(rl.id)}
                className="flex-1 rounded-xl p-3 text-left transition-all"
                style={{
                  background: selectedLevel === rl.id ? "#818cf822" : "#0d1426",
                  border: `1px solid ${selectedLevel === rl.id ? "#818cf8" : "#1e2d4a"}`,
                }}>
                <p className="text-sm font-semibold" style={{ color: selectedLevel === rl.id ? "#818cf8" : "#e8eaf0" }}>
                  {rl.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#4a5980" }}>{rl.scope}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: "#1e2d4a" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap"
            style={{ color: activeTab === tab.id ? "#818cf8" : "#6b7fa3" }}>
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: "#818cf8" }} />
            )}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs" style={{ color: "#6b7fa3" }}>
              Showing <span className="font-semibold text-white">{filteredScenarios.length}</span> questions for{" "}
              <span style={{ color: "#818cf8" }}>
                {COMPANY_CONFIG.find((c) => c.id === selectedCompany)?.name} · {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
              </span>
            </p>
          </div>
          {filteredScenarios.length === 0 ? (
            <div className="text-center py-12" style={{ color: "#6b7fa3" }}>
              <Building2 size={40} className="mx-auto mb-3" style={{ color: "#1e2d4a" }} />
              <p>No scenarios match this filter. Try selecting "General" or a different level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScenarios.map((s) => (
                <QuestionCard
                  key={s.id}
                  scenario={s}
                  onPractice={() => handlePractice(s.id)}
                  progress={progress?.scenariosCompleted ?? []}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Company Intel Tab */}
      {activeTab === "company" && (
        <CompanyIntelTab companyId={selectedCompany} />
      )}

      {/* Story Mapping Tab */}
      {activeTab === "storymap" && (
        <StoryMappingTab
          companyId={selectedCompany}
          stories={stories}
          onAddStory={() => setActiveView("story-bank")}
        />
      )}

      {/* Role Profile Tab */}
      {activeTab === "roleprofile" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <p className="text-sm" style={{ color: "#6b7fa3" }}>
              Understand the competency bar for each level. Senior hiring managers assess candidates against these profiles — even if they never say so explicitly.
            </p>
          </div>
          {roleLevelProfiles.map((profile) => (
            <RoleLevelCard key={profile.level} level={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
