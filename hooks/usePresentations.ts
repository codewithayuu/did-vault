import { useState, useEffect, useCallback, useRef } from "react";
import {
  listPresentations,
  createPresentationRequest,
  getPresentation,
} from "@/lib/identus";
import { isTerminalPresentationState } from "@/lib/verification";
import type { PresentationRecord } from "@/types";

const POLL_INTERVAL = 3_500;

interface UsePresentationsReturn {
  presentations: PresentationRecord[];
  loading: boolean;
  error: string | null;
  requesting: boolean;
  refresh: () => Promise<void>;
  createRequest: (params: {
    connectionId?: string;
    challenge: string;
    domain: string;
  }) => Promise<PresentationRecord | null>;
}

export function usePresentations(): UsePresentationsReturn {
  const [presentations, setPresentations] = useState<PresentationRecord[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [requesting, setRequesting]       = useState(false);
  const pollingRef                         = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPresentations();
      setPresentations(data);
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

  const pollPresentation = useCallback((recordId: string) => {
    if (pollingRef.current.has(recordId)) return;

    const timer = setInterval(async () => {
      try {
        const updated = await getPresentation(recordId);
        setPresentations((prev) =>
          prev.map((p) => (p.recordId === recordId ? updated : p))
        );
        if (isTerminalPresentationState(updated.status)) {
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

  const createRequest = useCallback(
    async (params: {
      connectionId?: string;
      challenge: string;
      domain: string;
    }): Promise<PresentationRecord | null> => {
      setRequesting(true);
      setError(null);
      try {
        const record = await createPresentationRequest(params);
        setPresentations((prev) => [record, ...prev]);
        pollPresentation(record.recordId);
        return record;
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        setRequesting(false);
      }
    },
    [pollPresentation]
  );

  return {
    presentations,
    loading,
    error,
    requesting,
    refresh,
    createRequest,
  };
}
