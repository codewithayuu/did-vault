import { useState, useEffect, useCallback, useRef } from "react";
import { getAgentHealth } from "@/lib/identus";
import type { AgentHealth } from "@/types";

const POLL_MS      = 20_000;
const RETRY_MS     = 5_000;
const GRACE_TICKS  = 2;

interface UseAgentHealthReturn {
  health: AgentHealth | null;
  consecutive: number;
  agentDown: boolean;
  recheck: () => void;
}

export function useAgentHealth(): UseAgentHealthReturn {
  const [health, setHealth]           = useState<AgentHealth | null>(null);
  const [consecutive, setConsecutive] = useState(0);
  const failRef                        = useRef(0);
  const timerRef                       = useRef<NodeJS.Timeout | null>(null);

  const check = useCallback(async () => {
    const result = await getAgentHealth();
    setHealth(result);

    if (result.status !== "ok") {
      failRef.current += 1;
      setConsecutive(failRef.current);
      timerRef.current = setTimeout(check, RETRY_MS);
    } else {
      failRef.current = 0;
      setConsecutive(0);
      timerRef.current = setTimeout(check, POLL_MS);
    }
  }, []);

  useEffect(() => {
    check();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [check]);

  const recheck = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    check();
  }, [check]);

  return {
    health,
    consecutive,
    agentDown: failRef.current >= GRACE_TICKS,
    recheck,
  };
}
