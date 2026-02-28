"use client";

import React, { useState } from "react";
import { useProgress } from "@/lib/useProgress";
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronUp,
  Send,
  RotateCcw,
} from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    id: "pixar-spine",
    name: "Pixar Spine",
    acronym: "Once Upon a Time…",
    steps: [
      { label: "Once upon a time", desc: "Set the scene — who, where, when" },
      { label: "Every day", desc: "Establish the normal routine" },
      { label: "Until one day", desc: "The inciting incident or challenge" },
      { label: "Because of that", desc: "Your actions and decisions" },
      { label: "Until finally", desc: "The resolution and result" },
      { label: "Ever since then", desc: "The lasting impact and lesson" },
    ],
    tip: "Forces you to build empathy before you reveal the challenge. Ideal for culture and leadership stories.",
  },
  {
    id: "hero-journey",
    name: "Hero's Journey (Exec Edit)",
    acronym: "Call → Ordeal → Return",
    steps: [
      { label: "The Call", desc: "The challenge or opportunity you faced" },
      { label: "The Threshold", desc: "What you risked or committed to" },
      { label: "The Ordeal", desc: "The hardest part — what you had to overcome" },
      { label: "The Transformation", desc: "What you learned or became" },
      { label: "The Return", desc: "How you applied that growth for the org" },
    ],
    tip: "Best for origin stories, turnarounds, and 'tell me about a failure' questions.",
  },
  {
    id: "data-story",
    name: "Data-Driven Story",
    acronym: "Context → Insight → Action",
    steps: [
      { label: "Context", desc: "The business situation and baseline metrics" },
      { label: "Complication", desc: "What the data revealed that was unexpected" },
      { label: "Insight", desc: "Your interpretation and the 'so what'" },
      { label: "Action", desc: "What decisions were made and by whom" },
      { label: "Outcome", desc: "Quantified results vs. baseline" },
    ],
    tip: "FAANG interviewers love this for product and strategy questions. Always anchor with numbers.",
  },
  {
    id: "sparkline",
    name: "The Sparkline",
    acronym: "What Is vs. What Could Be",
    steps: [
      { label: "What Is", desc: "The current state — challenges, constraints, reality" },
      { label: "What Could Be", desc: "Your vision of the better future" },
      { label: "Gap", desc: "What stands between now and the vision" },
      { label: "Call to Action", desc: "What you need from your audience" },
      { label: "New Bliss", desc: "Paint the transformed future state vividly" },
    ],
    tip: "Powerful for executive alignment presentations. Creates productive tension that motivates change.",
  },
  {
    id: "abt",
    name: "And-But-Therefore (ABT)",
    acronym: "ABT",
    steps: [
      { label: "And", desc: "Establish context — set up what was happening" },
      { label: "But", desc: "Introduce the conflict, constraint, or problem" },
      { label: "Therefore", desc: "Your response and the result you drove" },
    ],
    tip: "The shortest path from setup to payoff. Use when you need to be concise under pressure.",
  },
  {
    id: "wswnw",
    name: "What-So What-Now What",
    acronym: "W-SW-NW",
    steps: [
      { label: "What", desc: "What happened — the facts and situation" },
      { label: "So What", desc: "Why it matters — the significance and stakes" },
      { label: "Now What", desc: "What you did about it and the result" },
    ],
    tip: "Excellent for post-mortems, retrospectives, and 'lessons learned' executive updates.",
  },
];

const BOOK_SUMMARIES = [
  {
    title: "Story",
    author: "Robert McKee",
    keyInsights: [
      "Every great story is about a character in pursuit of something they deeply desire, opposed by an antagonistic force",
      "Substance of story is the gap between expectation and result — the moment things don't go as planned",
      "True character is revealed under pressure, not in calm moments",
    ],
    executiveApplication: "Use this to structure any 'tell me about a challenge' answer. The gap between your expectation and the reality IS the story.",
    takeaway: "\"Story is about eternal, universal forms, not formulas.\"",
  },
  {
    title: "Resonate",
    author: "Nancy Duarte",
    keyInsights: [
      "The best presentations move between 'what is' and 'what could be' — the sparkline structure",
      "Your audience is the hero. You are Yoda, not Luke Skywalker",
      "Great communicators create S-curves of tension and resolution",
    ],
    executiveApplication: "Before any major presentation, ask: Am I centering myself or my audience? Reframe every point around their gain.",
    takeaway: "\"Make the audience the hero of your story, not yourself.\"",
  },
  {
    title: "The Storyteller's Secret",
    author: "Carmine Gallo",
    keyInsights: [
      "The brain is wired for story — narrative activates more neural regions than bullet points",
      "The most inspiring leaders use personal stories to establish credibility and vulnerability",
      "Specific, sensory details trigger mirror neurons and create empathy",
    ],
    executiveApplication: "Replace one statistic in your next presentation with a specific individual story that illustrates that statistic.",
    takeaway: "\"Data is cold. Stories make data feel warm.\"",
  },
  {
    title: "Lead with a Story",
    author: "Paul Smith",
    keyInsights: [
      "Stories are 22x more memorable than facts alone",
      "Leaders need a portfolio: founding stories, vision stories, teaching stories, values-in-action stories",
      "The best teaching stories end with a question, not a conclusion",
    ],
    executiveApplication: "Build a 'story bank' of 10 key experiences that map to your core leadership values and competencies.",
    takeaway: "\"Every leader needs a portfolio of stories for every occasion.\"",
  },
  {
    title: "Made to Stick",
    author: "Chip and Dan Heath",
    keyInsights: [
      "Ideas stick when they are Simple, Unexpected, Concrete, Credible, Emotional, and use Stories (SUCCESs)",
      "The Curse of Knowledge: once you know something, it's hard to remember not knowing it",
      "Unexpected moments create 'curiosity gaps' that demand to be filled",
    ],
    executiveApplication: "Before any key message, test it against SUCCESs. Remove every abstraction you can replace with a concrete example.",
    takeaway: "\"The enemy of the memorable is the abstract.\"",
  },
];

const HOOKS = [
  {
    type: "Bold Claim",
    description: "Open with a counterintuitive or provocative statement",
    example: "\"The most expensive mistake I ever made cost the company nothing. It cost our team everything.\"",
  },
  {
    type: "Data Surprise",
    description: "Lead with a statistic that defies expectations",
    example: "\"When we analyzed 6 months of meeting data, we found 40% of our engineering time was spent in meetings that produced zero decisions.\"",
  },
  {
    type: "Vivid Scenario",
    description: "Drop the listener into a specific moment with sensory detail",
    example: "\"It was 11pm on a Thursday when I got the call that our production database had gone down, taking $2M in orders with it.\"",
  },
  {
    type: "Direct Question",
    description: "Engage the audience by asking them to reflect",
    example: "\"Have you ever been the only person in the room who could see that the project was about to fail — but couldn't get anyone to listen?\"",
  },
  {
    type: "Counterintuitive Statement",
    description: "Challenge a common assumption in your field",
    example: "\"The best engineers I've ever hired were not the ones who were right the most. They were the ones who were wrong the fastest.\"",
  },
  {
    type: "Personal Stake",
    description: "Immediately establish why this matters to you personally",
    example: "\"I almost resigned over this decision. And I'm glad I didn't, because what happened next taught me more about leadership than any book.\"",
  },
  {
    type: "Contrast",
    description: "Juxtapose two opposing realities for impact",
    example: "\"In Q1 we were the fastest-growing product team in the company. By Q3 we had a 60% attrition rate. What changed everything was one conversation I had with a junior engineer.\"",
  },
  {
    type: "Silent Pause",
    description: "Start with a deliberate 2-3 second pause before speaking",
    example: "\"[pause] I want to tell you about the time I had to tell my CEO that our six-month project was a complete failure.\"",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FrameworkCard({ fw }: { fw: typeof FRAMEWORKS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
            >
              {fw.acronym}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">{fw.name}</h3>
        </div>
        {open ? (
          <ChevronUp size={16} style={{ color: "#4a5980", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#4a5980", flexShrink: 0 }} />
        )}
      </button>

      {open && (
        <div className="mt-4 fade-in">
          <div className="flex flex-col gap-2 mb-4">
            {fw.steps.map((step, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div
                  className="flex items-center justify-center rounded font-bold text-white flex-shrink-0"
                  style={{ width: 20, height: 20, background: "#6366f1", fontSize: 9 }}
                >
                  {i + 1}
                </div>
                <div>
                  <span className="font-semibold text-white">{step.label}: </span>
                  <span style={{ color: "#6b7fa3" }}>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl px-3 py-2 text-xs italic"
            style={{
              background: "rgba(251,191,36,0.06)",
              borderLeft: "3px solid rgba(251,191,36,0.4)",
              color: "#fbbf24",
            }}
          >
            {fw.tip}
          </div>
        </div>
      )}
    </div>
  );
}

function BookCard({ book }: { book: typeof BOOK_SUMMARIES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between"
      >
        <div>
          <h3 className="text-sm font-semibold text-white">{book.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "#4a5980" }}>
            {book.author}
          </p>
        </div>
        {open ? (
          <ChevronUp size={16} style={{ color: "#4a5980", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#4a5980", flexShrink: 0 }} />
        )}
      </button>

      {open && (
        <div className="mt-4 fade-in">
          <div className="mb-3">
            <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#818cf8" }}>
              Key Insights
            </div>
            <ul className="flex flex-col gap-1.5">
              {book.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b7fa3" }}>
                  <span style={{ color: "#818cf8", flexShrink: 0 }}>→</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-xl px-3 py-2 mb-3 text-xs"
            style={{ background: "rgba(52,211,153,0.06)", borderLeft: "3px solid rgba(52,211,153,0.4)", color: "#34d399" }}
          >
            <span className="font-semibold">Executive Application: </span>
            {book.executiveApplication}
          </div>
          <p className="text-xs italic" style={{ color: "#4a5980" }}>
            {book.takeaway}
          </p>
        </div>
      )}
    </div>
  );
}

function AIExercisesTab() {
  const { isAuthenticated, markPrincipleViewed } = useProgress();
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0].id);
  const [prompt, setPrompt] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState<{ feedback?: string; exampleAnswer?: string } | null>(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState("");

  const generatePrompt = async () => {
    if (!isAuthenticated) return;
    setLoadingPrompt(true);
    setPrompt("");
    setUserResponse("");
    setFeedback(null);
    setError("");
    try {
      const res = await fetch("/api/ai/storytelling-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: selectedFramework, exerciseType: "generate_prompt" }),
      });
      const data = await res.json();
      if (res.ok) {
        setPrompt(data.prompt ?? "");
        // Track module view
        markPrincipleViewed(selectedFramework);
      } else {
        setError(data.error ?? "Failed to generate prompt");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const getFeedback = async () => {
    if (!isAuthenticated || !userResponse.trim()) return;
    setLoadingFeedback(true);
    setFeedback(null);
    setError("");
    try {
      const res = await fetch("/api/ai/storytelling-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: selectedFramework,
          exerciseType: "evaluate_response",
          userResponse,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(data);
      } else {
        setError(data.error ?? "Failed to get feedback");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Sparkles size={28} style={{ color: "#4a5980", margin: "0 auto 12px" }} />
        <p className="text-sm font-medium text-white mb-1">Sign in to access AI exercises</p>
        <p className="text-xs" style={{ color: "#6b7fa3" }}>
          AI-powered practice prompts require an account.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#818cf8" }}>
          Select Framework
        </label>
        <div className="flex flex-wrap gap-2">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => {
                setSelectedFramework(fw.id);
                setPrompt("");
                setUserResponse("");
                setFeedback(null);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: selectedFramework === fw.id ? "rgba(99,102,241,0.2)" : "#0d1426",
                color: selectedFramework === fw.id ? "#a5b4fc" : "#6b7fa3",
                border: selectedFramework === fw.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2d4a",
              }}
            >
              {fw.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generatePrompt}
        disabled={loadingPrompt}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 mb-5"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
      >
        <Sparkles size={14} />
        {loadingPrompt ? "Generating…" : "Generate Practice Prompt"}
      </button>

      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      {prompt && (
        <div className="fade-in">
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "#0d1426", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#818cf8" }}>
              Your Practice Prompt
            </div>
            <p className="text-sm leading-relaxed text-white">{prompt}</p>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#6b7fa3" }}>
              Your Response
            </label>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Write your response using the selected framework…"
              rows={8}
              className="w-full rounded-xl p-4 text-sm resize-none outline-none placeholder:opacity-40"
              style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
            />
            <p className="text-xs mt-1" style={{ color: "#4a5980" }}>
              {userResponse.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={getFeedback}
              disabled={loadingFeedback || userResponse.trim().length < 10}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "white" }}
            >
              <Send size={14} />
              {loadingFeedback ? "Getting feedback…" : "Get AI Feedback"}
            </button>
            <button
              onClick={() => {
                setPrompt("");
                setUserResponse("");
                setFeedback(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105"
              style={{ background: "#1e2d4a", color: "#a5b4fc" }}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className="mt-5 rounded-2xl p-5 fade-in"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: "#818cf8" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
              AI Coaching Feedback
            </span>
          </div>
          {feedback.feedback && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#c8d0e0" }}>
              {feedback.feedback}
            </p>
          )}
          {feedback.exampleAnswer && (
            <div
              className="rounded-xl px-3 py-2 text-xs italic"
              style={{ background: "rgba(52,211,153,0.06)", borderLeft: "3px solid rgba(52,211,153,0.4)", color: "#34d399" }}
            >
              <span className="font-semibold not-italic">Example opener: </span>
              {feedback.exampleAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS: { id: "frameworks" | "books" | "hooks" | "exercises"; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "frameworks", label: "Frameworks", icon: <Zap size={14} /> },
  { id: "books", label: "Book Summaries", icon: <BookOpen size={14} /> },
  { id: "hooks", label: "Hooks & Openers", icon: <Lightbulb size={14} /> },
  { id: "exercises", label: "AI Exercises", icon: <Sparkles size={14} />, badge: "AI" },
];

export default function StorytellingMasteryView() {
  const [activeTab, setActiveTab] = useState<"frameworks" | "books" | "hooks" | "exercises">("frameworks");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Storytelling Mastery
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Master Executive Storytelling
        </h1>
        <p className="text-sm" style={{ color: "#6b7fa3" }}>
          Frameworks, books, hooks, and AI-powered practice — everything you need to tell stories that move people.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8">
        {TABS.map(({ id, label, icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === id ? "rgba(99,102,241,0.2)" : "#0d1426",
              color: activeTab === id ? "#a5b4fc" : "#6b7fa3",
              border: activeTab === id ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2d4a",
            }}
          >
            {icon}
            {label}
            {badge && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(99,102,241,0.3)", color: "#818cf8", fontSize: 9 }}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "frameworks" && (
        <div className="grid grid-cols-2 gap-4">
          {FRAMEWORKS.map((fw) => (
            <FrameworkCard key={fw.id} fw={fw} />
          ))}
        </div>
      )}

      {activeTab === "books" && (
        <div className="grid grid-cols-2 gap-4">
          {BOOK_SUMMARIES.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      )}

      {activeTab === "hooks" && (
        <div className="grid grid-cols-2 gap-4">
          {HOOKS.map((hook) => (
            <div
              key={hook.type}
              className="rounded-2xl p-5"
              style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
            >
              <h3 className="text-sm font-semibold text-white mb-1">{hook.type}</h3>
              <p className="text-xs mb-3" style={{ color: "#6b7fa3" }}>
                {hook.description}
              </p>
              <div
                className="rounded-xl px-3 py-2 text-xs italic leading-relaxed"
                style={{
                  background: "rgba(99,102,241,0.06)",
                  borderLeft: "3px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                }}
              >
                {hook.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "exercises" && <AIExercisesTab />}
    </div>
  );
}
