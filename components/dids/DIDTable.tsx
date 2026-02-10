"use client";

import { DIDCard } from "./DIDCard";
import { DIDTableSkeleton } from "@/components/ui/Skeleton";
import type { ManagedDID } from "@/types";

interface DIDTableProps {
  dids: ManagedDID[];
  loading: boolean;
  onResolve: (did: string) => void;
  onPublish: (did: string) => void;
  resolving: boolean;
  publishing: string | null;
}

export function DIDTable({ dids, loading, onResolve, onPublish, resolving, publishing }: DIDTableProps) {
  if (loading) return <DIDTableSkeleton />;

  if (dids.length === 0) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>⬡</div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 4 }}>
          No DIDs found
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Create your first DID to get started
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {dids.map((d) => (
        <div key={d.did} className="animate-fade-in">
          <DIDCard
            did={d}
            onResolve={onResolve}
            onPublish={onPublish}
            resolving={resolving}
            publishing={publishing === d.did}
          />
        </div>
      ))}
    </div>
  );
}
