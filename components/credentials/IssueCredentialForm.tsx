"use client";

import { useState, FormEvent } from "react";
import { DIDSelector } from "./DIDSelector";
import { ClaimBuilder } from "./ClaimBuilder";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import type { ManagedDID } from "@/types";
import type { Claim } from "./ClaimBuilder";

interface IssueCredentialFormProps {
  dids: ManagedDID[];
  didsLoading: boolean;
  issuing: boolean;
  onIssue: (params: {
    issuingDID: string;
    subjectDID: string;
    claims: Record<string, string>;
    validityPeriod: number;
  }) => Promise<void>;
}

const VALIDITY_OPTIONS = [
  { label: "1 hour",   value: 3_600      },
  { label: "24 hours", value: 86_400     },
  { label: "7 days",   value: 604_800    },
  { label: "30 days",  value: 2_592_000  },
  { label: "1 year",   value: 31_536_000 },
];

export function IssueCredentialForm({
  dids,
  didsLoading,
  issuing,
  onIssue,
}: IssueCredentialFormProps) {
  const [issuerDID, setIssuerDID]       = useState("");
  const [subjectDID, setSubjectDID]     = useState("");
  const [claims, setClaims]             = useState<Claim[]>([]);
  const [validity, setValidity]         = useState(86_400);
  const [formError, setFormError]       = useState<string | null>(null);

  function validate(): string | null {
    if (!issuerDID) return "Select an issuer DID";
    if (!subjectDID) return "Select or enter a subject DID";
    if (issuerDID === subjectDID)
      return "Issuer and subject must be different DIDs";
    if (claims.length === 0) return "Add at least one claim";
    if (claims.some((c) => !c.key || !c.value))
      return "All claims must have both key and value";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError(null);

    const claimMap = Object.fromEntries(claims.map((c) => [c.key, c.value]));
    await onIssue({
      issuingDID: issuerDID,
      subjectDID,
      claims: claimMap,
      validityPeriod: validity,
    });
  }

  return (
    <Card>
      <CardHeader
        title="Issue Verifiable Credential"
        subtitle="Creates a signed W3C VC (JWT) and initiates the offer flow"
      />

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <DIDSelector
            label="Issuer DID"
            dids={dids}
            loading={didsLoading}
            value={issuerDID}
            onChange={setIssuerDID}
            placeholder="Select issuing DID"
          />

          <DIDSelector
            label="Subject DID (Holder)"
            dids={dids}
            loading={didsLoading}
            value={subjectDID}
            onChange={setSubjectDID}
            allowManual
            placeholder="Select or enter subject DID"
          />

          <ClaimBuilder claims={claims} onChange={setClaims} />

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
              Validity Period
            </label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {VALIDITY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setValidity(o.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 99,
                    fontSize: 12,
                    border: `1px solid ${validity === o.value ? "var(--accent)" : "var(--border)"}`,
                    background:
                      validity === o.value
                        ? "var(--accent-subtle)"
                        : "var(--bg-elevated)",
                    color:
                      validity === o.value
                        ? "var(--accent-hover)"
                        : "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.12s",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 4,
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {claims.length} claim{claims.length !== 1 ? "s" : ""} ·{" "}
              {VALIDITY_OPTIONS.find((o) => o.value === validity)?.label}
            </div>
            <Button type="submit" loading={issuing} size="md">
              Issue Credential
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
