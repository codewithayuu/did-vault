export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: string;
}

export function decodeJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decode = (s: string): Record<string, unknown> =>
      JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));

    return {
      header: decode(parts[0]),
      payload: decode(parts[1]),
      signature: parts[2],
      raw: token,
    };
  } catch {
    return null;
  }
}

export function formatJWTPayloadDate(unix: unknown): string {
  if (typeof unix !== "number") return String(unix);
  return new Date(unix * 1000).toLocaleString();
}

export function extractVCClaims(
  payload: Record<string, unknown>
): Record<string, string> {
  const vc = payload["vc"] as Record<string, unknown> | undefined;
  const subject = vc?.["credentialSubject"] as
    | Record<string, unknown>
    | undefined;
  if (!subject) return {};
  const { id: _id, ...rest } = subject;
  return Object.fromEntries(
    Object.entries(rest).map(([k, v]) => [k, String(v)])
  );
}
