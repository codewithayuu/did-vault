"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dids",   label: "DID Manager",  icon: "⬡" },
  { href: "/issue",  label: "Issue",         icon: "✦" },
  { href: "/verify", label: "Verify",        icon: "◈" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        gridColumn: 1,
        gridRow: "1 / 3",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          height: "var(--topbar-h)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid var(--border)",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          D
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>DID Vault</span>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Navigation
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                background: active ? "var(--accent-subtle)" : "transparent",
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {active && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    marginLeft: "auto",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        <div style={{ marginBottom: 2 }}>Identus Cloud Agent</div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {process.env.NEXT_PUBLIC_AGENT_BASE_URL ?? "http://localhost:8085"}
        </div>
      </div>
    </aside>
  );
}
