"use client";

import { useState } from "react";
import { Menu, Zap } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import FrameworksView from "@/components/FrameworksView";
import PracticeView from "@/components/PracticeView";
import PrinciplesView from "@/components/PrinciplesView";
import QuizView from "@/components/QuizView";
import ProgressView from "@/components/ProgressView";
import LearningPathView from "@/components/LearningPathView";
import ExecutiveInterviewView from "@/components/ExecutiveInterviewView";
import StoryBankView from "@/components/StoryBankView";
import StorytellingMasteryView from "@/components/StorytellingMasteryView";
import MockInterviewView from "@/components/MockInterviewView";
import PrepPacksView from "@/components/PrepPacksView";
import JobTrackerView from "@/components/JobTrackerView";
import ResumePrepView from "@/components/ResumePrepView";
import AchievementBadgesView from "@/components/AchievementBadgesView";

export type View =
  | "dashboard"
  | "frameworks"
  | "practice"
  | "principles"
  | "quiz"
  | "progress"
  | "learning-path"
  | "exec-interview"
  | "story-bank"
  | "storytelling"
  | "mock-interview"
  | "prep-packs"
  | "job-tracker"
  | "resume-prep"
  | "achievements";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [preselectedScenarioId, setPreselectedScenarioId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSetActiveView = (view: View) => {
    setActiveView(view);
    if (view !== "practice") setPreselectedScenarioId(null);
  };

  const handleSidebarNav = (view: View) => {
    handleSetActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0f1e" }}>
      {/* Mobile backdrop — closes drawer when tapped */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeView={activeView}
        setActiveView={handleSidebarNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto" style={{ background: "#0a0f1e" }}>
        {/* Mobile-only top bar with hamburger */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-10"
          style={{ background: "#0d1426", borderBottom: "1px solid #1e2d4a" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#6b7fa3" }}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 26,
                height: 26,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <Zap size={13} color="white" />
            </div>
            <span className="text-sm font-bold text-white">SpeakSharp</span>
          </div>
        </div>

        {activeView === "dashboard" && (
          <Dashboard setActiveView={handleSetActiveView} />
        )}
        {activeView === "frameworks" && <FrameworksView />}
        {activeView === "practice" && (
          <PracticeView
            initialScenarioId={preselectedScenarioId}
            onScenarioConsumed={() => setPreselectedScenarioId(null)}
          />
        )}
        {activeView === "principles" && <PrinciplesView />}
        {activeView === "quiz" && <QuizView />}
        {activeView === "progress" && <ProgressView setActiveView={handleSetActiveView} />}
        {activeView === "learning-path" && (
          <LearningPathView setActiveView={handleSetActiveView} />
        )}
        {activeView === "exec-interview" && (
          <ExecutiveInterviewView
            setActiveView={handleSetActiveView}
            setPreselectedScenarioId={setPreselectedScenarioId}
          />
        )}
        {activeView === "story-bank" && <StoryBankView />}
        {activeView === "storytelling" && <StorytellingMasteryView />}
        {activeView === "mock-interview" && <MockInterviewView />}
        {activeView === "prep-packs" && (
          <PrepPacksView setActiveView={handleSetActiveView} />
        )}
        {activeView === "job-tracker" && (
          <JobTrackerView setActiveView={handleSetActiveView} />
        )}
        {activeView === "resume-prep" && (
          <ResumePrepView
            setActiveView={handleSetActiveView}
            setPreselectedScenarioId={setPreselectedScenarioId}
          />
        )}
        {activeView === "achievements" && <AchievementBadgesView />}
      </main>
    </div>
  );
}
