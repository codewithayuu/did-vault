"use client";

import { useMemo, useState } from "react";
import { usePresentations } from "@/hooks/usePresentations";
import { useToast } from "@/hooks/useToast";
import { ProofRequestForm } from "@/components/verify/ProofRequestForm";
import { PresentationCard } from "@/components/verify/PresentationCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastContainer } from "@/components/ui/Toast";
import { deriveVerificationStatus } from "@/lib/verification";
import type { PresentationRecord } from "@/types";

type FilterTab = "ALL" | "PENDING" | "VERIFIED" | "FAILED";

const TABS: FilterTab[] = ["ALL", "PENDING", "VERIFIED", "FAILED"];

function StatsBar({ presentations }: { presentations: PresentationRecord[] }) {
  const stats = useMemo(() => {
    const counts = { VERIFIED: 0, FAILED: 0, PENDING: 0, total: presentations.length };
    presentations.forEach((p) => {
      const s = deriveVerificationStatus(p.status);
      if (s === "VERIFIED") counts.VERIFIED++;
      else if (s === "FAILED" || s === "REJECTED") counts.FAILED++;
      else if (s === "PENDING") counts.PENDING++;
    });
    return counts;
  }, [presentations]);

  const items = [
    { label: "Total",    value: stats.total,    color: "var(--text-secondary)" },
    { label: "Verified", value: stats.VERIFIED,  color: "var(--success)"        },
    { label: "Pending",  value: stats.PENDING,   color: "var(--info)"           },
    { label: "Failed",   value: stats.FAILED,    color: "var(--error)"          },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1,
        background: "var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            padding: "14px 16px",
            background: "var(--bg-elevated)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: item.color,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-mono)",
              marginBottom: 2,
            }}
          >
            {item.value}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function VerifyPage() {
  const { presentations, loading, error, requesting, refresh, createRequest } =
    usePresentations();
  const { toasts, push, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  async function handleSubmit(params: {
    connectionId?: string;
    challenge: string;
    domain: string;
  }) {
    const record = await createRequest(params);
    if (record) {
      push(
        "success",
        "Proof request sent",
        `ID: ${record.recordId.slice(0, 14)}… · polling for response` 
      );
    } else {
      push("error", "Request failed", error ?? "Could not reach agent");
    }
  }

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return presentations;
    return presentations.filter((p) => {
      const s = deriveVerificationStatus(p.status);
      if (activeTab === "FAILED") return s === "FAILED" || s === "REJECTED";
      return s === activeTab;
    });
  }, [presentations, activeTab]);

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
            Verify Credential
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Issue proof requests and verify credential presentations in real time
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <ProofRequestForm requesting={requesting} onSubmit={handleSubmit} />

          <div>
            <StatsBar presentations={presentations} />

            <Card>
              <CardHeader
                title="Presentation Records"
                subtitle={`${filtered.length} of ${presentations.length} records · live polling`}
                action={
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={refresh}
                      disabled={loading}
                    >
                      ↻ Refresh
                    </Button>
                  </div>
                }
              />

              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: activeTab === tab ? 600 : 400,
                      border: `1px solid ${activeTab === tab ? "var(--accent)" : "var(--border)"}`,
                      background:
                        activeTab === tab
                          ? "var(--accent-subtle)"
                          : "var(--bg-elevated)",
                      color:
                        activeTab === tab
                          ? "var(--accent-hover)"
                          : "var(--text-secondary)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.12s",
                    }}
                  >
                    {tab}
                    {tab !== "ALL" && (
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: 10,
                          color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        {presentations.filter((p) => {
                          const s = deriveVerificationStatus(p.status);
                          if (tab === "FAILED") return s === "FAILED" || s === "REJECTED";
                          return s === tab;
                        }).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

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
                        padding: 18,
                        background: "var(--bg-elevated)",
                        borderRadius: "var(--radius-lg)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Skeleton height={11} width="40%" />
                        <Skeleton height={22} width={80} radius={99} />
                      </div>
                      <Skeleton height={10} width="25%" />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                        <Skeleton width={10} height={10} radius="50%" />
                        <Skeleton height={1} width={40} />
                        <Skeleton width={10} height={10} radius="50%" />
                        <Skeleton height={1} width={40} />
                        <Skeleton width={10} height={10} radius="50%" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10, opacity: 0.35 }}>◈</div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      marginBottom: 4,
                    }}
                  >
                    {activeTab === "ALL"
                      ? "No proof requests yet"
                      : `No ${activeTab.toLowerCase()} presentations`}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {activeTab === "ALL"
                      ? "Create a proof request to begin verification"
                      : "Switch to ALL to see all records"}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.map((p) => (
                    <div key={p.recordId} className="animate-fade-in">
                      <PresentationCard record={p} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
