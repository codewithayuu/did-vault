"use client";

import { useEffect } from "react";
import type { ToastMessage } from "@/types";

const COLORS: Record<ToastMessage["type"], { bg: string; border: string; icon: string }> = {
  success: { bg: "var(--success-subtle)", border: "rgba(34,197,94,0.3)",  icon: "✓" },
  error:   { bg: "var(--error-subtle)",   border: "rgba(239,68,68,0.3)",  icon: "✕" },
  warning: { bg: "var(--warning-subtle)", border: "rgba(245,158,11,0.3)", icon: "⚠" },
  info:    { bg: "var(--info-subtle)",    border: "rgba(59,130,246,0.3)", icon: "i" },
};

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const c = COLORS[toast.type];

  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="animate-slide-right"
      style={{
        display: "flex",
        gap: 12,
        padding: "14px 16px",
        background: "var(--bg-elevated)",
        border: `1px solid ${c.border}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 300,
        maxWidth: 420,
        cursor: "pointer",
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
          {toast.title}
        </div>
        {toast.description && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {toast.description}
          </div>
        )}
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
