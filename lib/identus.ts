import axios, { AxiosInstance } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_AGENT_BASE_URL || "http://localhost:8085";
const API_KEY = process.env.NEXT_PUBLIC_AGENT_API_KEY || "changeme";

export interface DIDDocument {
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  service?: ServiceEndpoint[];
  authentication?: string[];
  assertionMethod?: string[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: Record<string, string>;
  publicKeyMultibase?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string | string[];
}

export interface ManagedDID {
  did: string;
  longFormDid?: string;
  status: string;
}

export interface CreateDIDResponse {
  longFormDid: string;
  scheduledOperation: {
    id: string;
    didRef: string;
  };
}

export interface CredentialRecord {
  recordId: string;
  thid: string;
  credentialFormat: string;
  subjectId: string;
  validityPeriod?: number;
  claims: Record<string, string>;
  automaticIssuance: boolean;
  createdAt: string;
  protocolState: string;
  credential?: string;
  issuingDID?: string;
}

export interface PresentationRecord {
  recordId: string;
  thid: string;
  status: string;
  proofRequestData: {
    challenge: string;
    domain: string;
  };
  createdAt: string;
  updatedAt?: string;
}

function createAgentClient(baseURL: string, apiKey: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      "apikey": apiKey,
      "Content-Type": "application/json",
    },
  });
}

const agentClient = createAgentClient(BASE_URL, API_KEY);

export async function createManagedDID(): Promise<CreateDIDResponse> {
  const payload = {
    documentTemplate: {
      publicKeys: [
        {
          id: "auth-1",
          purpose: "authentication",
        },
        {
          id: "issue-1",
          purpose: "assertionMethod",
        },
      ],
      services: [],
    },
  };

  const response = await agentClient.post<CreateDIDResponse>(
    "/cloud-agent/v1/did-registrar/dids",
    payload
  );
  return response.data;
}

export async function listManagedDIDs(): Promise<ManagedDID[]> {
  const response = await agentClient.get<{ contents: ManagedDID[] }>(
    "/cloud-agent/v1/did-registrar/dids"
  );
  return response.data.contents ?? [];
}

export async function resolveDID(did: string): Promise<DIDDocument> {
  const response = await agentClient.get<{ didDocument: DIDDocument }>(
    `/cloud-agent/v1/dids/${did}` 
  );
  return response.data.didDocument;
}

export async function publishDID(did: string): Promise<void> {
  await agentClient.post(`/cloud-agent/v1/did-registrar/dids/${did}/publications`);
}

export async function issueCredential(params: {
  issuingDID: string;
  subjectDID: string;
  claims: Record<string, string>;
  validityPeriod?: number;
}): Promise<CredentialRecord> {
  const payload = {
    schemaId: null,
    credentialFormat: "JWT",
    claims: params.claims,
    issuingDID: params.issuingDID,
    issuingKid: "issue-1",
    subjectId: params.subjectDID,
    validityPeriod: params.validityPeriod ?? 3600,
    automaticIssuance: true,
  };

  const response = await agentClient.post<CredentialRecord>(
    "/cloud-agent/v1/issue-credentials/credential-offers",
    payload
  );
  return response.data;
}

export async function listCredentialRecords(): Promise<CredentialRecord[]> {
  const response = await agentClient.get<{ contents: CredentialRecord[] }>(
    "/cloud-agent/v1/issue-credentials/records"
  );
  return response.data.contents ?? [];
}

export async function getCredentialRecord(recordId: string): Promise<CredentialRecord> {
  const response = await agentClient.get<CredentialRecord>(
    `/cloud-agent/v1/issue-credentials/records/${recordId}` 
  );
  return response.data;
}

export async function createPresentationRequest(params: {
  connectionId?: string;
  challenge: string;
  domain: string;
}): Promise<PresentationRecord> {
  const payload = {
    connectionId: params.connectionId,
    options: {
      challenge: params.challenge,
      domain: params.domain,
    },
    proofs: [],
  };

  const response = await agentClient.post<PresentationRecord>(
    "/cloud-agent/v1/present-proof/presentations",
    payload
  );
  return response.data;
}

export async function listPresentations(): Promise<PresentationRecord[]> {
  const response = await agentClient.get<{ contents: PresentationRecord[] }>(
    "/cloud-agent/v1/present-proof/presentations"
  );
  return response.data.contents ?? [];
}

export async function getPresentation(presentationId: string): Promise<PresentationRecord> {
  const response = await agentClient.get<PresentationRecord>(
    `/cloud-agent/v1/present-proof/presentations/${presentationId}` 
  );
  return response.data;
}

export async function checkAgentHealth(): Promise<boolean> {
  try {
    await agentClient.get("/cloud-agent/v1/_system/health");
    return true;
  } catch {
    return false;
  }
}

export { agentClient, createAgentClient };
