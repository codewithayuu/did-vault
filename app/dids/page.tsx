"use client";

import { useState } from "react";
import { useDIDs } from "@/hooks/useDIDs";
import { useToast } from "@/hooks/useToast";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { DIDTable } from "@/components/dids/DIDTable";
import { DIDDocumentPanel } from "@/components/dids/DIDDocumentPanel";
import { CreateDIDModal } from "@/components/dids/CreateDIDModal";
import type { DIDDocument } from "@/types";

export default function DIDsPage() {
  const { dids, loading, error, refresh, create, resolve, publish, creating, resolving, publishing } = useDIDs();
  const { toasts, push, dismiss } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [resolvedDoc, setResolvedDoc] = useState<DIDDocument | null>(null);
  const [resolvedFor, setResolvedFor] = useState<string | null>(null);

  async function handleCreate() {
    const longForm = await create();
    if (longForm) {
      setModalOpen(false);
      push("success", "DID created", longForm.slice(0, 48) + "…");
    } else {
      push("error", "Failed to create DID", error ?? "Unknown error");
    }
  }

  async function handleResolve(did: string) {
    setResolvedFor(did);
    const doc = await resolve(did);
    if (doc) {
      setResolvedDoc(doc);
      push("info", "DID resolved");
    } else {
      push("error", "Resolution failed", error ?? "Could not reach agent");
    }
  }

  async function handlePublish(did: string) {
    const ok = await publish(did);
    if (ok) {
      push("success", "Publication submitted", "DID will be anchored on Cardano shortly");
    } else {
      push("error", "Publish failed", error ?? "Unknown error");
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
            DID Manager
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Create and manage PRISM DIDs anchored on Cardano via Hyperledger Identus
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <Card>
            <CardHeader
              title="Managed DIDs"
              subtitle={`${dids.length} DID${dids.length !== 1 ? "s" : ""} in this wallet`}
              action={
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
                    ↻ Refresh
                  </Button>
                  <Button size="sm" onClick={() => setModalOpen(true)}>
                    + New DID
                  </Button>
                </div>
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

            <DIDTable
              dids={dids}
              loading={loading}
              onResolve={handleResolve}
              onPublish={handlePublish}
              resolving={resolving}
              publishing={publishing}
            />
          </Card>

          <Card style={{ position: "sticky", top: 16 }}>
            <CardHeader
              title="DID Document"
              subtitle={resolvedFor ? `Resolved ${new Date().toLocaleTimeString()}` : "No document loaded"}
            />
            <DIDDocumentPanel document={resolvedDoc} loading={resolving} />
          </Card>
        </div>
      </div>

      <CreateDIDModal
        open={modalOpen}
        creating={creating}
        onCreate={handleCreate}
        onClose={() => setModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
