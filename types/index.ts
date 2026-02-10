export type DIDStatus = "CREATED" | "PUBLICATION_PENDING" | "PUBLISHED" | "DEACTIVATED";

export interface ManagedDID {
  did: string;
  longFormDid?: string;
  status: DIDStatus;
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

export interface DIDDocument {
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  service?: ServiceEndpoint[];
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
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
  credentialFormat: "JWT" | "SDJWT" | "AnonCreds";
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

export interface AgentHealth {
  version: string;
  status: "ok" | "degraded" | "unreachable";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}
