import { Request, Response } from 'express';
import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../middleware/standardResponse.js';

class PortfolioController {
  async getPortfolio(_req: Request, res: Response): Promise<void> {
    const data = await portfolioService.getPortfolio();
    sendSuccess(res, data);
  }

  async getSectors(_req: Request, res: Response): Promise<void> {
    const data = await portfolioService.getSectorsSummary();
    sendSuccess(res, data);
  }
}

export const portfolioController = new PortfolioController();
