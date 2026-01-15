import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = process.env.AGENT_BASE_URL || "http://localhost:8085";
const API_KEY = process.env.AGENT_API_KEY || "changeme";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    apikey: API_KEY,
    "Content-Type": "application/json",
  },
});

async function checkHealth(): Promise<void> {
  process.stdout.write("Checking agent health... ");
  const res = await client.get("/cloud-agent/v1/_system/health");
  console.log("OK —", JSON.stringify(res.data));
}

async function createDID(): Promise<string> {
  process.stdout.write("Creating DID... ");
  const res = await client.post("/cloud-agent/v1/did-registrar/dids", {
    documentTemplate: {
      publicKeys: [
        { id: "auth-1", purpose: "authentication" },
        { id: "issue-1", purpose: "assertionMethod" },
      ],
      services: [],
    },
  });

  const { longFormDid, scheduledOperation } = res.data;
  console.log("Done");
  console.log("  Long-form DID :", longFormDid);
  console.log("  Operation ID  :", scheduledOperation?.id ?? "n/a");
  return longFormDid as string;
}

async function publishDID(shortFormDid: string): Promise<void> {
  process.stdout.write(`Publishing ${shortFormDid}... `);
  await client.post(
    `/cloud-agent/v1/did-registrar/dids/${encodeURIComponent(shortFormDid)}/publications` 
  );
  console.log("Submitted to ledger");
}

async function listDIDs(): Promise<void> {
  const res = await client.get("/cloud-agent/v1/did-registrar/dids");
  const dids: Array<{ did: string; status: string }> = res.data.contents ?? [];

  console.log(`\nManaged DIDs (${dids.length} total):`);
  dids.forEach((d, i) => {
    console.log(`  [${i + 1}] ${d.did}  status=${d.status}`);
  });
}

async function resolveDID(did: string): Promise<void> {
  process.stdout.write(`Resolving ${did}... `);
  const encoded = encodeURIComponent(did);
  const res = await client.get(`/cloud-agent/v1/dids/${encoded}`);
  console.log("Resolved");
  console.log(JSON.stringify(res.data, null, 2));
}

async function main(): Promise<void> {
  console.log("=== DID Vault — Phase 1 CLI ===\n");

  await checkHealth();

  const longFormDid = await createDID();

  const shortFormDid = longFormDid.split(":").slice(0, 3).join(":");

  await listDIDs();

  await resolveDID(longFormDid);

  console.log("\nPhase 1 complete.");
  console.log("Short-form DID (use for publishing):", shortFormDid);
  console.log(
    "Run publishDID after the agent confirms the DID is in CREATED state."
  );
}

main().catch((err) => {
  console.error("Error:", err?.response?.data ?? err.message);
  process.exit(1);
});
