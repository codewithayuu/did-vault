"use client";

import { useState } from "react";
import { decodeJWT, formatJWTPayloadDate, extractVCClaims } from "@/lib/jwt";
import { Button } from "@/components/ui/Button";

type ViewMode = "decoded" | "raw";

interface CredentialRawPanelProps {
  jwt: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} style={{ fontSize: 11 }}>
      {copied ? "✓ Copied" : "Copy"}
    </Button>
  );
}

function KeyValue({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "7px 0",
        borderBottom: "1px solid var(--border)",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          flex: "0 0 120px",
          fontSize: 11,
          color: "var(--text-muted)",
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-primary)",
          wordBreak: "break-all",
          lineHeight: 1.5,
          fontFamily: mono ? "var(--font-mono)" : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function CredentialRawPanel({ jwt }: CredentialRawPanelProps) {
  const [view, setView] = useState<ViewMode>("decoded");
  const decoded = decodeJWT(jwt);

  if (!decoded) {
    return (
      <pre
        style={{
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--text-secondary)",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          padding: 14,
          background: "var(--bg-base)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
        }}
      >
        {jwt}
      </pre>
    );
  }

  const vcClaims = extractVCClaims(decoded.payload);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {(["decoded", "raw"] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setView(m)}
              style={{
                padding: "5px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: 11,
                border: "none",
                background: view === m ? "var(--accent-subtle)" : "transparent",
                color: view === m ? "var(--accent-hover)" : "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: view === m ? 600 : 400,
                transition: "all 0.12s",
              }}
            >
              {m === "decoded" ? "Decoded" : "Raw JWT"}
            </button>
          ))}
        </div>
        <CopyButton text={view === "raw" ? jwt : JSON.stringify(decoded.payload, null, 2)} />
      </div>

      {view === "decoded" ? (
        <div className="animate-fade-in">
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 6,
            }}
          >
            Header
          </div>
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "var(--bg-overlay)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <KeyValue label="algorithm" value={String(decoded.header["alg"] ?? "—")} mono />
            <KeyValue label="type" value={String(decoded.header["typ"] ?? "—")} mono />
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 6,
            }}
          >
            Payload
          </div>
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "var(--bg-overlay)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            {decoded.payload["iss"] && (
              <KeyValue label="issuer" value={String(decoded.payload["iss"])} mono />
            )}
            {decoded.payload["sub"] && (
              <KeyValue label="subject" value={String(decoded.payload["sub"])} mono />
            )}
            {decoded.payload["nbf"] && (
              <KeyValue
                label="not before"
                value={formatJWTPayloadDate(decoded.payload["nbf"])}
              />
            )}
            {decoded.payload["exp"] && (
              <KeyValue
                label="expires"
                value={formatJWTPayloadDate(decoded.payload["exp"])}
              />
            )}
            {decoded.payload["jti"] && (
              <KeyValue label="jti" value={String(decoded.payload["jti"])} mono />
            )}
          </div>

          {Object.keys(vcClaims).length > 0 && (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                Credential Subject Claims
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--success-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                {Object.entries(vcClaims).map(([k, v]) => (
                  <KeyValue key={k} label={k} value={v} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <pre
          className="animate-fade-in"
          style={{
            fontSize: 10.5,
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            padding: 16,
            background: "var(--bg-base)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            lineHeight: 1.7,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {jwt}
        </pre>
      )}

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          sig:
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {decoded.signature.slice(0, 40)}…
        </span>
      </div>
    </div>
  );
}
