import { Request, Response } from 'express';
import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../middleware/standardResponse.js';
import { validateGetPortfolioQuery } from '../validation/portfolio.validation.js';

class PortfolioController {
  async getPortfolio(req: Request, res: Response): Promise<void> {
    const query = validateGetPortfolioQuery(req.query as Record<string, unknown>);
    const data = await portfolioService.getPortfolio(query.sector);
    sendSuccess(res, data);
  }

  async getSectors(_req: Request, res: Response): Promise<void> {
    const data = await portfolioService.getSectorsSummary();
    sendSuccess(res, data);
  }
}

export const portfolioController = new PortfolioController();
