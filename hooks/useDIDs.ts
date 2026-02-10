import { useState, useEffect, useCallback } from "react";
import { listManagedDIDs, createManagedDID, resolveDID, publishDID } from "@/lib/identus";
import type { ManagedDID, DIDDocument } from "@/types";

interface UseDIDsReturn {
  dids: ManagedDID[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: () => Promise<string | null>;
  resolve: (did: string) => Promise<DIDDocument | null>;
  publish: (did: string) => Promise<boolean>;
  creating: boolean;
  resolving: boolean;
  publishing: string | null;
}

export function useDIDs(): UseDIDsReturn {
  const [dids, setDIDs]         = useState<ManagedDID[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listManagedDIDs();
      setDIDs(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (): Promise<string | null> => {
    setCreating(true);
    try {
      const res = await createManagedDID();
      await refresh();
      return res.longFormDid;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setCreating(false);
    }
  }, [refresh]);

  const resolve = useCallback(async (did: string): Promise<DIDDocument | null> => {
    setResolving(true);
    try {
      return await resolveDID(did);
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setResolving(false);
    }
  }, []);

  const publish = useCallback(async (did: string): Promise<boolean> => {
    setPublishing(did);
    try {
      await publishDID(did);
      await refresh();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setPublishing(null);
    }
  }, [refresh]);

  return { dids, loading, error, refresh, create, resolve, publish, creating, resolving, publishing };
}
