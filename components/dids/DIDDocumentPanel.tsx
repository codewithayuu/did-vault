"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DIDDocument } from "@/types";

interface DIDDocumentPanelProps {
  document: DIDDocument | null;
  loading: boolean;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        background: "var(--bg-overlay)",
        border: "1px solid var(--border)",
        borderRadius: 99,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)",
        margin: "2px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 280,
        whiteSpace: "nowrap",
      }}
      title={text}
    >
      {text}
    </span>
  );
}

export function DIDDocumentPanel({ document, loading }: DIDDocumentPanelProps) {
  const [rawOpen, setRawOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 4 }}>
        <Skeleton height={12} width="60%" />
        <Skeleton height={12} width="80%" />
        <Skeleton height={12} width="45%" />
      </div>
    );
  }

  if (!document) {
    return (
      <div
        style={{
          padding: "32px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        Click Resolve on any DID to inspect its document
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Section title="DID Identifier">
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--accent-hover)",
            wordBreak: "break-all",
            lineHeight: 1.6,
            padding: "8px 12px",
            background: "var(--accent-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--accent-glow)",
          }}
        >
          {document.id}
        </div>
      </Section>

      <Section title={`Verification Methods (${document.verificationMethod?.length ?? 0})`}>
        {document.verificationMethod?.map((vm) => (
          <div
            key={vm.id}
            style={{
              padding: "10px 12px",
              background: "var(--bg-overlay)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 6,
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
              {vm.id}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {vm.type}
            </div>
            {vm.publicKeyJwk && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  wordBreak: "break-all",
                }}
              >
                {JSON.stringify(vm.publicKeyJwk, null, 0)}
              </div>
            )}
          </div>
        ))}
      </Section>

      {document.authentication && document.authentication.length > 0 && (
        <Section title="Authentication">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {document.authentication.map((a) => <Pill key={a} text={a} />)}
          </div>
        </Section>
      )}

      {document.assertionMethod && document.assertionMethod.length > 0 && (
        <Section title="Assertion Method">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {document.assertionMethod.map((a) => <Pill key={a} text={a} />)}
          </div>
        </Section>
      )}

      {document.service && document.service.length > 0 && (
        <Section title={`Service Endpoints (${document.service.length})`}>
          {document.service.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "8px 12px",
                background: "var(--bg-overlay)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 4,
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{s.type}</span>
              <span style={{ color: "var(--text-muted)", margin: "0 6px" }}>→</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)" }}>
                {Array.isArray(s.serviceEndpoint) ? s.serviceEndpoint.join(", ") : s.serviceEndpoint}
              </span>
            </div>
          ))}
        </Section>
      )}

      <div>
        <button
          onClick={() => setRawOpen((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            fontFamily: "inherit",
          }}
        >
          <span style={{ transform: rawOpen ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>
            ▶
          </span>
          Raw JSON
        </button>
        {rawOpen && (
          <pre
            style={{
              marginTop: 8,
              padding: 14,
              background: "var(--bg-base)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: 10.5,
              fontFamily: "var(--font-mono)",
              color: "var(--text-secondary)",
              overflow: "auto",
              maxHeight: 320,
              lineHeight: 1.7,
            }}
          >
            {JSON.stringify(document, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
