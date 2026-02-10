"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface CreateDIDModalProps {
  open: boolean;
  creating: boolean;
  onCreate: () => void;
  onClose: () => void;
}

export function CreateDIDModal({ open, creating, onCreate, onClose }: CreateDIDModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-in"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          width: 480,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
            Create PRISM DID
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Generates a new DID with authentication and assertionMethod keys.
            The DID is created locally first; publish it to anchor on Cardano.
          </p>
        </div>

        <div
          style={{
            padding: 16,
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            marginBottom: 24,
          }}
        >
          {[
            { label: "Key 1", value: "auth-1 · authentication" },
            { label: "Key 2", value: "issue-1 · assertionMethod" },
            { label: "Curve", value: "secp256k1" },
            { label: "Format", value: "PRISM DID v2" },
          ].map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                padding: "5px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button loading={creating} onClick={onCreate}>
            Generate DID
          </Button>
        </div>
      </div>
    </div>
  );
}
