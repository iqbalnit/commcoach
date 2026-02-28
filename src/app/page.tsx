"use client";

import { useState } from "react";
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
  | "mock-interview";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [preselectedScenarioId, setPreselectedScenarioId] = useState<string | null>(null);

  const handleSetActiveView = (view: View) => {
    setActiveView(view);
    if (view !== "practice") setPreselectedScenarioId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0f1e" }}>
      <Sidebar activeView={activeView} setActiveView={handleSetActiveView} />
      <main className="flex-1 overflow-y-auto" style={{ background: "#0a0f1e" }}>
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
      </main>
    </div>
  );
}
