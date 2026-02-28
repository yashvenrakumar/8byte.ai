/**
 * Market data from Yahoo Finance (CMP, P/E, Latest Earnings).
 * Google Finance can be added later; Yahoo quote provides P/E and earnings date.
 */

import { cmpCache, fundamentalsCache } from './cache.service.js';

/** Convert our symbol (NSE ticker or BSE code) to Yahoo Finance symbol. NSE: .NS, BSE: .BO */
export function toYahooSymbol(nseBse: string): string {
  if (/^\d+$/.test(nseBse)) {
    return `${nseBse}.BO`;
  }
  return `${nseBse}.NS`;
}

interface YahooQuoteResult {
  regularMarketPrice?: number;
  trailingPE?: number;
  earningsTimestamp?: Date;
  earningsTimestampStart?: Date;
}

async function getYahooQuote(symbol: string): Promise<YahooQuoteResult | null> {
  try {
    const YahooFinance = (await import('yahoo-finance2')).default;
    const yf = new YahooFinance();
    const quote = (await yf.quote(symbol)) as YahooQuoteResult;
    return quote ?? null;
  } catch {
    return null;
  }
}

/** Fetch CMP for a symbol; uses cache first. Returns null on failure (caller can use purchase price). */
export async function fetchCmp(nseBse: string): Promise<number | null> {
  const cached = cmpCache.get(nseBse);
  if (cached !== undefined) return cached;

  const yahooSymbol = toYahooSymbol(nseBse);
  const quote = await getYahooQuote(yahooSymbol);
  const price = quote?.regularMarketPrice;
  if (typeof price === 'number' && Number.isFinite(price)) {
    cmpCache.set(nseBse, price);
    return price;
  }
  return null;
}

/** Fetch P/E and Latest Earnings from same quote; uses cache first. */
export async function fetchFundamentals(
  nseBse: string
): Promise<{ peRatio: number | null; latestEarnings: string | null }> {
  const cached = fundamentalsCache.get(nseBse);
  if (cached !== undefined) return cached;

  const yahooSymbol = toYahooSymbol(nseBse);
  const quote = await getYahooQuote(yahooSymbol);
  const pe = quote?.trailingPE;
  const peRatio = typeof pe === 'number' && Number.isFinite(pe) ? pe : null;
  const ts = quote?.earningsTimestamp ?? quote?.earningsTimestampStart;
  const latestEarnings =
    ts instanceof Date && !Number.isNaN(ts.getTime())
      ? ts.toISOString().slice(0, 10)
      : null;

  const result = { peRatio, latestEarnings };
  fundamentalsCache.set(nseBse, result);
  return result;
}

/** Batch: get CMP for multiple symbols with throttling. */
export async function fetchCmpBatch(
  symbols: string[],
  delayMs = 150
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  for (const sym of symbols) {
    const cmp = await fetchCmp(sym);
    if (cmp !== null) map.set(sym, cmp);
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
  return map;
}

/** Batch: get P/E and earnings for multiple symbols. */
export async function fetchFundamentalsBatch(
  symbols: string[],
  delayMs = 150
): Promise<{
  peBySymbol: Map<string, number | null>;
  earningsBySymbol: Map<string, string | null>;
}> {
  const peBySymbol = new Map<string, number | null>();
  const earningsBySymbol = new Map<string, string | null>();
  for (const sym of symbols) {
    const { peRatio, latestEarnings } = await fetchFundamentals(sym);
    peBySymbol.set(sym, peRatio);
    earningsBySymbol.set(sym, latestEarnings);
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
  return { peBySymbol, earningsBySymbol };
}
