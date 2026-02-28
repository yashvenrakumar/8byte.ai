import { portfolioModel } from '../models/portfolio.model.js';
import type { Holding, SectorSummary } from '../models/portfolio.model.js';
import {
  fetchCmpBatch,
  fetchFundamentalsBatch,
} from './marketData.service.js';

export const portfolioService = {
  async getPortfolio(
    sector?: string,
    options?: { skipMarketData?: boolean }
  ): Promise<{ holdings: Holding[] }> {
    const seed = portfolioModel.getSeed(sector);
    const symbols = [...new Set(seed.map((s) => s.nseBse))];

    let cmpMap = new Map<string, number>();
    let peMap = new Map<string, number | null>();
    let earningsMap = new Map<string, string | null>();

    if (!options?.skipMarketData && symbols.length > 0) {
      const [cmpResult, fundResult] = await Promise.all([
        fetchCmpBatch(symbols),
        fetchFundamentalsBatch(symbols),
      ]);
      cmpMap = cmpResult;
      peMap = fundResult.peBySymbol;
      earningsMap = fundResult.earningsBySymbol;
    }

    const holdings = await portfolioModel.getHoldings(
      sector,
      cmpMap,
      peMap,
      earningsMap
    );
    return { holdings };
  },

  async getSectorsSummary(options?: {
    skipMarketData?: boolean;
  }): Promise<{ sectors: SectorSummary[] }> {
    const seed = portfolioModel.getSeed();
    const symbols = [...new Set(seed.map((s) => s.nseBse))];
    let cmpMap = new Map<string, number>();
    let peMap = new Map<string, number | null>();
    let earningsMap = new Map<string, string | null>();

    if (!options?.skipMarketData && symbols.length > 0) {
      const [cmpResult, fundResult] = await Promise.all([
        fetchCmpBatch(symbols),
        fetchFundamentalsBatch(symbols),
      ]);
      cmpMap = cmpResult;
      peMap = fundResult.peBySymbol;
      earningsMap = fundResult.earningsBySymbol;
    }

    const sectors = await portfolioModel.getSectorsSummary(
      cmpMap,
      peMap,
      earningsMap
    );
    return { sectors };
  },
};
