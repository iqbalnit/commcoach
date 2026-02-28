export default function Loading() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: "#0a0f1e" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid #1e293b",
          borderTopColor: "#6366f1",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
