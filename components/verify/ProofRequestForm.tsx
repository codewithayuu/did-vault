"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { generateChallenge } from "@/lib/verification";

interface ProofRequestFormProps {
  requesting: boolean;
  onSubmit: (params: {
    connectionId?: string;
    challenge: string;
    domain: string;
  }) => Promise<void>;
}

export function ProofRequestForm({ requesting, onSubmit }: ProofRequestFormProps) {
  const [challenge, setChallenge]       = useState("");
  const [domain, setDomain]             = useState("did-vault.local");
  const [connectionId, setConnectionId] = useState("");
  const [useConnection, setUseConnection] = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);

  useEffect(() => {
    setChallenge(generateChallenge());
  }, []);

  function refreshChallenge() {
    setChallenge(generateChallenge());
  }

  function validate(): string | null {
    if (!challenge.trim()) return "Challenge is required";
    if (challenge.trim().length < 8) return "Challenge must be at least 8 characters";
    if (!domain.trim()) return "Domain is required";
    if (useConnection && !connectionId.trim()) return "Connection ID is required";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError(null);
    await onSubmit({
      challenge: challenge.trim(),
      domain: domain.trim(),
      connectionId: useConnection ? connectionId.trim() : undefined,
    });
  }

  return (
    <Card>
      <CardHeader
        title="Create Proof Request"
        subtitle="Send a presentation challenge to a holder DID"
      />

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                Challenge Nonce
              </label>
              <button
                type="button"
                onClick={refreshChallenge}
                style={{
                  fontSize: 11,
                  color: "var(--accent-hover)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ↻ Regenerate
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: "var(--text-muted)" }}>
              Cryptographic nonce — must be unique per request to prevent replay attacks
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Domain
            </label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="did-vault.local"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: 12,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <div style={{ marginTop: 4, fontSize: 10, color: "var(--text-muted)" }}>
              Scopes the proof to a specific verifier domain
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: useConnection ? 10 : 0,
                cursor: "pointer",
              }}
              onClick={() => setUseConnection((p) => !p)}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1px solid ${useConnection ? "var(--accent)" : "var(--border-strong)"}`,
                  background: useConnection ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                {useConnection ? "✓" : ""}
              </div>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Bind to a DIDComm connection
              </span>
            </div>

            {useConnection && (
              <div className="animate-fade-in">
                <input
                  value={connectionId}
                  onChange={(e) => setConnectionId(e.target.value)}
                  placeholder="connection-uuid"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              padding: "14px 16px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 10,
              }}
            >
              Request Preview
            </div>
            <pre
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                lineHeight: 1.6,
              }}
            >
              {JSON.stringify(
                {
                  options: {
                    challenge: challenge || "…",
                    domain: domain || "…",
                  },
                  ...(useConnection && connectionId
                    ? { connectionId }
                    : {}),
                  proofs: [],
                },
                null,
                2
              )}
            </pre>
          </div>

          {formError && (
            <div
              style={{
                padding: "10px 14px",
                background: "var(--error-subtle)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
                color: "var(--error)",
              }}
            >
              {formError}
            </div>
          )}

          <Button type="submit" loading={requesting} size="md">
            Send Proof Request
          </Button>
        </div>
      </form>
    </Card>
  );
}
