"use client";

import { View } from "@/app/page";
import {
  LayoutDashboard,
  BookOpen,
  Mic,
  Lightbulb,
  Brain,
  TrendingUp,
  Zap,
  Map,
  Building2,
  BookMarked,
  LogIn,
  LogOut,
  MessageSquare,
  Sparkles,
  Briefcase,
  Calendar,
  FileText,
  Trophy,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface SidebarProps {
  activeView: View;
  setActiveView: (v: View) => void;
}

const DAILY_TIPS = [
  "Lead with your answer. Make people wait for your point and you lose them.",
  "Pause before answering. Two seconds of silence signals confidence, not confusion.",
  "Replace 'I think' with 'I know' or remove the hedge entirely.",
  "Use 'And What Else?' to draw out deeper thinking from your team.",
  "Every STAR story needs a number in the Result — 'it went well' is not a result.",
  "Structure reduces cognitive load. Open every response with a roadmap.",
  "Speak to be understood, not to impress. Jargon is a mask for uncertainty.",
  "The Pyramid Principle: answer first, then prove it. Never bury your conclusion.",
  "Stories are 22x more memorable than facts alone. Make data human.",
  "Executive presence = 67% gravitas, 28% communication, 5% appearance.",
  "Before every high-stakes conversation, pause and ask: 'What does success look like?'",
  "Silence is the most underused tool in every communicator's toolkit.",
  "Amazon asks: 'What did you learn?' — every failure story needs a growth chapter.",
  "Google tests MECE thinking. Structure your answers with no gaps and no overlap.",
  "The best way to influence without authority: find the shared problem first.",
];

const coreNavItems: { label: string; view: View; icon: React.ReactNode; badge?: string }[] = [
  { label: "Dashboard", view: "dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Frameworks", view: "frameworks", icon: <BookOpen size={18} /> },
  { label: "Practice", view: "practice", icon: <Mic size={18} />, badge: "23" },
  { label: "Principles", view: "principles", icon: <Lightbulb size={18} /> },
  { label: "Quiz", view: "quiz", icon: <Brain size={18} /> },
  { label: "Progress", view: "progress", icon: <TrendingUp size={18} /> },
  { label: "Achievements", view: "achievements", icon: <Trophy size={18} /> },
];

const execNavItems: { label: string; view: View; icon: React.ReactNode; badge?: string }[] = [
  { label: "Learning Path", view: "learning-path", icon: <Map size={18} />, badge: "12w" },
  { label: "Interview Prep", view: "exec-interview", icon: <Building2 size={18} />, badge: "FAANG" },
  { label: "Story Bank", view: "story-bank", icon: <BookMarked size={18} /> },
  { label: "Mock Interview", view: "mock-interview", icon: <MessageSquare size={18} />, badge: "AI" },
  { label: "Storytelling", view: "storytelling", icon: <Sparkles size={18} />, badge: "New" },
  { label: "Prep Packs", view: "prep-packs", icon: <Briefcase size={18} />, badge: "5" },
  { label: "Job Tracker", view: "job-tracker", icon: <Calendar size={18} /> },
  { label: "Resume Prep", view: "resume-prep", icon: <FileText size={18} />, badge: "AI" },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { data: session } = useSession();
  const dailyTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  const renderNavItem = (item: typeof coreNavItems[0]) => {
    const isActive = activeView === item.view;
    return (
      <button
        key={item.view}
        onClick={() => setActiveView(item.view)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left"
        style={{
          background: isActive
            ? "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)"
            : "transparent",
          color: isActive ? "#a5b4fc" : "#6b7fa3",
          border: isActive ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
        }}
      >
        <span style={{ color: isActive ? "#818cf8" : "#4a5980" }}>
          {item.icon}
        </span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(99,102,241,0.2)",
              color: "#818cf8",
              fontSize: 10,
            }}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 220,
        minWidth: 220,
        background: "#0d1426",
        borderRight: "1px solid #1e2d4a",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "#1e2d4a" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            <Zap size={18} color="white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              SpeakSharp
            </div>
            <div className="text-xs" style={{ color: "#6b7fa3" }}>
              Executive Edition
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {/* Core Tools */}
        {coreNavItems.map(renderNavItem)}

        {/* Section divider */}
        <div className="mx-1 my-3" style={{ borderTop: "1px solid #1e2d4a" }} />
        <div className="px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#2a3560" }}>
            Executive Track
          </span>
        </div>

        {/* Executive Track */}
        {execNavItems.map(renderNavItem)}
      </nav>

      {/* Auth Section */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "#1e2d4a" }}>
        {session ? (
          <div className="flex items-center gap-2">
            {session.user?.image ? (
              <img src={session.user.image} alt="avatar"
                className="w-7 h-7 rounded-full" style={{ border: "1px solid #1e2d4a" }} />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#6366f1", color: "#fff" }}>
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{session.user?.name}</p>
              <button onClick={() => signOut()}
                className="text-xs flex items-center gap-1 transition-colors hover:text-white"
                style={{ color: "#4a5980" }}>
                <LogOut size={10} />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => signIn("google")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: "#1e2d4a", color: "#6b7fa3" }}>
            <LogIn size={14} />
            Sign in to save progress
          </button>
        )}
      </div>

      {/* Daily Tip */}
      <div className="px-4 pb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
        >
          <div className="text-xs font-semibold text-white mb-1">
            Daily Tip
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "#6b7fa3" }}>
            {dailyTip}
          </div>
        </div>
      </div>
    </aside>
  );
}
