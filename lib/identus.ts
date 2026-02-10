import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  ManagedDID,
  DIDDocument,
  CreateDIDResponse,
  CredentialRecord,
  PresentationRecord,
  AgentHealth,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_AGENT_BASE_URL ?? "http://localhost:8085";
const API_KEY = process.env.NEXT_PUBLIC_AGENT_API_KEY ?? "changeme";

function buildClient(baseURL: string, apiKey: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: { apikey: apiKey, "Content-Type": "application/json" },
    timeout: 15_000,
  });

  instance.interceptors.response.use(
    (r) => r,
    (err: AxiosError) => {
      const msg =
        (err.response?.data as Record<string, string>)?.detail ??
        (err.response?.data as Record<string, string>)?.message ??
        err.message;
      return Promise.reject(new Error(msg));
    }
  );

  return instance;
}

export const agentClient = buildClient(BASE_URL, API_KEY);

export async function createManagedDID(): Promise<CreateDIDResponse> {
  const res = await agentClient.post<CreateDIDResponse>(
    "/cloud-agent/v1/did-registrar/dids",
    {
      documentTemplate: {
        publicKeys: [
          { id: "auth-1", purpose: "authentication" },
          { id: "issue-1", purpose: "assertionMethod" },
        ],
        services: [],
      },
    }
  );
  return res.data;
}

export async function listManagedDIDs(): Promise<ManagedDID[]> {
  const res = await agentClient.get<{ contents: ManagedDID[] }>(
    "/cloud-agent/v1/did-registrar/dids"
  );
  return res.data.contents ?? [];
}

export async function resolveDID(did: string): Promise<DIDDocument> {
  const res = await agentClient.get<{ didDocument: DIDDocument }>(
    `/cloud-agent/v1/dids/${encodeURIComponent(did)}`
  );
  return res.data.didDocument;
}

export async function publishDID(did: string): Promise<void> {
  await agentClient.post(
    `/cloud-agent/v1/did-registrar/dids/${encodeURIComponent(did)}/publications`
  );
}

export async function issueCredential(params: {
  issuingDID: string;
  subjectDID: string;
  claims: Record<string, string>;
  validityPeriod?: number;
}): Promise<CredentialRecord> {
  const res = await agentClient.post<CredentialRecord>(
    "/cloud-agent/v1/issue-credentials/credential-offers",
    {
      schemaId: null,
      credentialFormat: "JWT",
      claims: params.claims,
      issuingDID: params.issuingDID,
      issuingKid: "issue-1",
      subjectId: params.subjectDID,
      validityPeriod: params.validityPeriod ?? 3600,
      automaticIssuance: true,
    }
  );
  return res.data;
}

export async function listCredentialRecords(): Promise<CredentialRecord[]> {
  const res = await agentClient.get<{ contents: CredentialRecord[] }>(
    "/cloud-agent/v1/issue-credentials/records"
  );
  return res.data.contents ?? [];
}

export async function getCredentialRecord(id: string): Promise<CredentialRecord> {
  const res = await agentClient.get<CredentialRecord>(
    `/cloud-agent/v1/issue-credentials/records/${id}`
  );
  return res.data;
}

export async function createPresentationRequest(params: {
  connectionId?: string;
  challenge: string;
  domain: string;
}): Promise<PresentationRecord> {
  const res = await agentClient.post<PresentationRecord>(
    "/cloud-agent/v1/present-proof/presentations",
    {
      connectionId: params.connectionId,
      options: { challenge: params.challenge, domain: params.domain },
      proofs: [],
    }
  );
  return res.data;
}

export async function listPresentations(): Promise<PresentationRecord[]> {
  const res = await agentClient.get<{ contents: PresentationRecord[] }>(
    "/cloud-agent/v1/present-proof/presentations"
  );
  return res.data.contents ?? [];
}

export async function getPresentation(id: string): Promise<PresentationRecord> {
  const res = await agentClient.get<PresentationRecord>(
    `/cloud-agent/v1/present-proof/presentations/${id}`
  );
  return res.data;
}

export async function getAgentHealth(): Promise<AgentHealth> {
  try {
    const res = await agentClient.get<{ version: string }>("/cloud-agent/v1/_system/health");
    return { version: res.data.version, status: "ok" };
  } catch {
    return { version: "unknown", status: "unreachable" };
  }
}
