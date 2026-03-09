"use client";

import { useAgentHealth } from "@/hooks/useAgentHealth";
import { AgentBanner } from "./AgentBanner";

export function AgentBannerWrapper() {
  const { consecutive, recheck } = useAgentHealth();
  return <AgentBanner consecutive={consecutive} onRecheck={recheck} />;
}
