"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CredentialRawPanel } from "./CredentialRawPanel";
import type { CredentialRecord } from "@/types";

interface CredentialCardProps {
  record: CredentialRecord;
}

const STATE_VARIANT: Record<string, "success" | "warning" | "info" | "error" | "neutral"> = {
  OfferSent:               "info",
  OfferReceived:           "info",
  RequestPending:          "warning",
  RequestSent:             "warning",
  RequestReceived:         "warning",
  CredentialPending:       "warning",
  CredentialSent:          "success",
  CredentialReceived:      "success",
  ProblemReportReceived:   "error",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StateTimeline({ state }: { state: string }) {
  const STEPS = [
    "OfferSent",
    "RequestReceived",
    "CredentialSent",
  ];

  const currentIdx = STEPS.indexOf(state);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((step, i) => {
        const done    = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div
              title={step}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: done
                  ? current
                    ? "var(--accent)"
                    : "var(--success)"
                  : "var(--border-strong)",
                transition: "background 0.3s",
                boxShadow: current ? "0 0 6px var(--accent)" : "none",
              }}
            />
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: i < currentIdx ? "var(--success)" : "var(--border)",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CredentialCard({ record }: CredentialCardProps) {
  const [expanded, setExpanded] = useState(false);

  const variant  = STATE_VARIANT[record.protocolState] ?? "neutral";
  const hasJWT   = Boolean(record.credential);
  const claimEntries = Object.entries(record.claims ?? {});

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.recordId}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {formatDate(record.createdAt)}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <StateTimeline state={record.protocolState} />
            <Badge variant={variant} label={record.protocolState} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {claimEntries.slice(0, 4).map(([k, v]) => (
            <div
              key={k}
              style={{
                padding: "3px 10px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                borderRadius: 99,
                fontSize: 11,
                display: "flex",
                gap: 5,
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>{k}</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          {claimEntries.length > 4 && (
            <div
              style={{
                padding: "3px 10px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                borderRadius: 99,
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              +{claimEntries.length - 4} more
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
            title={record.subjectId}
          >
            → {record.subjectId?.slice(0, 42)}…
          </div>

          {hasJWT && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((p) => !p)}
              style={{ flexShrink: 0, fontSize: 11 }}
            >
              {expanded ? "▲ Hide JWT" : "▼ View JWT"}
            </Button>
          )}
        </div>
      </div>

      {expanded && hasJWT && record.credential && (
        <div
          className="animate-fade-in"
          style={{
            padding: "0 18px 18px",
            borderTop: "1px solid var(--border)",
            paddingTop: 16,
          }}
        >
          <CredentialRawPanel jwt={record.credential} />
        </div>
      )}

      {!hasJWT && record.protocolState !== "ProblemReportReceived" && (
        <div
          style={{
            padding: "8px 18px",
            background: "var(--bg-base)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Waiting for credential exchange to complete…
          </span>
        </div>
      )}
    </div>
  );
}
