"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ManagedDID } from "@/types";

interface DIDCardProps {
  did: ManagedDID;
  onResolve: (did: string) => void;
  onPublish: (did: string) => void;
  resolving: boolean;
  publishing: boolean;
}

function truncateDID(did: string, chars = 14): string {
  const parts = did.split(":");
  if (parts.length < 3) return did;
  const suffix = parts[parts.length - 1];
  if (suffix.length <= chars * 2) return did;
  return `${did.slice(0, did.indexOf(suffix) + chars)}…${suffix.slice(-chars)}`;
}

export function DIDCard({ did, onResolve, onPublish, resolving, publishing }: DIDCardProps) {
  const canPublish = did.status === "CREATED";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 16px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-glow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        ⬡
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 3,
          }}
          title={did.did}
        >
          {truncateDID(did.did)}
        </div>
        {did.longFormDid && (
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={did.longFormDid}
          >
            long-form available
          </div>
        )}
      </div>

      <Badge variant={did.status} />

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {canPublish && (
          <Button
            variant="secondary"
            size="sm"
            loading={publishing}
            onClick={() => onPublish(did.did)}
          >
            Publish
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          loading={resolving}
          onClick={() => onResolve(did.longFormDid ?? did.did)}
        >
          Resolve
        </Button>
      </div>
    </div>
  );
}
