import { Router } from 'express';
import { portfolioRoutes } from './portfolio.routes.js';

export const apiRoutes = Router();

apiRoutes.use('/portfolio', portfolioRoutes);
