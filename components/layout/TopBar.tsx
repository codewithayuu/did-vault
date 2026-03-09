"use client";

import { useAgentHealth } from "@/hooks/useAgentHealth";

export function TopBar() {
  const { health, consecutive } = useAgentHealth();

  const statusColor =
    health?.status === "ok"
      ? "var(--success)"
      : consecutive >= 2
        ? "var(--error)"
        : "var(--warning)";

  return (
    <header
      style={{
        gridColumn: 2,
        gridRow: 1,
        height: "var(--topbar-h)",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 28px",
        gap: 20,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: statusColor,
            boxShadow: health?.status === "ok" ? `0 0 6px ${statusColor}` : "none",
            animation: health?.status === "ok" ? "pulse 2.4s ease-in-out infinite" : "none",
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            fontFamily:
              health?.status === "ok" ? "var(--font-mono)" : "inherit",
          }}
        >
          {health === null
            ? "Connecting…"
            : health.status === "ok"
              ? `v${health.version}`
              : consecutive >= 2
                ? "Unreachable"
                : "Retrying…"}
        </span>
      </div>

      <div
        style={{
          width: 1,
          height: 20,
          background: "var(--border)",
        }}
      />

      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-glow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "var(--accent-hover)",
          fontWeight: 600,
        }}
      >
        U
      </div>
    </header>
  );
}
