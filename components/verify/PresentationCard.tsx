"use client";

import { useState } from "react";
import { PresentationTimeline } from "./PresentationTimeline";
import { VerificationResultPanel } from "./VerificationResult";
import { Button } from "@/components/ui/Button";
import { buildVerificationResult, deriveVerificationStatus } from "@/lib/verification";
import type { PresentationRecord } from "@/types";

interface PresentationCardProps {
  record: PresentationRecord;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ state }: { state: string }) {
  const status = deriveVerificationStatus(state);

  const colorMap: Record<string, string> = {
    VERIFIED: "var(--success)",
    FAILED:   "var(--error)",
    REJECTED: "var(--warning)",
    PENDING:  "var(--info)",
    UNKNOWN:  "var(--text-muted)",
  };

  const bgMap: Record<string, string> = {
    VERIFIED: "var(--success-subtle)",
    FAILED:   "var(--error-subtle)",
    REJECTED: "var(--warning-subtle)",
    PENDING:  "var(--info-subtle)",
    UNKNOWN:  "var(--bg-overlay)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: bgMap[status],
        color: colorMap[status],
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: colorMap[status],
          animation:
            status === "PENDING" ? "pulse 1.6s ease-in-out infinite" : "none",
        }}
      />
      {status}
    </span>
  );
}

export function PresentationCard({ record }: PresentationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const result                  = buildVerificationResult(record);

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
            marginBottom: 16,
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
              {record.updatedAt && record.updatedAt !== record.createdAt && (
                <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                  · updated {formatDate(record.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <StatusPill state={record.status} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <PresentationTimeline currentState={record.status} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              background: "var(--bg-overlay)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Challenge
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={record.proofRequestData?.challenge}
            >
              {record.proofRequestData?.challenge?.slice(0, 20) ?? "—"}…
            </div>
          </div>

          <div
            style={{
              padding: "10px 12px",
              background: "var(--bg-overlay)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Domain
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
              }}
            >
              {record.proofRequestData?.domain ?? "—"}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((p) => !p)}
          style={{ fontSize: 11, width: "100%", justifyContent: "center" }}
        >
          {expanded ? "▲ Hide Verification Details" : "▼ Show Verification Details"}
        </Button>
      </div>

      {expanded && (
        <div
          className="animate-fade-in"
          style={{
            padding: "0 18px 18px",
            borderTop: "1px solid var(--border)",
            paddingTop: 16,
          }}
        >
          <VerificationResultPanel result={result} />
        </div>
      )}
    </div>
  );
}
