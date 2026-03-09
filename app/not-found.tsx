import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            background:
              "linear-gradient(135deg, var(--text-muted) 0%, var(--bg-overlay) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          404
        </div>

        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            Page not found
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
            }}
          >
            The route you requested does not exist in DID Vault.
          </p>
        </div>

        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
