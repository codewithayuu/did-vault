"use client";

import type { VerificationResult, VerificationStatus } from "@/lib/verification";

interface VerificationResultProps {
  result: VerificationResult;
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { color: string; bg: string; border: string; icon: string; glow: string }
> = {
  VERIFIED: {
    color:  "var(--success)",
    bg:     "var(--success-subtle)",
    border: "rgba(34,197,94,0.3)",
    icon:   "✓",
    glow:   "rgba(34,197,94,0.15)",
  },
  FAILED: {
    color:  "var(--error)",
    bg:     "var(--error-subtle)",
    border: "rgba(239,68,68,0.3)",
    icon:   "✕",
    glow:   "rgba(239,68,68,0.15)",
  },
  REJECTED: {
    color:  "var(--warning)",
    bg:     "var(--warning-subtle)",
    border: "rgba(245,158,11,0.3)",
    icon:   "⊘",
    glow:   "rgba(245,158,11,0.15)",
  },
  PENDING: {
    color:  "var(--info)",
    bg:     "var(--info-subtle)",
    border: "rgba(59,130,246,0.3)",
    icon:   "◌",
    glow:   "rgba(59,130,246,0.12)",
  },
  UNKNOWN: {
    color:  "var(--text-muted)",
    bg:     "var(--bg-overlay)",
    border: "var(--border)",
    icon:   "?",
    glow:   "transparent",
  },
};

export function VerificationResultPanel({ result }: VerificationResultProps) {
  const cfg = STATUS_CONFIG[result.status];

  return (
    <div className="animate-fade-in">
      <div
        style={{
          padding: "24px",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: "var(--radius-lg)",
          marginBottom: 16,
          boxShadow: `0 0 32px ${cfg.glow}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: cfg.color + "22",
            border: `2px solid ${cfg.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: cfg.color,
            fontWeight: 700,
            flexShrink: 0,
            animation:
              result.status === "PENDING"
                ? "pulse 1.6s ease-in-out infinite"
                : "none",
          }}
        >
          {cfg.icon}
        </div>

        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: cfg.color,
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            {result.status}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {result.message}
          </div>
        </div>

        <div
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <div>Checked at</div>
          <div style={{ color: "var(--text-secondary)", marginTop: 2 }}>
            {result.checkedAt.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Verification Checks
        </div>

        {result.details.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 16px",
              borderBottom:
                i < result.details.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: d.passed ? "var(--success-subtle)" : "var(--error-subtle)",
                border: `1px solid ${d.passed ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: d.passed ? "var(--success)" : "var(--error)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {d.passed ? "✓" : "✕"}
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>
                {d.check}
              </span>
              {d.info && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {d.info}
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: d.passed ? "var(--success)" : "var(--error)",
              }}
            >
              {d.passed ? "PASS" : "FAIL"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
