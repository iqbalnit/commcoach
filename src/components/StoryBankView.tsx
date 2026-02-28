"use client";

import { useState, useMemo } from "react";
import { useProgress, type StoryData } from "@/lib/useProgress";
import { BookMarked, Plus, Trash2, Edit3, ChevronDown, ChevronUp, Lightbulb, CheckCircle, AlertCircle, X, Sparkles } from "lucide-react";
import AIStoryGeneratorPanel from "@/components/AIStoryGeneratorPanel";
import { useSession, signIn } from "next-auth/react";
import type { CompanyKey, StoryCategory } from "@/lib/data";

const CATEGORIES: { id: StoryCategory; label: string; color: string }[] = [
  { id: "impact", label: "Impact", color: "#818cf8" },
  { id: "innovation", label: "Innovation", color: "#38bdf8" },
  { id: "leadership", label: "Leadership", color: "#a78bfa" },
  { id: "resilience", label: "Resilience", color: "#f87171" },
  { id: "collaboration", label: "Collaboration", color: "#34d399" },
];

const QUESTION_TYPES = [
  "leadership", "ambiguity", "impact", "failure", "innovation",
  "collaboration", "growth", "vision", "technical", "culture",
];

const COMPANIES: { id: CompanyKey; label: string; color: string }[] = [
  { id: "google", label: "Google", color: "#4285F4" },
  { id: "amazon", label: "Amazon", color: "#FF9900" },
  { id: "microsoft", label: "Microsoft", color: "#00A4EF" },
  { id: "meta", label: "Meta", color: "#0082FB" },
  { id: "apple", label: "Apple", color: "#888888" },
  { id: "general", label: "General", color: "#818cf8" },
];

function computeStrengthScore(form: Partial<FormState>): number {
  let score = 0;
  if ((form.situation?.length ?? 0) > 100) score += 15;
  if ((form.task?.length ?? 0) > 80) score += 20;
  if ((form.action?.length ?? 0) > 200) score += 25;
  if ((form.result?.length ?? 0) > 100) score += 20;
  if (form.impact && /\d/.test(form.impact)) score += 10;
  if ((form.questionTypes?.length ?? 0) >= 2) score += 10;
  return Math.min(score, 100);
}

interface FormState {
  title: string;
  category: StoryCategory;
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  companiesRelevant: CompanyKey[];
  questionTypes: string[];
  tags: string[];
  notes: string;
}

const emptyForm = (): FormState => ({
  title: "",
  category: "impact",
  situation: "",
  task: "",
  action: "",
  result: "",
  impact: "",
  companiesRelevant: [],
  questionTypes: [],
  tags: [],
  notes: "",
});

function StrengthMeter({ score }: { score: number }) {
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";
  const label = score >= 70 ? "Strong" : score >= 40 ? "Developing" : "Needs Work";
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: "#6b7fa3" }}>Story Strength</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/100 — {label}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#1e2d4a" }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

function StoryCard({
  story,
  onEdit,
  onDelete,
}: {
  story: StoryData;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === story.category);

  return (
    <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {cat && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: cat.color + "22", color: cat.color }}>
                {cat.label}
              </span>
            )}
            {story.companiesRelevant.slice(0, 3).map((c) => {
              const co = COMPANIES.find((co) => co.id === c);
              return co ? (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: co.color + "22", color: co.color }}>
                  {co.label}
                </span>
              ) : null;
            })}
          </div>
          <h3 className="font-semibold text-white text-sm">{story.title}</h3>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={onEdit} className="p-1.5 rounded-lg transition-colors hover:bg-[#1e2d4a]"
            title="Edit story">
            <Edit3 size={14} style={{ color: "#6b7fa3" }} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "#f8717122", color: "#f87171" }}>Delete</button>
              <button onClick={() => setConfirmDelete(false)} className="p-1.5 rounded-lg hover:bg-[#1e2d4a]">
                <X size={12} style={{ color: "#6b7fa3" }} />
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg transition-colors hover:bg-[#1e2d4a]"
              title="Delete story">
              <Trash2 size={14} style={{ color: "#6b7fa3" }} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <StrengthMeter score={story.strengthScore} />
      </div>

      <p className="text-xs mb-3 line-clamp-2" style={{ color: "#6b7fa3" }}>
        {story.result || "No result recorded yet."}
      </p>

      {story.questionTypes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {story.questionTypes.map((qt) => (
            <span key={qt} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#1e2d4a", color: "#4a5980" }}>
              {qt}
            </span>
          ))}
        </div>
      )}

      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs transition-colors"
        style={{ color: "#818cf8" }}>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "Collapse" : "View Full Story"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {[
            { label: "Situation", value: story.situation },
            { label: "Task", value: story.task },
            { label: "Action", value: story.action },
            { label: "Result", value: story.result },
            { label: "Impact", value: story.impact },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#818cf8" }}>{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#e8eaf0" }}>{value || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type RequiredStarField = "title" | "situation" | "task" | "action" | "result" | "impact";
const REQUIRED_FIELDS: RequiredStarField[] = ["title", "situation", "task", "action", "result", "impact"];

function getFieldError(key: RequiredStarField, value: string): string | null {
  if (!value.trim()) {
    const labels: Record<RequiredStarField, string> = {
      title: "Story Title",
      situation: "Situation",
      task: "Task",
      action: "Action",
      result: "Result",
      impact: "Business Impact",
    };
    return `${labels[key]} is required`;
  }
  return null;
}

function StoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: StoryData | null;
  onSave: (form: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          category: initial.category as StoryCategory,
          situation: initial.situation,
          task: initial.task,
          action: initial.action,
          result: initial.result,
          impact: initial.impact,
          companiesRelevant: initial.companiesRelevant,
          questionTypes: initial.questionTypes,
          tags: initial.tags,
          notes: initial.notes,
        }
      : emptyForm()
  );

  // Track which fields the user has visited (to avoid showing errors before touching a field)
  const [touched, setTouched] = useState<Partial<Record<RequiredStarField, boolean>>>({});
  // When user clicks Save, mark all fields as touched to reveal all errors
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const score = useMemo(() => computeStrengthScore(form), [form]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (key: RequiredStarField) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const toggleArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  // Compute all errors across required fields
  const errors: Partial<Record<RequiredStarField, string>> = {};
  for (const key of REQUIRED_FIELDS) {
    const err = getFieldError(key, form[key] as string);
    if (err) errors[key] = err;
  }
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = () => {
    if (hasErrors) {
      // Reveal all errors at once
      setSubmitAttempted(true);
      return;
    }
    onSave(form);
  };

  const showError = (key: RequiredStarField) =>
    !!errors[key] && (touched[key] || submitAttempted);

  const textareaClass = "w-full rounded-xl p-3 text-sm resize-none outline-none transition-colors";
  const inputBorder = (key: RequiredStarField) =>
    showError(key) ? "1px solid #f87171" : "1px solid #1e2d4a";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <div className="flex items-center gap-2 mb-4">
          <BookMarked size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            {initial ? "Edit Story" : "New Story"}
          </span>
        </div>

        <div className="space-y-4">
          {/* Title + Category */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1" style={{ color: "#6b7fa3" }}>
                Story Title <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                onBlur={() => markTouched("title")}
                placeholder="e.g. Led the Q3 platform migration"
                className="w-full rounded-xl p-3 text-sm outline-none transition-colors"
                style={{ background: "#111827", border: inputBorder("title"), color: "#e8eaf0" }}
              />
              {showError("title") && (
                <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                  <AlertCircle size={11} /> {errors.title}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "#6b7fa3" }}>Category</label>
              <select value={form.category}
                onChange={(e) => updateField("category", e.target.value as StoryCategory)}
                className="rounded-xl p-3 text-sm outline-none"
                style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* STAR Sections */}
          {([
            { key: "situation" as const, label: "Situation", hint: "Set the scene — when, where, what was happening? (suggest 100+ chars)", rows: 3 },
            { key: "task" as const, label: "Task", hint: "What was your specific responsibility? (suggest 80+ chars)", rows: 3 },
            { key: "action" as const, label: "Action", hint: "What exactly did YOU do? This is the heart of your story — be specific and use 'I', not 'we'. (suggest 200+ chars)", rows: 5 },
            { key: "result" as const, label: "Result", hint: "What happened? Quantify whenever possible. (suggest 100+ chars)", rows: 3 },
            { key: "impact" as const, label: "Business Impact", hint: "Quantify the impact — revenue, cost, efficiency, customers, etc. Include at least one number.", rows: 2 },
          ] as { key: RequiredStarField; label: string; hint: string; rows: number }[]).map(({ key, label, hint, rows }) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-1" style={{ color: "#6b7fa3" }}>
                {label} <span style={{ color: "#f87171" }}>*</span>
                {key === "action" && <span style={{ color: "#818cf8" }}> — The Heavy Lifting</span>}
              </label>
              <p className="text-xs mb-1" style={{ color: "#4a5980" }}>{hint}</p>
              <textarea
                value={form[key] as string}
                onChange={(e) => updateField(key, e.target.value)}
                onBlur={() => markTouched(key)}
                rows={rows}
                className={textareaClass}
                style={{ background: "#111827", border: inputBorder(key), color: "#e8eaf0" }}
              />
              <div className="flex justify-between items-center mt-0.5">
                {showError(key) ? (
                  <p className="flex items-center gap-1 text-xs" style={{ color: "#f87171" }}>
                    <AlertCircle size={11} /> {errors[key]}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs" style={{ color: "#4a5980" }}>
                  {(form[key] as string).length} chars
                </span>
              </div>
            </div>
          ))}

          {/* Company Relevance */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Relevant Companies</label>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((co) => {
                const active = form.companiesRelevant.includes(co.id);
                return (
                  <button key={co.id} onClick={() => updateField("companiesRelevant", toggleArray(form.companiesRelevant, co.id))}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: active ? co.color + "33" : "#111827",
                      border: `1px solid ${active ? co.color : "#1e2d4a"}`,
                      color: active ? co.color : "#6b7fa3",
                    }}>
                    {co.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "#6b7fa3" }}>Question Types This Story Answers</label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((qt) => {
                const active = form.questionTypes.includes(qt);
                return (
                  <button key={qt} onClick={() => updateField("questionTypes", toggleArray(form.questionTypes, qt))}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all capitalize"
                    style={{
                      background: active ? "#818cf822" : "#111827",
                      border: `1px solid ${active ? "#818cf8" : "#1e2d4a"}`,
                      color: active ? "#818cf8" : "#6b7fa3",
                    }}>
                    {qt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strength Score Preview */}
          <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
            <StrengthMeter score={score} />
            <p className="text-xs mt-2" style={{ color: "#4a5980" }}>
              Tip: Add specific numbers to Impact (+10), expand your Action section (+25), and select 2+ question types (+10) to boost your score.
            </p>
          </div>
        </div>
      </div>

      {/* Error summary shown only after submit attempt */}
      {submitAttempted && hasErrors && (
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: "#f8717115", border: "1px solid #f8717140" }}>
          <AlertCircle size={14} style={{ color: "#f87171", marginTop: 1, flexShrink: 0 }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#f87171" }}>Please fill in all required fields:</p>
            <ul className="text-xs space-y-0.5" style={{ color: "#fca5a5" }}>
              {(Object.entries(errors) as [RequiredStarField, string][]).map(([, msg]) => (
                <li key={msg}>• {msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            opacity: hasErrors && submitAttempted ? 0.6 : 1,
            cursor: "pointer",
          }}>
          {initial ? "Update Story" : "Save Story"}
        </button>
        <button onClick={onCancel} className="px-6 py-3 rounded-xl text-sm"
          style={{ background: "#1e2d4a", color: "#6b7fa3" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function StoryBankView() {
  const { data: session } = useSession();
  const { stories, loading, isAuthenticated, addStory, updateStory, deleteStory } = useProgress();
  const [activeTab, setActiveTab] = useState<"stories" | "add" | "generate" | "tips">("stories");
  const [filterCategory, setFilterCategory] = useState<StoryCategory | "all">("all");
  const [editingStory, setEditingStory] = useState<StoryData | null>(null);

  const filtered = useMemo(
    () => filterCategory === "all" ? stories : stories.filter((s) => s.category === filterCategory),
    [stories, filterCategory]
  );

  const handleSave = async (form: FormState) => {
    if (editingStory) {
      await updateStory(editingStory.id, form);
    } else {
      await addStory({ ...form, lastPracticed: null });
    }
    setEditingStory(null);
    setActiveTab("stories");
  };

  const handleEdit = (story: StoryData) => {
    setEditingStory(story);
    setActiveTab("add");
  };

  if (!session) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96">
        <BookMarked size={48} style={{ color: "#818cf8" }} className="mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Sign In to Access Your Story Bank</h2>
        <p className="text-sm mb-6 text-center max-w-sm" style={{ color: "#6b7fa3" }}>
          Your personal story library is saved to your account so you can access it across devices and sessions.
        </p>
        <button onClick={() => signIn("google")}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
          Sign in with Google
        </button>
      </div>
    );
  }

  const tabs: { id: "stories" | "add" | "generate" | "tips"; label: string; badge?: string }[] = [
    { id: "stories", label: `My Stories (${stories.length})` },
    { id: "add", label: editingStory ? "Edit Story" : "Add Story" },
    { id: "generate", label: "AI Generate", badge: "AI" },
    { id: "tips", label: "Tips" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookMarked size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Story Bank
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Leadership Story Bank</h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Build, refine, and map your strongest STAR stories for executive interviews. Aim for 5+ strong stories across all categories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: "#1e2d4a" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => {
            if (tab.id !== "add") setEditingStory(null);
            setActiveTab(tab.id);
          }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === tab.id ? "#818cf8" : "#6b7fa3" }}>
            {tab.label}
            {tab.badge && (
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 9 }}>
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: "#818cf8" }} />
            )}
          </button>
        ))}
      </div>

      {/* Stories Tab */}
      {activeTab === "stories" && (
        <div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-5">
            <button onClick={() => setFilterCategory("all")}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: filterCategory === "all" ? "#818cf822" : "#0d1426", border: `1px solid ${filterCategory === "all" ? "#818cf8" : "#1e2d4a"}`, color: filterCategory === "all" ? "#818cf8" : "#6b7fa3" }}>
              All ({stories.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = stories.filter((s) => s.category === cat.id).length;
              return (
                <button key={cat.id} onClick={() => setFilterCategory(cat.id)}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: filterCategory === cat.id ? cat.color + "22" : "#0d1426", border: `1px solid ${filterCategory === cat.id ? cat.color : "#1e2d4a"}`, color: filterCategory === cat.id ? cat.color : "#6b7fa3" }}>
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-16" style={{ color: "#6b7fa3" }}>Loading your stories…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookMarked size={40} className="mx-auto mb-4" style={{ color: "#1e2d4a" }} />
              <p className="text-white font-semibold mb-2">No stories yet</p>
              <p className="text-sm mb-4" style={{ color: "#6b7fa3" }}>
                Add your first leadership story to get started. Aim for 5 strong stories before your FAANG interviews.
              </p>
              <button onClick={() => setActiveTab("add")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
                Add Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((story) => (
                <StoryCard key={story.id} story={story}
                  onEdit={() => handleEdit(story)}
                  onDelete={() => deleteStory(story.id)} />
              ))}
              <button onClick={() => { setEditingStory(null); setActiveTab("add"); }}
                className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-colors"
                style={{ border: "1px dashed #1e2d4a", color: "#4a5980" }}>
                <Plus size={24} />
                <span className="text-sm">Add Story</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Tab */}
      {activeTab === "add" && (
        <StoryForm
          initial={editingStory}
          onSave={handleSave}
          onCancel={() => { setEditingStory(null); setActiveTab("stories"); }}
        />
      )}

      {/* AI Generate Tab */}
      {activeTab === "generate" && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={14} style={{ color: "#818cf8" }} />
            <h2 className="text-sm font-semibold text-white">AI Story Generator</h2>
          </div>
          <AIStoryGeneratorPanel />
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} style={{ color: "#fbbf24" }} />
              <h3 className="font-semibold text-white">STAR Story Best Practices</h3>
            </div>
            <div className="space-y-2">
              {[
                "Lead with context (Situation), not with yourself — ground the listener first",
                "Use 'I' not 'we' when describing your specific actions — interviewers are assessing YOU",
                "The Action section should be 50%+ of your story — it's where you earn your score",
                "Every story needs a number in the Result — 'it went well' is a failing answer at exec level",
                "Practice each story out loud until it flows in under 2.5 minutes",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                  <p className="text-sm" style={{ color: "#6b7fa3" }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <h3 className="font-semibold text-white mb-3">What Makes a 9/10 Story?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Specific numbers", desc: "Revenue, %, headcount, time saved" },
                { label: "Your individual action", desc: "Not the team — what YOU specifically did" },
                { label: "Genuine stakes", desc: "What would have happened if you failed?" },
                { label: "Learning + growth", desc: "Especially for Amazon LP questions" },
                { label: "Compelling narrative arc", desc: "Challenge → struggle → insight → win" },
                { label: "Under 2.5 minutes", desc: "Crisp, not rambling" },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
                  <p className="text-xs font-semibold text-white mb-1">{label}</p>
                  <p className="text-xs" style={{ color: "#6b7fa3" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} style={{ color: "#f87171" }} />
              <h3 className="font-semibold text-white">Common Story Mistakes</h3>
            </div>
            {[
              { mistake: "The 'we' trap", fix: "Replace 'we' with 'I' when describing YOUR actions. The team context is fine — your actions should use 'I'." },
              { mistake: "Vague results", fix: "'The project was successful' is not a result. 'We delivered 3 weeks early, saving $400K in contractor costs' is." },
              { mistake: "The non-failure failure", fix: "At Amazon, 'I worked too hard and got burned out' is not a failure. Find a story where you were genuinely wrong or fell short." },
              { mistake: "The team story", fix: "Interviewers are assessing you. Choose stories where your individual judgment, decision, or action was the decisive factor." },
            ].map(({ mistake, fix }) => (
              <div key={mistake} className="mb-3 last:mb-0 rounded-xl p-3" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#f87171" }}>{mistake}</p>
                <p className="text-xs" style={{ color: "#6b7fa3" }}>{fix}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
            <h3 className="font-semibold text-white mb-3">Story Categories Explained</h3>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <p className="text-sm font-semibold" style={{ color: cat.color }}>{cat.label}</p>
                </div>
                <p className="text-xs" style={{ color: "#6b7fa3" }}>
                  {cat.id === "impact" && "Stories showing measurable business results: revenue, cost savings, efficiency, growth."}
                  {cat.id === "innovation" && "Stories about inventing new approaches, simplifying complex problems, or creating something novel."}
                  {cat.id === "leadership" && "Stories demonstrating leading people, building teams, and driving outcomes through others."}
                  {cat.id === "resilience" && "Stories about navigating failure, setbacks, ambiguity, or difficult circumstances."}
                  {cat.id === "collaboration" && "Stories showing cross-functional influence, team building, and alignment without authority."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
