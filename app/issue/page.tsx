"use client";

import { useState, useEffect } from "react";
import { useCredentials } from "@/hooks/useCredentials";
import { useToast } from "@/hooks/useToast";
import { listManagedDIDs } from "@/lib/identus";
import { IssueCredentialForm } from "@/components/credentials/IssueCredentialForm";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastContainer } from "@/components/ui/Toast";
import type { ManagedDID } from "@/types";

export default function IssuePage() {
  const { records, loading, error, issuing, refresh, issue } = useCredentials();
  const { toasts, push, dismiss } = useToast();

  const [dids, setDIDs]             = useState<ManagedDID[]>([]);
  const [didsLoading, setDIDsLoading] = useState(true);

  useEffect(() => {
    listManagedDIDs()
      .then(setDIDs)
      .catch(() => push("error", "Failed to load DIDs"))
      .finally(() => setDIDsLoading(false));
  }, []);

  async function handleIssue(params: {
    issuingDID: string;
    subjectDID: string;
    claims: Record<string, string>;
    validityPeriod: number;
  }) {
    const record = await issue(params);
    if (record) {
      push(
        "success",
        "Credential offer sent",
        `Record ${record.recordId.slice(0, 12)}… · state: ${record.protocolState}` 
      );
    } else {
      push("error", "Issuance failed", error ?? "Unknown error");
    }
  }

  return (
    <>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} className="animate-fade-in">
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: 6,
            }}
          >
            Issue Credential
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Issue a W3C Verifiable Credential as a signed JWT from any managed DID
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "420px 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <IssueCredentialForm
            dids={dids}
            didsLoading={didsLoading}
            issuing={issuing}
            onIssue={handleIssue}
          />

          <Card>
            <CardHeader
              title="Credential Records"
              subtitle={`${records.length} record${records.length !== 1 ? "s" : ""} · auto-polling active`}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={refresh}
                  disabled={loading}
                >
                  ↻ Refresh
                </Button>
              }
            />

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--error-subtle)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  color: "var(--error)",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 16,
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-lg)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <Skeleton height={12} width="50%" />
                    <Skeleton height={12} width="35%" />
                    <Skeleton height={28} width="80%" radius={99} />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 10, opacity: 0.35 }}>✦</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 4 }}>
                  No credentials issued yet
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Fill the form and issue your first VC
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {records.map((r) => (
                  <div key={r.recordId} className="animate-fade-in">
                    <CredentialCard record={r} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
