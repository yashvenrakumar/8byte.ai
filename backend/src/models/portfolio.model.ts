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

// In-memory / placeholder data; replace with DB or file read (e.g. from Excel/JSON)
const MOCK_HOLDINGS: Omit<Holding, 'cmp' | 'presentValue' | 'gainLoss' | 'peRatio' | 'latestEarnings'>[] = [
  {
    id: '1',
    particulars: 'Reliance Industries',
    purchasePrice: 2400,
    quantity: 10,
    investment: 24000,
    portfolioPercent: 15,
    nseBse: 'NSE',
    sector: 'Energy',
  },
  {
    id: '2',
    particulars: 'TCS',
    purchasePrice: 3500,
    quantity: 5,
    investment: 17500,
    portfolioPercent: 11,
    nseBse: 'NSE',
    sector: 'Technology',
  },
];

function addComputedFields(
  row: (typeof MOCK_HOLDINGS)[0],
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

export const portfolioModel = {
  async getHoldings(): Promise<Holding[]> {
    // TODO: Integrate Yahoo Finance (CMP), Google Finance (P/E, Earnings)
    // Placeholder: use purchase price as CMP for init
    return MOCK_HOLDINGS.map((row) =>
      addComputedFields(row, row.purchasePrice, null, null)
    );
  },

  async getSectorsSummary(): Promise<SectorSummary[]> {
    const holdings = await this.getHoldings();
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
