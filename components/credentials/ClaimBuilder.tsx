"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export interface Claim {
  key: string;
  value: string;
}

interface ClaimBuilderProps {
  claims: Claim[];
  onChange: (claims: Claim[]) => void;
}

const PRESET_SCHEMAS: { label: string; claims: Claim[] }[] = [
  {
    label: "Identity",
    claims: [
      { key: "firstName", value: "" },
      { key: "lastName", value: "" },
      { key: "dateOfBirth", value: "" },
      { key: "nationalId", value: "" },
    ],
  },
  {
    label: "Education",
    claims: [
      { key: "degree", value: "" },
      { key: "institution", value: "" },
      { key: "graduationDate", value: "" },
      { key: "gpa", value: "" },
    ],
  },
  {
    label: "Employment",
    claims: [
      { key: "employer", value: "" },
      { key: "jobTitle", value: "" },
      { key: "startDate", value: "" },
      { key: "employeeId", value: "" },
    ],
  },
  {
    label: "Membership",
    claims: [
      { key: "organization", value: "" },
      { key: "memberSince", value: "" },
      { key: "tier", value: "" },
      { key: "memberId", value: "" },
    ],
  },
];

function validateKey(key: string): string | null {
  if (!key) return "Key is required";
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key))
    return "camelCase or snake_case only";
  return null;
}

export function ClaimBuilder({ claims, onChange }: ClaimBuilderProps) {
  const [newKey, setNewKey]     = useState("");
  const [newValue, setNewValue] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);

  function addClaim() {
    const err = validateKey(newKey);
    if (err) { setKeyError(err); return; }
    if (claims.some((c) => c.key === newKey)) {
      setKeyError("Duplicate key");
      return;
    }
    onChange([...claims, { key: newKey.trim(), value: newValue.trim() }]);
    setNewKey("");
    setNewValue("");
    setKeyError(null);
  }

  function removeClaim(idx: number) {
    onChange(claims.filter((_, i) => i !== idx));
  }

  function updateClaim(idx: number, field: "key" | "value", val: string) {
    onChange(claims.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  }

  function applyPreset(preset: { claims: Claim[] }) {
    onChange(preset.claims.map((c) => ({ ...c })));
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          Credential Claims
        </label>
        <div style={{ display: "flex", gap: 6 }}>
          {PRESET_SCHEMAS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 99,
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {claims.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 10,
          }}
        >
          {claims.map((c, i) => (
            <div
              key={i}
              className="animate-fade-in"
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                value={c.key}
                onChange={(e) => updateClaim(i, "key", e.target.value)}
                placeholder="key"
                style={{
                  flex: "0 0 38%",
                  padding: "8px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
              />
              <input
                value={c.value}
                onChange={(e) => updateClaim(i, "value", e.target.value)}
                placeholder="value"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => removeClaim(i)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--error-subtle)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "var(--error)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            value={newKey}
            onChange={(e) => { setNewKey(e.target.value); setKeyError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") addClaim(); }}
            placeholder="claimKey"
            style={{
              padding: "8px 12px",
              background: "var(--bg-elevated)",
              border: `1px solid ${keyError ? "var(--error)" : "var(--border-strong)"}`,
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              outline: "none",
              width: "100%",
            }}
          />
          {keyError && (
            <span style={{ fontSize: 10, color: "var(--error)" }}>{keyError}</span>
          )}
        </div>
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addClaim(); }}
          placeholder="value"
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: 12,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addClaim}
          style={{ flexShrink: 0, height: 36 }}
        >
          + Add
        </Button>
      </div>

      {claims.length === 0 && (
        <div
          style={{
            marginTop: 10,
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            border: "1px dashed var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          No claims yet — add one above or pick a preset schema
        </div>
      )}
    </div>
  );
}
