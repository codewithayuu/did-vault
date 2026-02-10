import Link from "next/link";

export default function HomePage() {
  const cards = [
    {
      href: "/dids",
      icon: "⬡",
      label: "DID Management",
      description: "Create, publish and resolve PRISM DIDs on the Cardano ledger.",
      accent: "#7c6af7",
    },
    {
      href: "/issue",
      icon: "✦",
      label: "Issue Credential",
      description: "Issue W3C Verifiable Credentials as signed JWTs to any DID.",
      accent: "#22c55e",
    },
    {
      href: "/verify",
      icon: "◈",
      label: "Verify Credential",
      description: "Present and verify credentials through the proof request flow.",
      accent: "#3b82f6",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }} className="animate-fade-in">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-glow)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 12,
            color: "var(--accent-hover)",
            marginBottom: 20,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          Hyperledger Identus
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 16,
            background: "linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DID Vault
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 500, lineHeight: 1.65 }}>
          A self-sovereign identity portal. Create DIDs, issue verifiable credentials,
          and verify proofs — all anchored on Cardano via PRISM.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              textDecoration: "none",
              animationDelay: `${i * 60}ms`,
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "28px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = c.accent + "55";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${c.accent}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: c.accent + "18",
                  border: `1px solid ${c.accent}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 18,
                  color: c.accent,
                }}
              >
                {c.icon}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: "var(--text-primary)" }}>
                {c.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {c.description}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          padding: "20px 24px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
        className="animate-fade-in"
      >
        {[
          { label: "Protocol", value: "PRISM DID v2" },
          { label: "Credential Format", value: "JWT / W3C VC" },
          { label: "Transport", value: "DIDComm v2" },
          { label: "Ledger", value: "Cardano" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
