"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Trophy, Share2, Download, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { computeBadges } from "@/lib/badges";
import type { EarnedBadge } from "@/lib/badges";

type FilterType = "all" | "earned" | "locked";

const CATEGORY_LABELS: Record<string, string> = {
  practice: "Practice",
  stories: "Story Bank",
  "mock-interview": "Mock Interview",
  streaks: "Streaks",
  quiz: "Quiz",
  "learning-path": "Learning Path",
};

function BadgeCard({
  badge,
  onShare,
}: {
  badge: EarnedBadge;
  onShare: (badge: EarnedBadge) => void;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col items-center text-center relative transition-all duration-200 group"
      style={{
        background: badge.earned ? "#0d1426" : "#080d1a",
        border: badge.earned ? `1px solid ${badge.color}30` : "1px solid #12192e",
        opacity: badge.earned ? 1 : 0.4,
      }}
    >
      {/* Glow for earned */}
      {badge.earned && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${badge.color}12`,
          }}
        />
      )}

      {/* Icon */}
      <div
        className="text-2xl flex items-center justify-center rounded-xl mb-2 relative"
        style={{
          width: 52,
          height: 52,
          background: badge.earned ? `${badge.color}15` : "#1e2d4a",
          fontSize: 26,
          border: badge.earned ? `1px solid ${badge.color}25` : "none",
        }}
      >
        {badge.icon}
        {!badge.earned && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(8,13,26,0.65)" }}
          >
            <Lock size={14} style={{ color: "#2a3560" }} />
          </div>
        )}
      </div>

      <div
        className="text-xs font-semibold mb-0.5 leading-tight"
        style={{ color: badge.earned ? "#e8eaf0" : "#4a5980" }}
      >
        {badge.title}
      </div>
      <div className="text-xs leading-tight mb-2" style={{ color: "#4a5980" }}>
        {badge.description}
      </div>

      {badge.earned ? (
        <button
          onClick={() => onShare(badge)}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
          style={{ background: `${badge.color}18`, color: badge.color, border: `1px solid ${badge.color}28` }}
        >
          <Share2 size={10} />
          Share
        </button>
      ) : (
        <div
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "#1e2d4a", color: "#4a5980" }}
        >
          Locked
        </div>
      )}
    </div>
  );
}

export default function AchievementBadgesView() {
  const { progress, stories, learningPath } = useProgress();
  const [filter, setFilter] = useState<FilterType>("all");
  const [mockCompletedCount, setMockCompletedCount] = useState(0);
  const [sharingBadge, setSharingBadge] = useState<EarnedBadge | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "capturing" | "ready">("idle");
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Fetch mock interview completed count
  useEffect(() => {
    fetch("/api/mock-interview?summary=true")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.completed != null) setMockCompletedCount(data.completed);
      })
      .catch(() => {});
  }, []);

  const weeksCompleted = learningPath?.completedWeeks.length ?? 0;

  const badges = computeBadges({
    progress,
    stories,
    mockCompletedCount,
    weeksCompleted,
  });

  const earnedCount = badges.filter((b) => b.earned).length;

  const filteredBadges = badges.filter((b) => {
    if (filter === "earned") return b.earned;
    if (filter === "locked") return !b.earned;
    return true;
  });

  const handleShare = useCallback(async (badge: EarnedBadge) => {
    setSharingBadge(badge);
    setShareStatus("capturing");

    // Small timeout so the hidden card renders before capture
    await new Promise((r) => setTimeout(r, 80));

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;

      if (!shareCardRef.current) {
        setShareStatus("idle");
        setSharingBadge(null);
        return;
      }

      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: "#0d1426",
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `speaksharp-badge-${badge.id}.png`;
      link.click();

      setShareStatus("ready");
    } catch (err) {
      console.error("Badge share failed:", err);
    } finally {
      setTimeout(() => {
        setShareStatus("idle");
        setSharingBadge(null);
      }, 1000);
    }
  }, []);

  const nextBadge = badges.find((b) => !b.earned);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} style={{ color: "#fbbf24" }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#fbbf24" }}>
              Achievements
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Your Achievements</h1>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>
            Badges earned through consistent practice and mastery
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <Sparkles size={18} style={{ color: "#fbbf24" }} />
          <div>
            <div className="text-xl font-bold text-white">{earnedCount}</div>
            <div className="text-xs" style={{ color: "#6b7fa3" }}>
              of {badges.length} earned
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold" style={{ color: "#c8d0e0" }}>
            Overall Progress
          </span>
          <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>
            {Math.round((earnedCount / badges.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "#1e2d4a" }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${(earnedCount / badges.length) * 100}%`,
              background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
            }}
          />
        </div>
        {nextBadge && (
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ background: "#111827", border: "1px solid #1e2d4a" }}>
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 36, height: 36, background: "#1e2d4a", fontSize: 18 }}
            >
              {nextBadge.icon}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Next: {nextBadge.title}</div>
              <div className="text-xs" style={{ color: "#4a5980" }}>{nextBadge.description}</div>
            </div>
            <CheckCircle2 size={14} style={{ color: "#2a3560", marginLeft: "auto" }} />
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ background: "#0d1426", border: "1px solid #1e2d4a", width: "fit-content" }}
      >
        {(["all", "earned", "locked"] as const).map((f) => {
          const count = f === "all" ? badges.length : f === "earned" ? earnedCount : badges.length - earnedCount;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize flex items-center gap-1.5"
              style={{
                background: filter === f ? "rgba(99,102,241,0.2)" : "transparent",
                color: filter === f ? "#a5b4fc" : "#4a5980",
                border: filter === f ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              }}
            >
              {f === "earned" ? <Trophy size={10} /> : f === "locked" ? <Lock size={10} /> : <Sparkles size={10} />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span
                className="text-xs px-1.5 py-0 rounded-full"
                style={{
                  background: filter === f ? "rgba(99,102,241,0.25)" : "#1e2d4a",
                  color: filter === f ? "#a5b4fc" : "#4a5980",
                  fontSize: 9,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredBadges.map((b) => (
          <BadgeCard key={b.id} badge={b} onShare={handleShare} />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-16">
          <Trophy size={36} style={{ color: "#1e2d4a", margin: "0 auto 12px" }} />
          <p className="text-sm font-medium text-white mb-1">No badges here yet</p>
          <p className="text-xs" style={{ color: "#4a5980" }}>
            {filter === "earned" ? "Complete scenarios, stories, and mock interviews to earn badges." : "All badges unlocked!"}
          </p>
        </div>
      )}

      {/* Category legend */}
      <div
        className="mt-8 rounded-2xl p-5"
        style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={12} style={{ color: "#818cf8" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
            Badge Categories
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const catBadges = badges.filter((b) => b.category === key);
            const catEarned = catBadges.filter((b) => b.earned).length;
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
              >
                <span className="text-xs" style={{ color: "#c8d0e0" }}>{label}</span>
                <span className="text-xs font-semibold" style={{ color: "#4a5980" }}>
                  {catEarned}/{catBadges.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden share card (rendered off-screen for html2canvas) */}
      {sharingBadge && (
        <div
          ref={shareCardRef}
          style={{
            position: "absolute",
            left: -9999,
            top: 0,
            width: 400,
            height: 300,
            background: "linear-gradient(135deg, #0d1426 0%, #111827 100%)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            {sharingBadge.icon}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {sharingBadge.title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#6b7fa3",
              textAlign: "center",
              marginBottom: 24,
              maxWidth: 300,
            }}
          >
            {sharingBadge.description}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: sharingBadge.color,
            }}
          >
            SPEAKSHARP
          </div>
        </div>
      )}

      {/* Share status overlay */}
      {shareStatus === "capturing" && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: "#0d1426", border: "1px solid #1e2d4a" }}
          >
            <Download size={14} style={{ color: "#818cf8" }} className="animate-bounce" />
            <span className="text-sm font-medium text-white">Generating badge image…</span>
          </div>
        </div>
      )}
    </div>
  );
}
