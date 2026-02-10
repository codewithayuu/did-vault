"use client";

import { useEffect, useState } from "react";
import { getAgentHealth } from "@/lib/identus";
import type { AgentHealth } from "@/types";

export function TopBar() {
  const [health, setHealth] = useState<AgentHealth | null>(null);

  useEffect(() => {
    getAgentHealth().then(setHealth);
    const id = setInterval(() => getAgentHealth().then(setHealth), 30_000);
    return () => clearInterval(id);
  }, []);

  const statusColor =
    health?.status === "ok"
      ? "var(--success)"
      : health?.status === "degraded"
      ? "var(--warning)"
      : "var(--error)";

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
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {health === null
            ? "Connecting…"
            : health.status === "ok"
            ? `Agent v${health.version}` 
            : "Agent unreachable"}
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
