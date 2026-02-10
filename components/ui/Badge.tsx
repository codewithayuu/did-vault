import type { DIDStatus } from "@/types";

type Variant = "success" | "warning" | "error" | "info" | "neutral" | DIDStatus;

const MAP: Record<string, { bg: string; color: string; label: string }> = {
  success:             { bg: "var(--success-subtle)", color: "var(--success)", label: "Success" },
  warning:             { bg: "var(--warning-subtle)", color: "var(--warning)", label: "Warning" },
  error:               { bg: "var(--error-subtle)",   color: "var(--error)",   label: "Error"   },
  info:                { bg: "var(--info-subtle)",     color: "var(--info)",    label: "Info"    },
  neutral:             { bg: "var(--bg-overlay)",      color: "var(--text-secondary)", label: "Neutral" },
  CREATED:             { bg: "var(--info-subtle)",     color: "var(--info)",    label: "Created"  },
  PUBLICATION_PENDING: { bg: "var(--warning-subtle)", color: "var(--warning)", label: "Pending"  },
  PUBLISHED:           { bg: "var(--success-subtle)", color: "var(--success)", label: "Published" },
  DEACTIVATED:         { bg: "var(--error-subtle)",   color: "var(--error)",   label: "Deactivated" },
};

interface BadgeProps {
  variant: Variant;
  label?: string;
  dot?: boolean;
}

export function Badge({ variant, label, dot = true }: BadgeProps) {
  const style = MAP[variant] ?? MAP["neutral"];
  const text  = label ?? style.label;

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
        background: style.bg,
        color: style.color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: style.color,
            flexShrink: 0,
          }}
        />
      )}
      {text}
    </span>
  );
}
