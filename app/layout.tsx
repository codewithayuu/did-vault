import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { AgentBannerWrapper } from "@/components/layout/AgentBannerWrapper";

export const metadata: Metadata = {
  title: { default: "DID Vault", template: "%s · DID Vault" },
  description:
    "Self-sovereign identity portal powered by Hyperledger Identus — create DIDs, issue and verify W3C Verifiable Credentials.",
  openGraph: {
    title: "DID Vault",
    description: "SSI portal built on Hyperledger Identus",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="page-shell">
          <Sidebar />
          <TopBar />
          <AgentBannerWrapper />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
