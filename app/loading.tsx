import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <Skeleton height={28} width={220} style={{ marginBottom: 10 }} />
        <Skeleton height={14} width={380} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Skeleton height={15} width={140} />
            <Skeleton height={32} width={90} radius={6} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Skeleton width={36} height={36} radius={9} />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <Skeleton width="55%" height={11} />
                  <Skeleton width="30%" height={9} />
                </div>
                <Skeleton width={68} height={22} radius={99} />
                <Skeleton width={76} height={30} radius={6} />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
          }}
        >
          <Skeleton height={15} width={110} style={{ marginBottom: 20 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Skeleton height={11} width="60%" />
            <Skeleton height={11} width="80%" />
            <Skeleton height={11} width="45%" />
            <Skeleton height={60} radius={8} style={{ marginTop: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
