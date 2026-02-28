import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller.js';
import { asyncHandler } from '../middleware/standardResponse.js';

const router = Router();

router.get('/', asyncHandler(portfolioController.getPortfolio.bind(portfolioController)));
router.get('/sectors', asyncHandler(portfolioController.getSectors.bind(portfolioController)));

export const portfolioRoutes = router;
