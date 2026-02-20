"use client";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ManagedDID } from "@/types";

interface DIDSelectorProps {
  label: string;
  dids: ManagedDID[];
  loading: boolean;
  value: string;
  onChange: (did: string) => void;
  allowManual?: boolean;
  placeholder?: string;
  filterStatus?: string[];
}

function truncate(did: string, head = 20, tail = 12): string {
  if (did.length <= head + tail + 3) return did;
  return `${did.slice(0, head)}…${did.slice(-tail)}`;
}

export function DIDSelector({
  label,
  dids,
  loading,
  value,
  onChange,
  allowManual = false,
  placeholder = "Select a DID",
  filterStatus = [],
}: DIDSelectorProps) {
  const [open, setOpen]       = useState(false);
  const [manual, setManual]   = useState(false);
  const [query, setQuery]     = useState("");
  const containerRef           = useRef<HTMLDivElement>(null);

  const filtered = dids.filter((d) => {
    const statusOk =
      filterStatus.length === 0 || filterStatus.includes(d.status);
    const queryOk =
      query === "" || d.did.toLowerCase().includes(query.toLowerCase());
    return statusOk && queryOk;
  });

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectedDID = dids.find((d) => d.did === value || d.longFormDid === value);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width={80} height={11} />
        <Skeleton height={40} radius={8} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </label>
        {allowManual && (
          <button
            type="button"
            onClick={() => {
              setManual((p) => !p);
              onChange("");
            }}
            style={{
              fontSize: 11,
              color: "var(--accent-hover)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {manual ? "← Pick from list" : "Enter manually →"}
          </button>
        )}
      </div>

      {manual ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="did:prism:…"
          style={{
            padding: "10px 14px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            outline: "none",
            width: "100%",
          }}
        />
      ) : (
        <div ref={containerRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "var(--bg-elevated)",
              border: `1px solid ${open ? "var(--accent)" : "var(--border-strong)"}`,
              borderRadius: "var(--radius-sm)",
              color: value ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: 12,
              fontFamily: value ? "var(--font-mono)" : "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              textAlign: "left",
              transition: "border-color 0.15s",
              outline: "none",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value
                ? truncate(value)
                : placeholder}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.15s",
                flexShrink: 0,
              }}
            >
              ▼
            </span>
          </button>

          {open && (
            <div
              className="animate-fade-in"
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "8px 8px 4px" }}>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search DIDs…"
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ maxHeight: 220, overflowY: "auto", padding: "4px 8px 8px" }}>
                {filtered.length === 0 ? (
                  <div
                    style={{
                      padding: "16px 8px",
                      textAlign: "center",
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    {filterStatus.includes("PUBLISHED")
                      ? "No published DIDs found. Publish a DID first."
                      : "No DIDs match"}
                  </div>
                ) : (
                  filtered.map((d) => {
                    const isSelected = value === d.did || value === d.longFormDid;
                    return (
                      <button
                        key={d.did}
                        type="button"
                        onClick={() => {
                          onChange(d.did);
                          setOpen(false);
                          setQuery("");
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 10px",
                          borderRadius: "var(--radius-sm)",
                          background: isSelected
                            ? "var(--accent-subtle)"
                            : "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "var(--bg-overlay)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background:
                              d.status === "PUBLISHED"
                                ? "var(--success)"
                                : d.status === "PUBLICATION_PENDING"
                                ? "var(--warning)"
                                : "var(--info)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              color: isSelected
                                ? "var(--accent-hover)"
                                : "var(--text-primary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {truncate(d.did)}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              marginTop: 1,
                            }}
                          >
                            {d.status}
                          </div>
                        </div>
                        {isSelected && (
                          <span
                            style={{
                              marginLeft: "auto",
                              color: "var(--accent-hover)",
                              fontSize: 12,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedDID && (
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedDID.longFormDid ? "long-form available" : "short-form only"} ·{" "}
          {selectedDID.status}
        </div>
      )}
    </div>
  );
}
