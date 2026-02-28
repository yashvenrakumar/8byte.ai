import { Request, Response, NextFunction } from 'express';
import { sendError } from './standardResponse.js';
import { config } from '../config/index.js';

export function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message =
    config.nodeEnv === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message ?? 'Internal server error';

  if (config.nodeEnv === 'development') {
    console.error('[Error]', err);
  }

  sendError(res, message, statusCode);
}
