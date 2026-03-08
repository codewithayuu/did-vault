import { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon = "◌",
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: "52px 24px",
        textAlign: "center",
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 36,
          opacity: 0.3,
          lineHeight: 1,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: 5,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
}
