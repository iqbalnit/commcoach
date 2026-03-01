"use client";

import { useState } from "react";
import { View } from "@/app/page";
import { useJobApplications } from "@/lib/useJobApplications";
import { prepPackExtensions, type PrepPackCompanyKey } from "@/lib/prepPacksData";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Clock,
  ChevronRight,
  X,
  Briefcase,
  Building2,
  AlertCircle,
} from "lucide-react";

interface JobTrackerViewProps {
  setActiveView: (v: View) => void;
}

const STATUSES = ["applied", "screening", "interview", "offer", "rejected"] as const;
type Status = typeof STATUSES[number];

const STATUS_COLORS: Record<Status, { bg: string; text: string; border: string }> = {
  applied:   { bg: "rgba(129,140,248,0.12)", text: "#a5b4fc", border: "rgba(129,140,248,0.3)" },
  screening: { bg: "rgba(56,189,248,0.12)",  text: "#7dd3fc", border: "rgba(56,189,248,0.3)"  },
  interview: { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24", border: "rgba(251,191,36,0.3)"  },
  offer:     { bg: "rgba(52,211,153,0.12)",  text: "#34d399", border: "rgba(52,211,153,0.3)"  },
  rejected:  { bg: "rgba(74,89,128,0.12)",   text: "#4a5980", border: "rgba(74,89,128,0.3)"   },
};

interface FormState {
  company: string;
  role: string;
  interviewDate: string;
  status: Status;
  notes: string;
}

const emptyForm = (): FormState => ({
  company: "",
  role: "",
  interviewDate: "",
  status: "applied",
  notes: "",
});

function formatDateDisplay(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysLabel(interviewDate: string | null): { label: string; color: string } | null {
  if (!interviewDate) return null;
  const diff = Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86_400_000);
  if (diff > 30) return null;
  if (diff < 0) return { label: `${Math.abs(diff)}d ago`, color: "#4a5980" };
  if (diff === 0) return { label: "Today!", color: "#f87171" };
  if (diff <= 3) return { label: `in ${diff}d`, color: "#f87171" };
  if (diff <= 7) return { label: `in ${diff}d`, color: "#fbbf24" };
  return { label: `in ${diff}d`, color: "#34d399" };
}

export default function JobTrackerView({ setActiveView }: JobTrackerViewProps) {
  const { applications, loading, nextInterview, daysUntilNext, addApplication, updateApplication, deleteApplication } =
    useJobApplications();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (app: (typeof applications)[0]) => {
    setEditingId(app.id);
    setForm({
      company: app.company,
      role: app.role,
      interviewDate: app.interviewDate ? app.interviewDate.slice(0, 10) : "",
      status: (STATUSES.includes(app.status as Status) ? app.status : "applied") as Status,
      notes: app.notes,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      interviewDate: form.interviewDate || undefined,
      status: form.status,
      notes: form.notes,
    };
    if (editingId) {
      await updateApplication(editingId, payload);
    } else {
      await addApplication(payload);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteApplication(id);
    setDeletingId(null);
  };

  // Check if nextInterview company matches a prep pack
  const nextCompanyKey = nextInterview
    ? (nextInterview.company.toLowerCase() as PrepPackCompanyKey)
    : null;
  const hasPrepPack = nextCompanyKey ? nextCompanyKey in prepPackExtensions : false;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} style={{ color: "#818cf8" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Job Tracker
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Interview Tracker</h1>
            <p className="text-sm" style={{ color: "#6b7fa3" }}>
              Track your applications and stay on top of upcoming interviews.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            <Plus size={14} />
            Add Application
          </button>
        </div>
      </div>

      {/* Countdown Banner */}
      {nextInterview && daysUntilNext !== null && daysUntilNext <= 14 && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 40, height: 40, background: "rgba(251,191,36,0.15)" }}
            >
              <Clock size={18} style={{ color: "#fbbf24" }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {nextInterview.company} — {nextInterview.role}
              </div>
              <div className="text-xs" style={{ color: "#fbbf24" }}>
                {daysUntilNext === 0
                  ? "Interview is today! 🎯"
                  : daysUntilNext === 1
                  ? "Interview is tomorrow!"
                  : `Interview in ${daysUntilNext} days ${daysUntilNext <= 3 ? "— Final prep mode! 🔥" : "— Keep practicing."}`}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {hasPrepPack && (
              <button
                onClick={() => setActiveView("prep-packs")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}
              >
                <Briefcase size={11} />
                Prep Pack
                <ChevronRight size={11} />
              </button>
            )}
            <button
              onClick={() => setActiveView("mock-interview")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              Mock Interview
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "#0d1426", border: "1px solid rgba(99,102,241,0.4)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">
              {editingId ? "Edit Application" : "Add Application"}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="p-1 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "#4a5980" }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6b7fa3" }}>
                Company *
              </label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Google"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6b7fa3" }}>
                Role *
              </label>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Director of Engineering"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6b7fa3" }}>
                Interview Date
              </label>
              <input
                type="date"
                value={form.interviewDate}
                onChange={(e) => setForm((f) => ({ ...f, interviewDate: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0", colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6b7fa3" }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6b7fa3" }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Recruiter name, contact info, interview format…"
              rows={3}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              style={{ background: "#111827", border: "1px solid #1e2d4a", color: "#e8eaf0" }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.company.trim() || !form.role.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              {saving ? "Saving…" : editingId ? "Update" : "Add Application"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#1e2d4a", color: "#6b7fa3" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Application List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-sm" style={{ color: "#4a5980" }}>Loading applications…</div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <Building2 size={40} style={{ color: "#1e2d4a", margin: "0 auto 16px" }} />
          <p className="text-sm font-medium text-white mb-1">No applications yet</p>
          <p className="text-xs mb-4" style={{ color: "#6b7fa3" }}>
            Track your job applications and interview dates in one place.
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white mx-auto transition-all hover:scale-105"
            style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <Plus size={14} />
            Add your first application
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => {
            const statusStyle = STATUS_COLORS[(app.status as Status) ?? "applied"] ?? STATUS_COLORS.applied;
            const dl = daysLabel(app.interviewDate);
            const isDeleting = deletingId === app.id;

            return (
              <div
                key={app.id}
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: "#0d1426",
                  border: "1px solid #1e2d4a",
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-white">{app.company}</span>
                      <span className="text-xs" style={{ color: "#4a5980" }}>·</span>
                      <span className="text-sm" style={{ color: "#9ca3af" }}>{app.role}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status chip */}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                        }}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>

                      {/* Interview date */}
                      {app.interviewDate && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#6b7fa3" }}>
                          <Calendar size={10} />
                          {formatDateDisplay(app.interviewDate)}
                        </span>
                      )}

                      {/* Countdown */}
                      {dl && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${dl.color}15`, color: dl.color }}
                        >
                          {dl.label}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p
                        className="text-xs mt-2 line-clamp-2"
                        style={{ color: "#4a5980" }}
                      >
                        {app.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(app)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                      style={{ color: "#4a5980" }}
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-900/20"
                      style={{ color: "#4a5980" }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prep suggestion when next interview matches a known company */}
      {nextInterview && hasPrepPack && (
        <div
          className="rounded-2xl p-5 mt-6"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={13} style={{ color: "#818cf8" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>
              Prep Suggestions for {nextInterview.company}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: `Study ${nextInterview.company} Leadership Principles`, view: "prep-packs" as View },
              { label: "Practice a Mock Interview", view: "mock-interview" as View },
              { label: "Build out your Story Bank", view: "story-bank" as View },
            ].map(({ label, view }) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className="flex items-center gap-2 text-xs transition-all hover:text-indigo-300 text-left"
                style={{ color: "#6b7fa3" }}
              >
                <ChevronRight size={11} style={{ color: "#4a5980", flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
