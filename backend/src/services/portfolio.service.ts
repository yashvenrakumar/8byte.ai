import { portfolioModel } from '../models/portfolio.model.js';
import type { Holding, SectorSummary } from '../models/portfolio.model.js';

export const portfolioService = {
  async getPortfolio(): Promise<{ holdings: Holding[] }> {
    const holdings = await portfolioModel.getHoldings();
    return { holdings };
  },

  async getSectorsSummary(): Promise<{ sectors: SectorSummary[] }> {
    const sectors = await portfolioModel.getSectorsSummary();
    return { sectors };
  },
};
