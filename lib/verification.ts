import type { PresentationRecord } from "@/types";

export type VerificationStatus =
  | "VERIFIED"
  | "FAILED"
  | "PENDING"
  | "REJECTED"
  | "UNKNOWN";

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  checkedAt: Date;
  details: VerificationDetail[];
}

export interface VerificationDetail {
  check: string;
  passed: boolean;
  info?: string;
}

const VERIFIED_STATES   = new Set(["PresentationVerified"]);
const FAILED_STATES     = new Set(["PresentationFailed", "ProblemReportReceived"]);
const REJECTED_STATES   = new Set(["PresentationRejected"]);
const PENDING_STATES    = new Set([
  "RequestPending",
  "RequestSent",
  "PresentationPending",
  "PresentationReceived",
  "PresentationGenerated",
]);

export function deriveVerificationStatus(state: string): VerificationStatus {
  if (VERIFIED_STATES.has(state))  return "VERIFIED";
  if (FAILED_STATES.has(state))    return "FAILED";
  if (REJECTED_STATES.has(state))  return "REJECTED";
  if (PENDING_STATES.has(state))   return "PENDING";
  return "UNKNOWN";
}

export function buildVerificationResult(
  record: PresentationRecord
): VerificationResult {
  const status = deriveVerificationStatus(record.status);
  const details: VerificationDetail[] = [];

  details.push({
    check: "Protocol state",
    passed: status === "VERIFIED",
    info: record.status,
  });

  details.push({
    check: "Challenge present",
    passed: Boolean(record.proofRequestData?.challenge),
    info: record.proofRequestData?.challenge
      ? record.proofRequestData.challenge.slice(0, 24) + "…"
      : "missing",
  });

  details.push({
    check: "Domain bound",
    passed: Boolean(record.proofRequestData?.domain),
    info: record.proofRequestData?.domain ?? "missing",
  });

  details.push({
    check: "Record integrity",
    passed: Boolean(record.recordId && record.thid),
    info: record.recordId ? "thid matched" : "missing identifiers",
  });

  const messageMap: Record<VerificationStatus, string> = {
    VERIFIED: "Credential presentation verified successfully",
    FAILED:   "Verification failed — credential or proof is invalid",
    REJECTED: "Presentation was rejected by the verifier",
    PENDING:  "Waiting for the holder to respond to the proof request",
    UNKNOWN:  "Verification state could not be determined",
  };

  return {
    status,
    message: messageMap[status],
    checkedAt: new Date(),
    details,
  };
}

export function generateChallenge(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isTerminalPresentationState(state: string): boolean {
  return (
    VERIFIED_STATES.has(state) ||
    FAILED_STATES.has(state) ||
    REJECTED_STATES.has(state)
  );
}
