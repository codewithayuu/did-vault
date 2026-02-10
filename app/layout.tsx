import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "DID Vault",
  description: "Self-sovereign identity portal powered by Hyperledger Identus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="page-shell">
          <Sidebar />
          <TopBar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
