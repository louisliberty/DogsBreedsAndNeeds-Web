import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// How long a successful /api/breeds/version verification stays "fresh" before
// the next breed-list fetch will revalidate. Matches the s-maxage of the
// unversioned breed-list response: 10s is the worst-case staleness window
// after an admin edit.
const BREEDS_VERIFICATION_TTL_MS = 10_000;

let breedsVersionVerifiedAt = 0;
let inFlightBreedsVersion: Promise<void> | null = null;

export function getBreedsVersion(): string | null {
  if (typeof window === "undefined") return null;
  const v = (window as unknown as { __BREEDS_V__?: string }).__BREEDS_V__;
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function setBreedsVersion(version: string): void {
  if (typeof window === "undefined") return;
  (window as unknown as { __BREEDS_V__?: string }).__BREEDS_V__ = version;
}

// Public hook for callers (e.g. admin mutations) that already received the
// authoritative current token via X-Breeds-Version. Treats the token as if
// we'd just verified it ourselves.
export function markBreedsVersionVerified(): void {
  breedsVersionVerifiedAt = Date.now();
}

export function isBreedsVersionVerified(): boolean {
  return breedsVersionVerifiedAt > 0;
}

export async function refreshBreedsVersion(opts: { force?: boolean } = {}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!opts.force && breedsVersionVerifiedAt > 0 && Date.now() - breedsVersionVerifiedAt < BREEDS_VERIFICATION_TTL_MS) {
    return;
  }
  if (inFlightBreedsVersion) return inFlightBreedsVersion;
  inFlightBreedsVersion = (async () => {
    try {
      const res = await fetch("/api/breeds/version", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`bad status ${res.status}`);
      const { version } = (await res.json()) as { version?: string };
      if (version) {
        const previous = getBreedsVersion();
        const hadVerifiedBefore = breedsVersionVerifiedAt > 0;
        setBreedsVersion(version);
        breedsVersionVerifiedAt = Date.now();
        if (hadVerifiedBefore && previous && previous !== version) {
          // Token rotated since last verification (admin edit elsewhere). Drop
          // any cached breed-list query results so observers refetch using the
          // new ?v=<token>.
          queryClient.invalidateQueries({
            predicate: (q) => {
              const key = q.queryKey[0];
              return (
                typeof key === "string" &&
                key.startsWith("/api/breeds") &&
                !key.startsWith("/api/breeds/version")
              );
            },
          });
        }
      }
    } catch {
      // Verification failed (network, 5xx, etc). Do NOT advance
      // breedsVersionVerifiedAt — the next call will retry. Returning here
      // unblocks any awaiting breed-list fetch; withVerifiedBreedsVersion
      // will then fall back to the unversioned (short-cached, must-revalidate)
      // URL rather than stamping a potentially stale token onto an immutable
      // request. This avoids both stale data and indefinite query hangs.
    } finally {
      inFlightBreedsVersion = null;
    }
  })();
  return inFlightBreedsVersion;
}

export async function withVerifiedBreedsVersion(url: string): Promise<string> {
  if (!url.startsWith("/api/breeds")) return url;
  if (url.startsWith("/api/breeds/version")) return url;
  if (/[?&]v=/.test(url)) return url;
  // Always ensure the local token has been verified within the last
  // BREEDS_VERIFICATION_TTL_MS before stamping it onto an immutable URL.
  // refreshBreedsVersion is a no-op if a recent verification is still fresh.
  await refreshBreedsVersion();
  // If verification has never actually succeeded (e.g. /api/breeds/version is
  // failing), fall back to the unversioned URL — short-cached and must-
  // revalidate, never the immutable long-cached one — so we can never serve
  // stale immutable data.
  if (breedsVersionVerifiedAt === 0) return url;
  const v = getBreedsVersion();
  if (!v) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(v)}`;
}

// Synchronous variant for non-awaitable call sites. Only stamps the token
// when a recent verification is on file. Currently used only as a safety
// net; awaitable call sites should prefer withVerifiedBreedsVersion.
export function withBreedsVersion(url: string): string {
  if (!url.startsWith("/api/breeds")) return url;
  if (url.startsWith("/api/breeds/version")) return url;
  if (/[?&]v=/.test(url)) return url;
  if (breedsVersionVerifiedAt === 0) return url;
  if (Date.now() - breedsVersionVerifiedAt >= BREEDS_VERIFICATION_TTL_MS) {
    // Stale verification — kick off a refresh in the background but don't
    // stamp the (possibly outdated) token onto an immutable URL.
    void refreshBreedsVersion();
    return url;
  }
  const v = getBreedsVersion();
  if (!v) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(v)}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const rawUrl = queryKey.join("/") as string;
    // For /api/breeds* queries, await version verification so the very first
    // fetch goes to the immutable versioned URL — otherwise an unversioned
    // request could briefly hit a still-fresh shared cache entry.
    const url = await withVerifiedBreedsVersion(rawUrl);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
