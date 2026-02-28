import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/** Resolve seed path: prefer dist/data (production), else src/data (dev). */
function getSeedPath(): string {
  const fromDist = join(process.cwd(), 'dist', 'data', 'portfolio.seed.json');
  if (existsSync(fromDist)) return fromDist;
  return join(process.cwd(), 'src', 'data', 'portfolio.seed.json');
}

export interface Holding {
  id: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  nseBse: string;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  latestEarnings: string | null;
  sector: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  holdingsCount: number;
}

export interface SeedHolding {
  id: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  nseBse: string;
  sector: string;
}

function loadSeed(): SeedHolding[] {
  const seedPath = getSeedPath();
  const raw = readFileSync(seedPath, 'utf-8');
  return JSON.parse(raw) as SeedHolding[];
}

function addComputedFields(
  row: SeedHolding,
  cmp: number,
  peRatio: number | null,
  latestEarnings: string | null
): Holding {
  const presentValue = cmp * row.quantity;
  const gainLoss = presentValue - row.investment;
  return {
    ...row,
    cmp,
    presentValue,
    gainLoss,
    peRatio,
    latestEarnings,
  };
}

/** Resolve CMP: use provided map or fallback to purchase price. Used by service layer when integrating Yahoo/Google. */
export function resolveCmp(
  seed: SeedHolding,
  cmpBySymbol: Map<string, number>
): number {
  const cmp = cmpBySymbol.get(seed.nseBse);
  return typeof cmp === 'number' && Number.isFinite(cmp) ? cmp : seed.purchasePrice;
}

export const portfolioModel = {
  getSeed(sector?: string): SeedHolding[] {
    const all = loadSeed();
    if (sector) {
      return all.filter((r) => r.sector === sector);
    }
    return all;
  },

  async getHoldings(
    sector?: string,
    cmpBySymbol?: Map<string, number>,
    peBySymbol?: Map<string, number | null>,
    earningsBySymbol?: Map<string, string | null>
  ): Promise<Holding[]> {
    const seed = this.getSeed(sector);
    const cmpMap = cmpBySymbol ?? new Map();
    const peMap = peBySymbol ?? new Map();
    const earningsMap = earningsBySymbol ?? new Map();

    return seed.map((row) =>
      addComputedFields(
        row,
        resolveCmp(row, cmpMap),
        peMap.get(row.nseBse) ?? null,
        earningsMap.get(row.nseBse) ?? null
      )
    );
  },

  async getSectorsSummary(
    cmpBySymbol?: Map<string, number>,
    peBySymbol?: Map<string, number | null>,
    earningsBySymbol?: Map<string, string | null>
  ): Promise<SectorSummary[]> {
    const holdings = await this.getHoldings(undefined, cmpBySymbol, peBySymbol, earningsBySymbol);
    const bySector = new Map<string, SectorSummary>();

    for (const h of holdings) {
      const existing = bySector.get(h.sector);
      if (existing) {
        existing.totalInvestment += h.investment;
        existing.totalPresentValue += h.presentValue;
        existing.gainLoss += h.gainLoss;
        existing.holdingsCount += 1;
      } else {
        bySector.set(h.sector, {
          sector: h.sector,
          totalInvestment: h.investment,
          totalPresentValue: h.presentValue,
          gainLoss: h.gainLoss,
          holdingsCount: 1,
        });
      }
    }

    return Array.from(bySector.values());
  },
};
