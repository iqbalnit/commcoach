"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

export interface JobApplicationData {
  id: string;
  userId: string;
  company: string;
  role: string;
  interviewDate: string | null;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/job-applications");
      if (res.ok) {
        setApplications(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addApplication = useCallback(
    async (data: {
      company: string;
      role: string;
      interviewDate?: string;
      status?: string;
      notes?: string;
    }): Promise<JobApplicationData | null> => {
      const res = await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      const created: JobApplicationData = await res.json();
      setApplications((prev) =>
        [...prev, created].sort((a, b) => {
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          return new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime();
        })
      );
      return created;
    },
    []
  );

  const updateApplication = useCallback(
    async (
      id: string,
      patch: Partial<Omit<JobApplicationData, "id" | "userId" | "createdAt" | "updatedAt">>
    ): Promise<JobApplicationData | null> => {
      const res = await fetch(`/api/job-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const updated: JobApplicationData = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    },
    []
  );

  const deleteApplication = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/job-applications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    }
  }, []);

  // First upcoming interview (interviewDate >= today)
  const nextInterview = useMemo<JobApplicationData | null>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (
      applications
        .filter((a) => a.interviewDate && new Date(a.interviewDate) >= now)
        .sort(
          (a, b) =>
            new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime()
        )[0] ?? null
    );
  }, [applications]);

  const daysUntilNext = useMemo<number | null>(() => {
    if (!nextInterview?.interviewDate) return null;
    const diff = new Date(nextInterview.interviewDate).getTime() - Date.now();
    return Math.ceil(diff / 86_400_000);
  }, [nextInterview]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    applications,
    loading,
    nextInterview,
    daysUntilNext,
    addApplication,
    updateApplication,
    deleteApplication,
    refresh: fetchAll,
  };
}
