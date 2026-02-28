/**
 * In-memory TTL cache for market data to reduce external API calls and respect rate limits.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<K, V> {
  private store = new Map<K, CacheEntry<V>>();
  private readonly ttlMs: number;

  constructor(ttlSeconds: number) {
    this.ttlMs = ttlSeconds * 1000;
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.store.clear();
  }
}

/** Cache for CMP: short TTL (e.g. 60s) for near real-time. */
export const cmpCache = new TtlCache<string, number>(60);

/** Cache for P/E and earnings: longer TTL (e.g. 300s). */
export const fundamentalsCache = new TtlCache<string, { peRatio: number | null; latestEarnings: string | null }>(300);
