"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex h-screen items-center justify-center flex-col gap-4"
      style={{ background: "#0a0f1e", color: "#e2e8f0" }}
    >
      <div
        className="flex items-center justify-center rounded-2xl mb-2"
        style={{ width: 64, height: 64, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
      >
        <span style={{ fontSize: 28 }}>⚠️</span>
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
      <p style={{ color: "#94a3b8", maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          padding: "0.6rem 1.8rem",
          borderRadius: "0.75rem",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.875rem",
        }}
      >
        Try again
      </button>
    </div>
  );
}
