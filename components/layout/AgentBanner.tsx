"use client";

import { Button } from "@/components/ui/Button";

interface AgentBannerProps {
  consecutive: number;
  onRecheck: () => void;
}

export function AgentBanner({ consecutive, onRecheck }: AgentBannerProps) {
  if (consecutive < 2) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        gridColumn: 2,
        gridRow: 2,
        position: "sticky",
        top: 0,
        zIndex: 20,
        margin: "0 32px",
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 18px",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: "var(--radius-md)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--warning)",
            animation: "pulse 1.4s ease-in-out infinite",
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--warning)",
              marginRight: 8,
            }}
          >
            Cloud Agent unreachable
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Make sure Docker is running and the agent is healthy on{" "}
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                background: "var(--bg-overlay)",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {process.env.NEXT_PUBLIC_AGENT_BASE_URL ?? "http://localhost:8085"}
            </code>
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Button variant="ghost" size="sm" onClick={onRecheck}>
            ↻ Retry
          </Button>
          <a
            href="https://docs.atalaprism.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              padding: "6px 10px",
            }}
          >
            Docs ↗
          </a>
        </div>
      </div>
    </div>
  );
}
