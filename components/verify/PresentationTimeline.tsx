"use client";

interface Step {
  key: string;
  label: string;
}

const STEPS: Step[] = [
  { key: "RequestSent",              label: "Request Sent"       },
  { key: "PresentationReceived",     label: "Proof Received"     },
  { key: "PresentationVerified",     label: "Verified"           },
];

const FAILED_STEP_KEYS = new Set([
  "PresentationFailed",
  "ProblemReportReceived",
  "PresentationRejected",
]);

interface PresentationTimelineProps {
  currentState: string;
}

export function PresentationTimeline({ currentState }: PresentationTimelineProps) {
  const isFailed   = FAILED_STEP_KEYS.has(currentState);
  const currentIdx = STEPS.findIndex((s) => s.key === currentState);
  const activeIdx  = isFailed ? 1 : currentIdx === -1 ? 0 : currentIdx;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((step, i) => {
        const done    = !isFailed && i <= activeIdx;
        const active  = !isFailed && i === activeIdx;
        const failed  = isFailed && i === 1;

        const dotColor = failed
          ? "var(--error)"
          : done
          ? active
            ? "var(--accent)"
            : "var(--success)"
          : "var(--border-strong)";

        const lineColor =
          !isFailed && i < activeIdx ? "var(--success)" : "var(--border)";

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: dotColor,
                  boxShadow: active
                    ? `0 0 8px var(--accent)` 
                    : failed
                    ? "0 0 6px var(--error)"
                    : "none",
                  transition: "background 0.3s, box-shadow 0.3s",
                  animation: active ? "pulse 1.8s ease-in-out infinite" : "none",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: done || failed ? "var(--text-secondary)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                  fontWeight: active || failed ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: lineColor,
                  marginBottom: 14,
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
