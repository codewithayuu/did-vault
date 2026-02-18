import { useState, useEffect, useCallback, useRef } from "react";
import {
  listCredentialRecords,
  issueCredential,
  getCredentialRecord,
} from "@/lib/identus";
import type { CredentialRecord } from "@/types";

const POLL_INTERVAL = 4_000;
const TERMINAL_STATES = new Set([
  "CredentialSent",
  "CredentialReceived",
  "ProblemReportReceived",
]);

interface UseCredentialsReturn {
  records: CredentialRecord[];
  loading: boolean;
  error: string | null;
  issuing: boolean;
  refresh: () => Promise<void>;
  issue: (params: {
    issuingDID: string;
    subjectDID: string;
    claims: Record<string, string>;
    validityPeriod?: number;
  }) => Promise<CredentialRecord | null>;
}

export function useCredentials(): UseCredentialsReturn {
  const [records, setRecords]   = useState<CredentialRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [issuing, setIssuing]   = useState(false);
  const pollingRef               = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCredentialRecords();
      setRecords(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return () => {
      pollingRef.current.forEach((t) => clearInterval(t));
    };
  }, [refresh]);

  const pollRecord = useCallback((recordId: string) => {
    if (pollingRef.current.has(recordId)) return;

    const timer = setInterval(async () => {
      try {
        const updated = await getCredentialRecord(recordId);
        setRecords((prev) =>
          prev.map((r) => (r.recordId === recordId ? updated : r))
        );
        if (TERMINAL_STATES.has(updated.protocolState)) {
          clearInterval(timer);
          pollingRef.current.delete(recordId);
        }
      } catch {
        clearInterval(timer);
        pollingRef.current.delete(recordId);
      }
    }, POLL_INTERVAL);

    pollingRef.current.set(recordId, timer);
  }, []);

  const issue = useCallback(
    async (params: {
      issuingDID: string;
      subjectDID: string;
      claims: Record<string, string>;
      validityPeriod?: number;
    }): Promise<CredentialRecord | null> => {
      setIssuing(true);
      setError(null);
      try {
        const record = await issueCredential(params);
        setRecords((prev) => [record, ...prev]);
        pollRecord(record.recordId);
        return record;
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        setIssuing(false);
      }
    },
    [pollRecord]
  );

  return { records, loading, error, issuing, refresh, issue };
}
